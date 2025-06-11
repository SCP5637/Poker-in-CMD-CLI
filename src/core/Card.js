/**
 * 扑克牌花色枚举
 * @enum {string}
 */
export const SUITS = {
    SPADES: '♠',    // 黑桃
    HEARTS: '♥',    // 红心
    CLUBS: '♣',     // 梅花
    DIAMONDS: '♦'   // 方块
};

/**
 * 扑克牌点数枚举
 * @enum {string}
 */
export const RANKS = {
    ACE: 'A',
    KING: 'K',
    QUEEN: 'Q',
    JACK: 'J',
    TEN: '10',
    NINE: '9',
    EIGHT: '8',
    SEVEN: '7',
    SIX: '6',
    FIVE: '5',
    FOUR: '4',
    THREE: '3',
    TWO: '2'
};

/**
 * 点数对应的数值
 * @enum {number}
 */
const RANK_VALUES = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2
};

/**
 * 扑克牌类
 * 表示一张扑克牌，包含点数和花色
 */
export class Card {
    /**
     * 创建一张扑克牌
     * @param {string} rank - 点数
     * @param {string} suit - 花色
     */
    constructor(rank, suit) {
        if (!Object.values(RANKS).includes(rank)) {
            // 允许花色符号作为rank传入
            if (!['♠', '♥', '♦', '♣'].includes(rank)) {
                throw new Error(`Invalid rank: ${rank}`);
            }
        }

        // 支持字母和Unicode两种花色表示
        const suitMap = {
            'S': '♠',
            'H': '♥',
            'D': '♦',
            'C': '♣'
        };
        
        let finalSuit = suit;
        if (suitMap[suit]) {
            finalSuit = suitMap[suit];
        }

        if (!Object.values(SUITS).includes(finalSuit)) {
            throw new Error(`Invalid suit: ${suit}`);
        }
        
        this.rank = rank;
        this.suit = finalSuit;
    }

    /**
     * 获取扑克牌的字符串表示
     * @returns {string} 扑克牌的字符串表示，如 "A♠"
     */
    toString() {
        return `${this.rank}${this.suit}`;
    }

    /**
     * 获取扑克牌的数值
     * @returns {number} 扑克牌的数值，用于比较大小
     */
    getValue() {
        return RANK_VALUES[this.rank];
    }

    /**
     * 获取扑克牌的花色
     * @returns {string} 扑克牌的花色
     */
    getSuit() {
        return this.suit;
    }

    /**
     * 获取扑克牌的点数
     * @returns {string} 扑克牌的点数
     */
    getRank() {
        return this.rank;
    }

    /**
     * 比较两张扑克牌是否相等
     * @param {Card} other - 要比较的另一张扑克牌
     * @returns {boolean} 如果两张牌的点数和花色都相同，返回true
     */
    equals(other) {
        return this.rank === other.rank && this.suit === other.suit;
    }
}