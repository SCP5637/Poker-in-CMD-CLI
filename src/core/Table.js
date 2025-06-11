import { Deck } from './Deck.js';
import { PlayerStatus } from './Player.js';

/**
 * 下注轮次枚举
 * @enum {string}
 */
export const BettingRound = {
    PREFLOP: 'preflop',   // 翻牌前
    FLOP: 'flop',         // 翻牌
    TURN: 'turn',         // 转牌
    RIVER: 'river'        // 河牌
};

/**
 * 牌桌类
 * 管理德州扑克牌桌的状态，包括玩家、公共牌和底池
 */
export class Table {
    /**
     * 创建一个新牌桌
     * @param {number} smallBlind - 小盲注金额
     * @param {number} bigBlind - 大盲注金额
     * @param {number} minPlayers - 最少玩家数（默认2）
     * @param {number} maxPlayers - 最多玩家数（默认9）
     */
    constructor(smallBlind, bigBlind, minPlayers = 2, maxPlayers = 9) {
        if (smallBlind <= 0 || bigBlind <= 0) {
            throw new Error('Blind amounts must be positive');
        }
        if (bigBlind <= smallBlind) {
            throw new Error('Big blind must be greater than small blind');
        }
        if (minPlayers < 2 || maxPlayers > 9) {
            throw new Error('Invalid player limits');
        }

        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;

        this.players = new Array(maxPlayers).fill(null);  // 玩家数组，null表示空位
        this.deck = new Deck();
        this.communityCards = [];      // 公共牌
        this.pot = 0;                  // 主底池
        this.sidePots = [];            // 边池
        this.currentRound = null;      // 当前下注轮次
        this.dealerPosition = -1;      // 庄家位置
        this.activePlayerCount = 0;    // 当前在牌桌上的玩家数量
    }

    /**
     * 添加玩家到牌桌
     * @param {Player} player - 要添加的玩家
     * @param {number} position - 要坐的位置（0-8）
     * @throws {Error} 如果位置无效或已被占用
     */
    addPlayer(player, position) {
        if (position < 0 || position >= this.maxPlayers) {
            throw new Error('Invalid position');
        }
        if (this.players[position] !== null) {
            throw new Error('Position already occupied');
        }
        this.players[position] = player;
        this.activePlayerCount++;
    }

    /**
     * 从牌桌移除玩家
     * @param {number} position - 要移除玩家的位置
     */
    removePlayer(position) {
        if (this.players[position] !== null) {
            this.players[position] = null;
            this.activePlayerCount--;
        }
    }

    /**
     * 开始新的一轮游戏
     * @throws {Error} 如果活跃玩家数量不足
     */
    startNewRound() {
        if (this.activePlayerCount < this.minPlayers) {
            throw new Error('Not enough players to start a round');
        }

        // 移动庄家位置
        this.moveDealerButton();

        // 重置牌桌状态
        this.deck.reset();
        this.deck.shuffle();
        this.communityCards = [];
        this.pot = 0;
        this.sidePots = [];
        this.currentRound = BettingRound.PREFLOP;

        // 重置所有玩家的状态
        this.players.forEach(player => {
            if (player !== null) {
                player.resetForNewRound();
            }
        });

        // 发手牌
        this.dealHoleCards();
    }

    /**
     * 移动庄家按钮到下一个有玩家的位置
     */
    moveDealerButton() {
        if (this.dealerPosition === -1) {
            // 第一轮游戏，随机选择庄家位置
            const activePlayers = this.players.map((p, i) => p !== null ? i : -1).filter(i => i !== -1);
            this.dealerPosition = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        } else {
            // 找到下一个有玩家的位置
            let position = (this.dealerPosition + 1) % this.maxPlayers;
            while (this.players[position] === null) {
                position = (position + 1) % this.maxPlayers;
            }
            this.dealerPosition = position;
        }
    }

    /**
     * 发手牌给所有玩家
     */
    dealHoleCards() {
        this.players.forEach(player => {
            if (player !== null && player.chips > 0) {
                const cards = this.deck.deal(2);
                player.dealHoleCards(cards);
            }
        });
    }

    /**
     * 发公共牌
     * @param {number} count - 要发的牌的数量
     */
    dealCommunityCards(count) {
        const cards = this.deck.deal(count);
        this.communityCards.push(...cards);
    }

    /**
     * 获取下一个可以行动的玩家的位置
     * @param {number} currentPosition - 当前位置
     * @returns {number} 下一个可以行动的玩家的位置，如果没有则返回-1
     */
    getNextActivePlayer(currentPosition) {
        let position = (currentPosition + 1) % this.maxPlayers;
        let count = 0;
        while (count < this.maxPlayers) {
            const player = this.players[position];
            if (player !== null && player.canAct()) {
                return position;
            }
            position = (position + 1) % this.maxPlayers;
            count++;
        }
        return -1;
    }

    /**
     * 获取小盲注位置
     * @returns {number} 小盲注位置
     */
    getSmallBlindPosition() {
        return this.getNextActivePlayer(this.dealerPosition);
    }

    /**
     * 获取大盲注位置
     * @returns {number} 大盲注位置
     */
    getBigBlindPosition() {
        return this.getNextActivePlayer(this.getSmallBlindPosition());
    }

    /**
     * 收集所有玩家的当前下注到底池
     */
    collectBets() {
        this.players.forEach(player => {
            if (player !== null) {
                this.pot += player.getCurrentBet();
                player.resetCurrentBet();
            }
        });
    }

    /**
     * 检查当前轮次是否结束（所有玩家下注相等或弃牌/ALL-IN）
     * @returns {boolean} 如果当前轮次结束返回true
     */
    isRoundComplete() {
        const activePlayers = this.players.filter(p => p !== null && p.isInGame());
        if (activePlayers.length <= 1) return true;

        const bets = activePlayers.map(p => p.getCurrentBet());
        const maxBet = Math.max(...bets);
        return activePlayers.every(p => 
            p.getCurrentBet() === maxBet || 
            p.status === PlayerStatus.ALL_IN || 
            p.status === PlayerStatus.FOLDED
        );
    }

    /**
     * 进入下一个下注轮次
     * @returns {boolean} 如果成功进入下一轮返回true，如果游戏结束返回false
     */
    nextBettingRound() {
        this.collectBets();

        switch (this.currentRound) {
            case BettingRound.PREFLOP:
                this.currentRound = BettingRound.FLOP;
                this.dealCommunityCards(3);  // 发翻牌
                break;
            case BettingRound.FLOP:
                this.currentRound = BettingRound.TURN;
                this.dealCommunityCards(1);  // 发转牌
                break;
            case BettingRound.TURN:
                this.currentRound = BettingRound.RIVER;
                this.dealCommunityCards(1);  // 发河牌
                break;
            case BettingRound.RIVER:
                return false;  // 游戏结束
            default:
                throw new Error('Invalid betting round');
        }
        return true;
    }

    /**
     * 获取牌桌状态的字符串表示
     * @returns {string} 牌桌状态的字符串表示
     */
    toString() {
        let result = `Dealer: Position ${this.dealerPosition}\n`;
        result += `Community Cards: ${this.communityCards.map(c => c.toString()).join(' ')}\n`;
        result += `Pot: ${this.pot}\n`;
        result += 'Players:\n';
        this.players.forEach((player, i) => {
            if (player !== null) {
                result += `Position ${i}: ${player.toString()}\n`;
            }
        });
        return result;
    }
}