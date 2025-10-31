import { Player } from '../core/Player.js';

/**
 * AI玩家类
 * 继承自Player类，负责AI的决策行为
 */
export class AIPlayer extends Player {
    /**
     * 创建AI玩家
     * @param {string} name - 玩家名称
     * @param {number} chips - 初始筹码数量
     * @param {number} position - 玩家在桌子上的位置
     * @param {Object} aiConfig - AI配置参数
     */
    constructor(name, chips, position, aiConfig) {
        super(name, chips, position);
        this.aiConfig = aiConfig || this.generateDefaultAIConfig();
    }

    /**
     * 生成默认AI配置
     * @returns {Object} 默认AI配置
     */
    generateDefaultAIConfig() {
        return {
            evaluateValue: 10,
            bluffValue: 10,
            economyValue: 10,
            fierceValue: 10,
            deadlineValue: 10,
            escapeValue: 10,
            randomValue: 10
        };
    }

    /**
     * 根据当前状态和AI参数做出决策
     * @param {Game} game - 当前游戏实例
     * @returns {Object} 决策结果，包含行动类型和金额
     */
    makeDecision(game) {
        // 简化实现，实际应该根据AI参数和游戏状态进行复杂计算
        // 这里只是示例，随机选择一个行动
        
        const actions = ['fold', 'check', 'call', 'raise'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        let amount = 0;
        if (action === 'raise') {
            // 简单的加注逻辑
            const minRaise = game.currentBet + game.minRaise;
            const maxChips = this.chips;
            amount = Math.min(Math.max(minRaise, Math.floor(Math.random() * maxChips)), maxChips);
        } else if (action === 'call') {
            amount = game.currentBet - this.currentBet;
        }
        
        return {
            action: action,
            amount: amount
        };
    }

    /**
     * 计算当前手牌强度
     * @param {Array<Card>} communityCards - 公共牌
     * @returns {number} 手牌强度评分
     */
    calculateHandStrength(communityCards) {
        // 基于evaluateValue参数和HandEvaluator评估牌力
        // 简化实现，返回随机值
        return Math.random() * this.aiConfig.evaluateValue / 20;
    }

    /**
     * 计算诈唬概率
     * @param {Array<Card>} communityCards - 公共牌
     * @returns {number} 诈唬概率
     */
    calculateBluffProbability(communityCards) {
        // 基于bluffValue参数
        return this.aiConfig.bluffValue / 20;
    }

    /**
     * 计算底池赔率
     * @param {number} potSize - 底池大小
     * @param {number} callAmount - 跟注金额
     * @returns {number} 底池赔率
     */
    calculatePotOdds(potSize, callAmount) {
        // 基于economyValue参数
        if (callAmount <= 0) return Infinity;
        return (potSize / callAmount) * (this.aiConfig.economyValue / 20);
    }

    /**
     * 确定加注金额
     * @param {number} minRaise - 最小加注额
     * @param {number} maxChips - 最大可用筹码
     * @returns {number} 加注金额
     */
    determineRaiseAmount(minRaise, maxChips) {
        // 基于fierceValue参数
        const aggression = this.aiConfig.fierceValue / 20;
        return Math.min(minRaise + Math.floor((maxChips - minRaise) * aggression), maxChips);
    }

    /**
     * 评估全押时机
     * @param {number} potSize - 底池大小
     * @returns {boolean} 是否应该全押
     */
    evaluateAllInSituation(potSize) {
        // 基于deadlineValue参数
        return (this.chips < (this.aiConfig.deadlineValue * 5)) && (potSize > this.chips * 2);
    }

    /**
     * 判断是否应该退出游戏
     * @param {number} currentChips - 当前筹码
     * @param {number} initialChips - 初始筹码
     * @returns {boolean} 是否应该退出
     */
    shouldEscape(currentChips, initialChips) {
        // 基于escapeValue参数
        const ratio = currentChips / initialChips;
        return (ratio < 0.2) && (Math.random() < this.aiConfig.escapeValue / 20);
    }

    /**
     * 获取随机行动
     * @returns {string} 随机行动
     */
    getRandomAction() {
        // 基于randomValue参数
        const actions = ['fold', 'check', 'call', 'raise'];
        return actions[Math.floor(Math.random() * actions.length)];
    }
}