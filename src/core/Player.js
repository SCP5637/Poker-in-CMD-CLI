/**
 * 玩家状态枚举
 * @enum {string}
 */
export const PlayerStatus = {
    ACTIVE: 'active',         // 玩家正在游戏中且可以行动
    ALL_IN: 'all-in',        // 玩家已经全押
    FOLDED: 'folded',        // 玩家已弃牌
    OUT: 'out'               // 玩家出局（没有筹码）
};

/**
 * 玩家类
 * 表示一个德州扑克玩家
 */
export class Player {
    /**
     * 创建一个新玩家
     * @param {string} name - 玩家名称
     * @param {number} chips - 初始筹码数量
     * @param {number} position - 玩家在桌子上的位置（0-8，最多9个位置）
     */
    constructor(name, chips, position) {
        if (chips < 0) {
            throw new Error('Initial chips cannot be negative');
        }
        if (position < 0 || position > 8) {
            throw new Error('Position must be between 0 and 8');
        }

        this.name = name;
        this.chips = chips;
        this.position = position;
        this.holeCards = [];          // 玩家的手牌
        this.currentBet = 0;          // 当前轮次的下注额
        this.totalBet = 0;            // 当前牌局的总下注额
        this.status = PlayerStatus.ACTIVE;
        this.bestHand = null;         // 玩家当前最佳手牌组合
    }

    /**
     * 给玩家发牌
     * @param {Card[]} cards - 要发给玩家的牌
     */
    dealHoleCards(cards) {
        if (cards.length !== 2) {
            throw new Error('Must deal exactly 2 cards');
        }
        this.holeCards = [...cards];
    }

    /**
     * 玩家下注
     * @param {number} amount - 下注金额
     * @throws {Error} 如果下注金额无效或玩家筹码不足
     */
    bet(amount) {
        if (amount < 0) {
            throw new Error('Bet amount cannot be negative');
        }
        if (amount > this.chips) {
            throw new Error('Not enough chips');
        }
        if (this.status !== PlayerStatus.ACTIVE) {
            throw new Error('Player cannot bet in current status');
        }

        this.chips -= amount;
        this.currentBet += amount;
        this.totalBet += amount;

        if (this.chips === 0) {
            this.status = PlayerStatus.ALL_IN;
        }
    }

    /**
     * 玩家弃牌
     */
    fold() {
        if (this.status === PlayerStatus.ACTIVE || this.status === PlayerStatus.ALL_IN) {
            this.status = PlayerStatus.FOLDED;
            this.holeCards = [];
        }
    }

    /**
     * 重置玩家状态，准备新的一轮
     */
    resetForNewRound() {
        this.holeCards = [];
        this.currentBet = 0;
        this.totalBet = 0;
        this.bestHand = null;
        this.status = this.chips > 0 ? PlayerStatus.ACTIVE : PlayerStatus.OUT;
    }

    /**
     * 增加玩家筹码（赢得彩池时调用）
     * @param {number} amount - 要增加的筹码数量
     */
    addChips(amount) {
        if (amount < 0) {
            throw new Error('Cannot add negative chips');
        }
        this.chips += amount;
        if (this.status === PlayerStatus.OUT && this.chips > 0) {
            this.status = PlayerStatus.ACTIVE;
        }
    }

    /**
     * 获取玩家的手牌
     * @returns {Card[]} 玩家的手牌
     */
    getHoleCards() {
        return [...this.holeCards];
    }

    /**
     * 获取玩家当前轮次的下注额
     * @returns {number} 当前轮次的下注额
     */
    getCurrentBet() {
        return this.currentBet;
    }

    /**
     * 获取玩家在当前牌局的总下注额
     * @returns {number} 当前牌局的总下注额
     */
    getTotalBet() {
        return this.totalBet;
    }

    /**
     * 重置当前轮次的下注额（进入新的下注轮次时调用）
     */
    resetCurrentBet() {
        this.currentBet = 0;
    }

    /**
     * 检查玩家是否还在游戏中（未弃牌且未出局）
     * @returns {boolean} 如果玩家还在游戏中返回true
     */
    isInGame() {
        return this.status === PlayerStatus.ACTIVE || this.status === PlayerStatus.ALL_IN;
    }

    /**
     * 检查玩家是否可以行动
     * @returns {boolean} 如果玩家可以行动返回true
     */
    canAct() {
        return this.status === PlayerStatus.ACTIVE;
    }

    /**
     * 获取玩家信息的字符串表示
     * @returns {string} 玩家信息的字符串表示
     */
    toString() {
        const cards = this.holeCards.length > 0 
            ? this.holeCards.map(card => card.toString()).join(' ') 
            : '[]';
        let result = `${this.name} (${this.status}): ${cards} - Chips: ${this.chips}`;
        
        if (this.bestHand) {
            result += ` - Best Hand: ${this.bestHand.toString()}`;
        }
        
        return result;
    }
    
    /**
     * 获取玩家的最佳手牌
     * @returns {Hand|null} 玩家的最佳手牌组合
     */
    getBestHand() {
        return this.bestHand;
    }

    /**
     * 设置玩家的最佳手牌
     * @param {Hand} hand - 玩家的最佳手牌组合
     */
    setBestHand(hand) {
        this.bestHand = hand;
    }

    /**
     * 获取玩家当前状态
     * @returns {PlayerStatus} 玩家当前状态
     */
    getStatus() {
        return this.status;
    }
}