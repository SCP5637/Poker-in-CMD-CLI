import { BettingRules } from './BettingRules.js';
import { PlayerStatus } from '../core/Player.js';

/**
 * 下注轮次类
 * 管理单个下注轮次的所有操作
 */
export class BettingRound {
    /**
     * 创建一个新的下注轮次
     * @param {Table} table - 牌桌实例
     * @param {string} roundType - 下注轮次类型（preflop, flop, turn, river）
     * @param {number} minBet - 最小下注金额（通常是大盲注）
     */
    constructor(table, roundType, minBet) {
        this.table = table;
        this.roundType = roundType;
        this.minBet = minBet;
        
        this.currentBet = 0;          // 当前最高下注额
        this.lastRaise = 0;           // 上一次加注金额
        this.currentPosition = -1;     // 当前行动位置
        this.lastAggressorPosition = -1; // 最后一个加注者的位置
        this.roundComplete = false;    // 轮次是否结束
        this.actedPlayers = new Set(); // 已经行动过的玩家集合
    }

    /**
     * 开始下注轮次
     */
    start() {
        // 在翻牌前，从小盲注位置开始
        if (this.roundType === 'preflop') {
            this.currentPosition = this.table.getSmallBlindPosition();
            // 收取盲注
            this.collectBlinds();
        } else {
            // 其他轮次从庄家下一个位置开始
            this.currentPosition = this.table.getNextActivePlayer(this.table.dealerPosition);
        }
    }

    /**
     * 收取盲注
     */
    collectBlinds() {
        // 小盲注
        const smallBlindPos = this.table.getSmallBlindPosition();
        const smallBlindPlayer = this.table.players[smallBlindPos];
        if (smallBlindPlayer) {
            smallBlindPlayer.bet(this.table.smallBlind);
            this.currentBet = this.table.smallBlind;
        }

        // 大盲注
        const bigBlindPos = this.table.getBigBlindPosition();
        const bigBlindPlayer = this.table.players[bigBlindPos];
        if (bigBlindPlayer) {
            bigBlindPlayer.bet(this.table.bigBlind);
            this.currentBet = this.table.bigBlind;
            this.lastAggressorPosition = bigBlindPos;
        }
    }

    /**
     * 处理玩家的下注操作
     * @param {Player} player - 行动的玩家
     * @param {string} action - 行动类型（bet, call, raise, check, fold）
     * @param {number} amount - 下注金额（如果适用）
     * @returns {boolean} 如果操作有效返回true
     */
    handleAction(player, action, amount = 0) {
        if (!this.isValidAction(player, action, amount)) {
            return false;
        }

        this.actedPlayers.add(player);

        switch (action) {
            case 'bet':
                return this.handleBet(player, amount);
            case 'call':
                return this.handleCall(player);
            case 'raise':
                return this.handleRaise(player, amount);
            case 'check':
                return this.handleCheck(player);
            case 'fold':
                return this.handleFold(player);
            default:
                return false;
        }
    }

    /**
     * 处理下注操作
     * @param {Player} player - 下注的玩家
     * @param {number} amount - 下注金额
     * @returns {boolean} 如果操作成功返回true
     */
    handleBet(player, amount) {
        if (!BettingRules.isValidBet(player, amount, this.minBet, this.currentBet)) {
            return false;
        }

        player.bet(amount);
        this.currentBet = amount;
        this.lastRaise = amount;
        this.lastAggressorPosition = this.currentPosition;
        return true;
    }

    /**
     * 处理跟注操作
     * @param {Player} player - 跟注的玩家
     * @returns {boolean} 如果操作成功返回true
     */
    handleCall(player) {
        if (!BettingRules.isValidCall(player, this.currentBet)) {
            return false;
        }

        const amountToCall = this.currentBet - player.getCurrentBet();
        player.bet(amountToCall);
        return true;
    }

    /**
     * 处理加注操作
     * @param {Player} player - 加注的玩家
     * @param {number} amount - 加注金额
     * @returns {boolean} 如果操作成功返回true
     */
    handleRaise(player, amount) {
        const minRaise = BettingRules.getMinRaise(this.currentBet, this.lastRaise, this.minBet);
        if (!BettingRules.isValidRaise(player, amount, this.currentBet, minRaise)) {
            return false;
        }

        player.bet(amount);
        this.lastRaise = amount - this.currentBet;
        this.currentBet = amount;
        this.lastAggressorPosition = this.currentPosition;
        return true;
    }

    /**
     * 处理看牌操作
     * @param {Player} player - 看牌的玩家
     * @returns {boolean} 如果操作成功返回true
     */
    handleCheck(player) {
        return BettingRules.isValidCheck(player, this.currentBet);
    }

    /**
     * 处理弃牌操作
     * @param {Player} player - 弃牌的玩家
     * @returns {boolean} 始终返回true，因为弃牌总是有效的
     */
    handleFold(player) {
        player.setStatus(PlayerStatus.FOLDED);
        return true;
    }

    /**
     * 移动到下一个可以行动的玩家
     * @returns {boolean} 如果找到下一个玩家返回true，如果轮次结束返回false
     */
    moveToNextPlayer() {
        const nextPosition = this.table.getNextActivePlayer(this.currentPosition);
        
        // 如果没有找到下一个活跃玩家，轮次结束
        if (nextPosition === -1) {
            this.roundComplete = true;
            return false;
        }

        this.currentPosition = nextPosition;
        const player = this.table.players[nextPosition];

        // 检查是否所有玩家都行动过且回到了最后加注者
        if (this.actedPlayers.size > 0 && 
            nextPosition === this.lastAggressorPosition) {
            this.roundComplete = true;
            return false;
        }

        return true;
    }

    /**
     * 检查当前行动是否有效
     * @param {Player} player - 要行动的玩家
     * @param {string} action - 行动类型
     * @param {number} amount - 下注金额（如果适用）
     * @returns {boolean} 如果行动有效返回true
     */
    isValidAction(player, action, amount) {
        // 检查是否轮到该玩家行动
        if (this.table.players[this.currentPosition] !== player) {
            return false;
        }

        // 检查轮次是否已经结束
        if (this.roundComplete) {
            return false;
        }

        // 检查玩家是否可以行动
        if (!player.canAct()) {
            return false;
        }

        return true;
    }

    /**
     * 检查轮次是否结束
     * @returns {boolean} 如果轮次结束返回true
     */
    isComplete() {
        return this.roundComplete || this.table.isRoundComplete();
    }

    /**
     * 获取当前最高下注额
     * @returns {number} 当前最高下注额
     */
    getCurrentBet() {
        return this.currentBet;
    }

    /**
     * 获取当前行动的玩家
     * @returns {Player|null} 当前行动的玩家，如果没有则返回null
     */
    getCurrentPlayer() {
        if (this.currentPosition === -1) {
            return null;
        }
        return this.table.players[this.currentPosition];
    }
}