/**
 * 扑克牌型排名定义
 * 数值越大表示牌型越强
 */
export const HandRanking = {
    HIGH_CARD: 1,        // 高牌
    ONE_PAIR: 2,         // 一对
    TWO_PAIR: 3,         // 两对
    THREE_OF_A_KIND: 4,  // 三条
    STRAIGHT: 5,         // 顺子
    FLUSH: 6,            // 同花
    FULL_HOUSE: 7,       // 葫芦
    FOUR_OF_A_KIND: 8,   // 四条
    STRAIGHT_FLUSH: 9,   // 同花顺
    ROYAL_FLUSH: 10      // 皇家同花顺
};

/**
 * 牌型描述
 */
export const HandDescription = {
    [HandRanking.HIGH_CARD]: "高牌",
    [HandRanking.ONE_PAIR]: "一对",
    [HandRanking.TWO_PAIR]: "两对",
    [HandRanking.THREE_OF_A_KIND]: "三条",
    [HandRanking.STRAIGHT]: "顺子",
    [HandRanking.FLUSH]: "同花",
    [HandRanking.FULL_HOUSE]: "葫芦",
    [HandRanking.FOUR_OF_A_KIND]: "四条",
    [HandRanking.STRAIGHT_FLUSH]: "同花顺",
    [HandRanking.ROYAL_FLUSH]: "同花顺"
};

/**
 * 表示一个已评估的手牌
 */
export class Hand {
    /**
     * 创建一个手牌对象
     * @param {number} rank - 牌型排名（来自HandRanking）
     * @param {Array<Card>} cards - 构成这个牌型的五张牌
     * @param {Array<Card>} kickers - 用于比较同等牌型时的踢脚牌
     */
    constructor(rank, cards, kickers = []) {
        this.rank = rank;
        this.cards = cards;
        this.kickers = kickers;
    }

    /**
     * 获取牌型描述
     * @returns {string} 牌型的中文描述
     */
    getDescription() {
        return HandDescription[this.rank];
    }

    /**
     * 比较两个手牌的大小
     * @param {Hand} other - 要比较的另一个手牌
     * @returns {number} 如果this大于other返回1，相等返回0，小于返回-1
     */
    compareTo(other) {
        // 首先比较牌型排名
        if (this.rank !== other.rank) {
            return this.rank > other.rank ? 1 : -1;
        }

        // 特殊处理皇家同花顺和同花顺
        if (this.rank === HandRanking.ROYAL_FLUSH || 
            this.rank === HandRanking.STRAIGHT_FLUSH) {
            // 比较最高牌即可
            return this.cards[0].getValue() > other.cards[0].getValue() ? 1 : 
                   this.cards[0].getValue() < other.cards[0].getValue() ? -1 : 0;
        }

        // 如果牌型相同，比较构成牌型的牌
        for (let i = 0; i < Math.min(this.cards.length, other.cards.length); i++) {
            const thisValue = this.cards[i].getValue();
            const otherValue = other.cards[i].getValue();
            if (thisValue !== otherValue) {
                return thisValue > otherValue ? 1 : -1;
            }
        }

        // 如果主要牌相同，比较踢脚牌
        // 四条等牌型需要确保kickers比较正确
        for (let i = 0; i < Math.min(this.kickers.length, other.kickers.length); i++) {
            const thisValue = this.kickers[i].getValue();
            const otherValue = other.kickers[i].getValue();
            if (thisValue !== otherValue) {
                return thisValue > otherValue ? 1 : -1;
            }
        }

        // 如果所有牌都相同，比较牌的数量
        const thisTotal = this.cards.length + this.kickers.length;
        const otherTotal = other.cards.length + other.kickers.length;
        if (thisTotal !== otherTotal) {
            return thisTotal > otherTotal ? 1 : -1;
        }

        // 完全相同
        return 0;
    }

    /**
     * 获取手牌的字符串表示
     * @returns {string} 手牌的字符串表示
     */
    toString() {
        // 合并cards和kickers数组，按牌值降序排序
        const allCards = [...this.cards, ...this.kickers]
            .sort((a, b) => b.getValue() - a.getValue())
            .slice(0, 5); // 只取最多5张牌
        const cardsStr = allCards.map(card => card.toString()).join(' ');
        return `${this.getDescription()}: ${cardsStr}`;
    }
}