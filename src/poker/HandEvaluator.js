import { HandRanking, Hand } from './HandRanking.js';
import { Combinations } from './Combinations.js';
import { RANKS } from '../core/Card.js';

/**
 * 手牌评估器
 * 用于评估扑克牌组合的牌型
 */
export class HandEvaluator {
    /**
     * 评估最佳手牌
     * @param {Array<Card>} cards - 要评估的牌（通常是玩家的2张底牌加上5张公共牌）
     * @returns {Hand} 最佳的5张牌组合
     */
    static evaluate(cards) {
        if (cards.length < 5) {
            throw new Error('至少需要5张牌才能评估手牌');
        }

        // 生成所有可能的5张牌组合
        const combinations = Combinations.generate(cards, 5);
        
        // 评估每种组合并找出最佳的一种
        let bestHand = null;
        for (const combo of combinations) {
            const hand = HandEvaluator.evaluateCombo(combo);
            if (bestHand === null || hand.compareTo(bestHand) > 0) {
                bestHand = hand;
            }
        }
        
        return bestHand;
    }

    /**
     * 评估一个5张牌的组合
     * @param {Array<Card>} cards - 5张牌的组合
     * @returns {Hand} 评估结果
     */
    static evaluateCombo(cards) {
        if (cards.length !== 5) {
            throw new Error('必须提供恰好5张牌');
        }

        // 按点数从大到小排序
        const sortedCards = [...cards].sort((a, b) => b.getValue() - a.getValue());
        
        // 检查各种牌型，从最高到最低
        let hand;
        
        // 检查皇家同花顺
        hand = HandEvaluator.checkRoyalFlush(sortedCards);
        if (hand) return hand;
        
        // 检查同花顺
        hand = HandEvaluator.checkStraightFlush(sortedCards);
        if (hand) return hand;
        
        // 检查四条
        hand = HandEvaluator.checkFourOfAKind(sortedCards);
        if (hand) return hand;
        
        // 检查葫芦
        hand = HandEvaluator.checkFullHouse(sortedCards);
        if (hand) return hand;
        
        // 检查同花
        hand = HandEvaluator.checkFlush(sortedCards);
        if (hand) return hand;
        
        // 检查顺子
        hand = HandEvaluator.checkStraight(sortedCards);
        if (hand) return hand;
        
        // 检查三条
        hand = HandEvaluator.checkThreeOfAKind(sortedCards);
        if (hand) return hand;
        
        // 检查两对
        hand = HandEvaluator.checkTwoPair(sortedCards);
        if (hand) return hand;
        
        // 检查一对
        hand = HandEvaluator.checkOnePair(sortedCards);
        if (hand) return hand;
        
        // 如果以上都不是，则为高牌
        return new Hand(HandRanking.HIGH_CARD, sortedCards, []);
    }

    /**
     * 检查是否为皇家同花顺
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是皇家同花顺则返回Hand对象，否则返回null
     */
    static checkRoyalFlush(cards) {
        // 皇家同花顺是同花顺中最高的一种，必须是A、K、Q、J、10同花
        const isFlush = HandEvaluator.isFlush(cards);
        if (!isFlush) return null;
        
        const values = cards.map(card => card.getValue());
        if (values.join(',') === '14,13,12,11,10') {
            return new Hand(HandRanking.ROYAL_FLUSH, cards, []);
        }
        
        return null;
    }

    /**
     * 检查是否为同花顺
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是同花顺则返回Hand对象，否则返回null
     */
    static checkStraightFlush(cards) {
        const isFlush = HandEvaluator.isFlush(cards);
        const isStraight = HandEvaluator.isStraight(cards);
        
        if (isFlush && isStraight) {
            return new Hand(HandRanking.STRAIGHT_FLUSH, cards, []);
        }
        
        return null;
    }

    /**
     * 检查是否为四条
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是四条则返回Hand对象，否则返回null
     */
    static checkFourOfAKind(cards) {
        const groups = HandEvaluator.groupByRank(cards);
        
        for (const [rank, group] of Object.entries(groups)) {
            if (group.length === 4) {
                const fourCards = group;
                const kicker = cards.find(card => card.getRank() !== rank);
                // 将四条牌和kicker都放入cards数组，kickers数组为空
                return new Hand(HandRanking.FOUR_OF_A_KIND, [...fourCards, kicker], []);
            }
        }
        
        return null;
    }

    /**
     * 检查是否为葫芦
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是葫芦则返回Hand对象，否则返回null
     */
    static checkFullHouse(cards) {
        const groups = HandEvaluator.groupByRank(cards);
        const ranks = Object.keys(groups);
        
        if (ranks.length !== 2) return null;
        
        let threeOfAKindRank = null;
        let pairRank = null;
        
        // 按牌值从高到低排序
        const sortedGroups = Object.entries(groups).sort((a, b) => {
            return b[1][0].getValue() - a[1][0].getValue();
        });
        
        for (const [rank, group] of sortedGroups) {
            if (group.length === 3) {
                threeOfAKindRank = rank;
            } else if (group.length === 2) {
                pairRank = rank;
            }
        }
        
        if (threeOfAKindRank && pairRank) {
            const threeCards = groups[threeOfAKindRank];
            const pairCards = groups[pairRank];
            // 确保三条在前，对子在后
            return new Hand(HandRanking.FULL_HOUSE, [...threeCards, ...pairCards], []);
        }
        
        return null;
    }

    /**
     * 检查是否为同花
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是同花则返回Hand对象，否则返回null
     */
    static checkFlush(cards) {
        if (HandEvaluator.isFlush(cards)) {
            return new Hand(HandRanking.FLUSH, cards, []);
        }
        return null;
    }

    /**
     * 检查是否为顺子
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是顺子则返回Hand对象，否则返回null
     */
    static checkStraight(cards) {
        if (HandEvaluator.isStraight(cards)) {
            return new Hand(HandRanking.STRAIGHT, cards, []);
        }
        return null;
    }

    /**
     * 检查是否为三条
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是三条则返回Hand对象，否则返回null
     */
    static checkThreeOfAKind(cards) {
        const groups = HandEvaluator.groupByRank(cards);
        
        for (const [rank, group] of Object.entries(groups)) {
            if (group.length === 3) {
                const threeCards = group;
                const kickers = cards.filter(card => card.getRank() !== rank)
                    .sort((a, b) => b.getValue() - a.getValue());
                return new Hand(HandRanking.THREE_OF_A_KIND, threeCards, kickers);
            }
        }
        
        return null;
    }

    /**
     * 检查是否为两对
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是两对则返回Hand对象，否则返回null
     */
    static checkTwoPair(cards) {
        const groups = HandEvaluator.groupByRank(cards);
        const pairs = [];
        
        for (const [rank, group] of Object.entries(groups)) {
            if (group.length === 2) {
                pairs.push(group);
            }
        }
        
        if (pairs.length === 2) {
            // 确保较大的对子在前
            pairs.sort((a, b) => b[0].getValue() - a[0].getValue());
            const pairCards = pairs.flat();
            const kicker = cards.find(card => !pairCards.some(pairCard => pairCard.equals(card)));
            return new Hand(HandRanking.TWO_PAIR, pairCards, [kicker]);
        }
        
        return null;
    }

    /**
     * 检查是否为一对
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {Hand|null} 如果是一对则返回Hand对象，否则返回null
     */
    static checkOnePair(cards) {
        const groups = HandEvaluator.groupByRank(cards);
        
        for (const [rank, group] of Object.entries(groups)) {
            if (group.length === 2) {
                const pairCards = group;
                const kickers = cards.filter(card => card.getRank() !== rank)
                    .sort((a, b) => b.getValue() - a.getValue());
                return new Hand(HandRanking.ONE_PAIR, pairCards, kickers);
            }
        }
        
        return null;
    }

    /**
     * 检查是否为同花
     * @param {Array<Card>} cards - 5张牌
     * @returns {boolean} 如果是同花则返回true
     */
    static isFlush(cards) {
        const suit = cards[0].getSuit();
        return cards.every(card => card.getSuit() === suit);
    }

    /**
     * 检查是否为顺子
     * @param {Array<Card>} cards - 已排序的5张牌
     * @returns {boolean} 如果是顺子则返回true
     */
    static isStraight(cards) {
        const values = cards.map(card => card.getValue());
        
        // 检查常规顺子
        for (let i = 1; i < values.length; i++) {
            if (values[i - 1] !== values[i] + 1) {
                // 检查A-5-4-3-2特殊顺子
                if (i === 1 && values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
                    // 将A移到最后，使其成为最小的牌
                    const ace = cards.shift();
                    cards.push(ace);
                    return true;
                }
                return false;
            }
        }
        
        return true;
    }

    /**
     * 按点数对牌进行分组
     * @param {Array<Card>} cards - 要分组的牌
     * @returns {Object} 按点数分组的结果，键为点数，值为该点数的牌数组
     */
    static groupByRank(cards) {
        const groups = {};
        
        for (const card of cards) {
            const rank = card.getRank();
            if (!groups[rank]) {
                groups[rank] = [];
            }
            groups[rank].push(card);
        }
        
        return groups;
    }

    /**
     * 比较两个玩家的最佳手牌
     * @param {Player} player1 - 玩家1
     * @param {Player} player2 - 玩家2
     * @param {Array<Card>} communityCards - 公共牌
     * @returns {number} 如果玩家1赢返回1，玩家2赢返回-1，平局返回0
     */
    static compareHands(player1, player2, communityCards) {
        if (!player1.isInGame() && !player2.isInGame()) return 0;
        if (!player1.isInGame()) return -1;
        if (!player2.isInGame()) return 1;
        
        const cards1 = [...player1.holeCards, ...communityCards];
        const cards2 = [...player2.holeCards, ...communityCards];
        
        const hand1 = HandEvaluator.evaluate(cards1);
        const hand2 = HandEvaluator.evaluate(cards2);
        
        return hand1.compareTo(hand2);
    }

    /**
     * 确定赢家
     * @param {Array<Player>} players - 玩家数组
     * @param {Array<Card>} communityCards - 公共牌
     * @returns {Array<Player>} 赢家数组（可能有多个赢家，即平局）
     */
    static determineWinners(players, communityCards) {
        const activePlayers = players.filter(player => player !== null && player.isInGame());
        if (activePlayers.length === 0) return [];
        if (activePlayers.length === 1) return [activePlayers[0]];
        
        // 评估每个玩家的最佳手牌
        const playerHands = activePlayers.map(player => {
            const cards = [...player.holeCards, ...communityCards];
            const hand = HandEvaluator.evaluate(cards);
            return { player, hand };
        });
        
        // 找出最佳手牌
        let bestHand = playerHands[0];
        for (let i = 1; i < playerHands.length; i++) {
            const comparison = playerHands[i].hand.compareTo(bestHand.hand);
            if (comparison > 0) {
                bestHand = playerHands[i];
            }
        }
        
        // 找出所有拥有最佳手牌的玩家（可能有平局）
        const winners = playerHands
            .filter(ph => ph.hand.compareTo(bestHand.hand) === 0)
            .map(ph => ph.player);
        
        return winners;
    }
}