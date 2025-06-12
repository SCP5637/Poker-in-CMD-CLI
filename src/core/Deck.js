import { Card, SUITS, RANKS } from './Card.js';

/**
 * 扑克牌组类
 * 表示一副完整的扑克牌（52张）
 */
export class Deck {
    /**
     * 创建一副新的扑克牌
     */
    constructor() {
        this.reset();
    }

    /**
     * 重置牌组为一副完整的扑克牌（52张）
     */
    reset() {
        this.cards = [];
        // 创建52张牌（13种点数 × 4种花色）
        Object.values(SUITS).forEach(suit => {
            Object.values(RANKS).forEach(rank => {
                this.cards.push(new Card(rank, suit));
            });
        });
    }

    /**
     * 洗牌（使用Fisher-Yates算法）
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * 发指定数量的牌
     * @param {number} n - 要发的牌的数量
     * @returns {Card[]} 发出的牌的数组
     * @throws {Error} 如果牌组中剩余的牌不足
     */
    deal(n) {
        if (n < 0) {
            throw new Error('Cannot deal negative number of cards');
        }
        if (n > this.remainingCards()) {
            throw new Error(`Not enough cards in deck. Requested: ${n}, Remaining: ${this.remainingCards()}`);
        }
        return this.cards.splice(0, n);
    }

    /**
     * 发一张牌
     * @returns {Card} 发出的牌
     * @throws {Error} 如果牌组中没有剩余的牌
     */
    dealOne() {
        if (this.isEmpty()) {
            throw new Error('No cards remaining in deck');
        }
        return this.cards.shift();
    }

    /**
     * 从牌组中抽取特定的牌
     * @param {Array<{rank: string, suit: string}>} cardsToExtract - 要抽取的牌的数组，每个元素包含rank和suit属性
     * @returns {Array<Card>} 抽取的牌的数组
     * @throws {Error} 如果牌组中没有请求的牌
     */
    extractSpecificCards(cardsToExtract) {
        const result = [];
        const notFound = [];
        
        // 遍历要抽取的牌
        cardsToExtract.forEach(cardSpec => {
            // 在牌组中查找匹配的牌
            const index = this.cards.findIndex(card => 
                card.rank === cardSpec.rank && card.suit === cardSpec.suit
            );
            
            if (index !== -1) {
                // 找到了，从牌组中移除并添加到结果中
                result.push(this.cards.splice(index, 1)[0]);
            } else {
                // 没找到，记录下来
                notFound.push(`${cardSpec.rank}${cardSpec.suit}`);
            }
        });
        
        // 如果有未找到的牌，抛出错误
        if (notFound.length > 0) {
            throw new Error(`以下牌在牌组中未找到: ${notFound.join(', ')}`);
        }
        
        return result;
    }

    /**
     * 获取牌组中剩余的牌的数量
     * @returns {number} 剩余的牌的数量
     */
    remainingCards() {
        return this.cards.length;
    }

    /**
     * 检查牌组是否为空
     * @returns {boolean} 如果牌组为空返回true
     */
    isEmpty() {
        return this.cards.length === 0;
    }

    /**
     * 获取牌组中所有剩余的牌
     * @returns {Card[]} 剩余的牌的数组
     */
    getCards() {
        return [...this.cards];
    }

    /**
     * 将一张或多张牌放回牌组底部
     * @param {Card|Card[]} cards - 要放回的牌或牌数组
     */
    returnToDeck(cards) {
        if (!Array.isArray(cards)) {
            cards = [cards];
        }
        cards.forEach(card => {
            if (!(card instanceof Card)) {
                throw new Error('Invalid card object');
            }
        });
        this.cards.push(...cards);
    }

    /**
     * 获取牌组的字符串表示
     * @returns {string} 牌组的字符串表示
     */
    toString() {
        return this.cards.map(card => card.toString()).join(' ');
    }
}