import { BettingRound } from './Table.js';
import { PlayerStatus } from './Player.js';
import { Card } from './Card.js';
import { HandEvaluator } from '../poker/HandEvaluator.js';

/**
 * 游戏状态枚举
 * @enum {string}
 */
export const GameState = {
    WAITING: 'waiting',       // 等待开始
    BETTING: 'betting',       // 下注阶段
    SHOWDOWN: 'showdown',     // 摊牌阶段
    FINISHED: 'finished'      // 游戏结束
};

/**
 * 游戏状态中文描述
 * @enum {string}
 */
export const GameStateDescription = {
    [GameState.WAITING]: '等待开始',
    [GameState.BETTING]: '下注中',
    [GameState.SHOWDOWN]: '摊牌',
    [GameState.FINISHED]: '已结束'
};

/**
 * 玩家行动枚举
 * @enum {string}
 */
export const PlayerAction = {
    FOLD: 'fold',             // 弃牌
    CHECK: 'check',           // 过牌
    CALL: 'call',             // 跟注
    BET: 'bet',               // 下注
    RAISE: 'raise'            // 加注
};

/**
 * 德州扑克游戏类
 * 控制游戏流程和规则
 */
export class Game {
    /**
     * 创建一个新游戏
     * @param {Table} table - 游戏使用的牌桌
     */
    constructor(table) {
        this.table = table;
        this.state = GameState.WAITING;
        this.currentPlayerPosition = -1;
        this.currentBet = 0;           // 当前轮次的最高下注额
        this.minRaise = 0;             // 最小加注额
        this.lastRaisePosition = -1;   // 最后一次加注的玩家位置
        this.currentRound = 0;         // 当前下注轮次（0=翻牌前，1=翻牌，2=转牌，3=河牌）
        this.lastPotAmount = 0;        // 记录最后一次底池金额
    }

    /**
     * 开始新的一轮游戏
     */
    startNewRound() {
        this.table.startNewRound();
        this.state = GameState.BETTING;
        this.currentBet = 0;
        this.minRaise = this.table.bigBlind;
        this.currentRound = 0;
        this.lastPotAmount = 0;

        // 收取盲注
        this.collectBlinds();

        // 设置第一个行动的玩家（翻牌前是大盲注后面的玩家）
        const bigBlindPos = this.table.getBigBlindPosition();
        this.currentPlayerPosition = this.table.getNextActivePlayer(bigBlindPos);
        this.lastRaisePosition = bigBlindPos;  // 大盲注相当于一次加注
    }

    /**
     * 收取小盲注和大盲注
     */
    collectBlinds() {
        const smallBlindPos = this.table.getSmallBlindPosition();
        const bigBlindPos = this.table.getBigBlindPosition();

        const smallBlindPlayer = this.table.players[smallBlindPos];
        const bigBlindPlayer = this.table.players[bigBlindPos];

        // 收取小盲注
        const smallBlindAmount = Math.min(smallBlindPlayer.chips, this.table.smallBlind);
        smallBlindPlayer.bet(smallBlindAmount);

        // 收取大盲注
        const bigBlindAmount = Math.min(bigBlindPlayer.chips, this.table.bigBlind);
        bigBlindPlayer.bet(bigBlindAmount);

        this.currentBet = bigBlindAmount;
    }

    /**
     * 处理玩家行动
     * @param {number} position - 玩家位置
     * @param {string} action - 行动类型（PlayerAction枚举值）
     * @param {number} amount - 下注/加注金额（如果适用）
     * @throws {Error} 如果行动无效
     */
    handlePlayerAction(position, action, amount = 0) {
        if (this.state !== GameState.BETTING) {
            throw new Error('当前游戏状态下无法行动');
        }
        if (position !== this.currentPlayerPosition) {
            throw new Error('不是你的行动回合');
        }

        const player = this.table.players[position];
        if (!player || !player.canAct()) {
            throw new Error('玩家无法行动');
        }

        switch (action) {
            case PlayerAction.FOLD:
                player.fold();
                break;

            case PlayerAction.CHECK:
                if (this.currentBet > player.getCurrentBet()) {
                    throw new Error('当前有下注时无法看牌');
                }
                break;

            case PlayerAction.CALL:
                const callAmount = this.currentBet - player.getCurrentBet();
                if (callAmount > 0) {
                    if (callAmount > player.chips) {
                        // 如果玩家筹码不够跟注，就全下
                        player.bet(player.chips);
                        player.setStatus(PlayerStatus.ALL_IN);
                    } else {
                        player.bet(callAmount);
                    }
                }
                break;

            case PlayerAction.BET:
                if (this.currentBet > 0) {
                    throw new Error('已经有下注时无法下注');
                }
                if (amount < this.table.bigBlind) {
                    throw new Error(`下注金额必须至少为大盲注 (${this.table.bigBlind})`);
                }
                if (amount > player.chips) {
                    throw new Error('筹码不足');
                }
                player.bet(amount);
                this.currentBet = amount;
                this.minRaise = amount;
                this.lastRaisePosition = position;
                break;

            case PlayerAction.RAISE:
                if (this.currentBet === 0) {
                    throw new Error('没有下注时无法加注');
                }
                const raiseTotal = this.currentBet + this.minRaise;
                if (amount < raiseTotal) {
                    throw new Error(`加注金额必须至少为 ${raiseTotal}`);
                }
                const raiseAmount = amount - player.getCurrentBet();
                if (raiseAmount > player.chips) {
                    throw new Error('筹码不足');
                }
                player.bet(raiseAmount);
                this.currentBet = amount;
                this.minRaise = amount - this.currentBet;
                this.lastRaisePosition = position;
                break;

            default:
                throw new Error('无效的行动');
        }

        this.moveToNextPlayer();
    }

    /**
     * 移动到下一个可以行动的玩家
     */
    moveToNextPlayer() {
        // 检查当前轮次是否结束
        if (this.isCurrentBettingRoundComplete()) {
            this.finishBettingRound();
            return;
        }

        // 找到下一个可以行动的玩家
        this.currentPlayerPosition = this.table.getNextActivePlayer(this.currentPlayerPosition);
    }

    /**
     * 检查当前下注轮次是否结束
     * @returns {boolean} 如果当前下注轮次结束返回true
     */
    isCurrentBettingRoundComplete() {
        // 如果只剩一个玩家，轮次结束
        const activePlayers = this.table.players.filter(p => p !== null && p.isInGame());
        if (activePlayers.length <= 1) {
            return true;
        }

        // 如果所有玩家都已经行动且下注相等或者ALL-IN，轮次结束
        const nextPlayer = this.table.getNextActivePlayer(this.currentPlayerPosition);
        return nextPlayer === -1 || nextPlayer === this.lastRaisePosition;
    }

    /**
     * 结束当前下注轮次
     */
    finishBettingRound() {
        // 在收集下注到底池之前记录当前底池金额
        this.lastPotAmount = this.table.pot.getTotalAmount();

        // 收集所有下注到底池
        this.table.collectBets();
        this.currentBet = 0;

        // 检查是否只剩一个玩家
        const activePlayers = this.table.players.filter(p => p !== null && p.isInGame());
        if (activePlayers.length <= 1) {
            this.finishRound();
            return;
        }

        // 进入下一个下注轮次
        this.currentRound++;
        const hasNextRound = this.currentRound < 4; // 4轮下注：翻牌前、翻牌、转牌、河牌
        
        if (hasNextRound) {
            // 发公共牌
            this.table.nextBettingRound();
            // 设置下一轮第一个行动的玩家（翻牌后是庄家后面的第一个玩家）
            this.currentPlayerPosition = this.table.getNextActivePlayer(this.table.dealerPosition);
            this.lastRaisePosition = -1;
            this.minRaise = this.table.bigBlind;
        } else {
            this.state = GameState.SHOWDOWN;
            this.determineWinners();
        }
    }

    /**
     * 结束当前牌局
     */
    finishRound() {
        // 如果只剩一个玩家，他赢得所有筹码
        const activePlayers = this.table.players.filter(p => p !== null && p.isInGame());
        if (activePlayers.length === 1) {
            const potAmount = this.table.pot.getTotalAmount();
            activePlayers[0].addChips(potAmount);
            this.lastPotAmount = potAmount; // 记录最后的底池金额
            this.table.pot.reset();
        } else {
            // 显示所有公共牌
            this.table.revealAllCommunityCards();
            
            // 计算并保存每个玩家的最佳手牌，用于UI显示
            activePlayers.forEach(player => {
                player.bestHand = this.getPlayerHand(player);
            });
            
            this.state = GameState.SHOWDOWN;
            this.determineWinners();
        }

        this.state = GameState.FINISHED;
    }

    /**
     * 确定赢家并分配筹码
     */
    determineWinners() {
        const activePlayers = this.table.players.filter(p => p !== null && p.isInGame());
        if (activePlayers.length === 0) return;
        
        // 如果只有一个玩家，他直接赢得所有筹码
        if (activePlayers.length === 1) {
            const potAmount = this.table.pot.getTotalAmount();
            this.lastPotAmount = potAmount; // 记录最后的底池金额
            activePlayers[0].addChips(potAmount);
            this.table.pot.reset();
            return;
        }
        
        // 使用HandEvaluator确定赢家
        const winners = HandEvaluator.determineWinners(activePlayers, this.table.communityCards);
        
        // 平均分配筹码给所有赢家
        if (winners.length > 0) {
            const potAmount = this.table.pot.getTotalAmount();
            this.lastPotAmount = potAmount; // 记录最后的底池金额
            const winAmount = Math.floor(potAmount / winners.length);
            const remainder = potAmount % winners.length;
            
            winners.forEach(winner => {
                winner.addChips(winAmount);
            });
            
            // 如果有余数，分给第一个赢家（通常是庄家位置最近的玩家）
            if (remainder > 0) {
                winners[0].addChips(remainder);
            }
            
            this.table.pot.reset();
        }
    }
    
    /**
     * 获取玩家的最佳手牌
     * @param {Player} player - 玩家
     * @returns {Hand|null} 玩家的最佳手牌，如果玩家不在游戏中则返回null
     */
    getPlayerHand(player) {
        if (!player || !player.isInGame()) return null;
        
        const cards = [...player.holeCards, ...this.table.communityCards];
        return HandEvaluator.evaluate(cards);
    }

    /**
     * 获取当前可以行动的玩家
     * @returns {Player|null} 当前可以行动的玩家，如果没有则返回null
     */
    getCurrentPlayer() {
        if (this.currentPlayerPosition === -1) return null;
        return this.table.players[this.currentPlayerPosition];
    }

    /**
     * 获取游戏状态的字符串表示
     * @returns {string} 游戏状态的字符串表示
     */
    toString() {
        let result = `游戏状态: ${GameStateDescription[this.state]}\n`;
        result += `当前下注: ${this.currentBet}\n`;
        result += `当前玩家: ${this.currentPlayerPosition}\n`;
        result += this.table.toString();
        return result;
    }

    /**
     * 获取最后记录的底池金额
     * @returns {number} 最后记录的底池金额
     */
    getLastPotAmount() {
        return this.lastPotAmount;
    }
}