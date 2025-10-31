/**
 * AI生成器
 * 用于创建具有不同行为特征的AI玩家
 */
export class AIgenerator {
    /**
     * 创建AI生成器
     */
    constructor() {
        // 包含7个行为参数的默认范围配置
        this.behaviorParams = {
            evaluateValue: { min: 0, max: 20 },
            bluffValue: { min: 0, max: 20 },
            economyValue: { min: 0, max: 20 },
            fierceValue: { min: 0, max: 20 },
            deadlineValue: { min: 0, max: 20 },
            escapeValue: { min: 0, max: 20 },
            randomValue: { min: 0, max: 20 }
        };
    }

    /**
     * 随机生成一个新的AI配置
     * @returns {Object} AI配置对象
     */
    generateAI() {
        // 生成7个行为参数，每个参数值为0-20的整数
        const aiConfig = {
            id: this.generateAIId(),
            params: {
                evaluateValue: this.getRandomInt(this.behaviorParams.evaluateValue.min, this.behaviorParams.evaluateValue.max),
                bluffValue: this.getRandomInt(this.behaviorParams.bluffValue.min, this.behaviorParams.bluffValue.max),
                economyValue: this.getRandomInt(this.behaviorParams.economyValue.min, this.behaviorParams.economyValue.max),
                fierceValue: this.getRandomInt(this.behaviorParams.fierceValue.min, this.behaviorParams.fierceValue.max),
                deadlineValue: this.getRandomInt(this.behaviorParams.deadlineValue.min, this.behaviorParams.deadlineValue.max),
                escapeValue: this.getRandomInt(this.behaviorParams.escapeValue.min, this.behaviorParams.escapeValue.max),
                randomValue: this.getRandomInt(this.behaviorParams.randomValue.min, this.behaviorParams.randomValue.max)
            },
            dotRateCollection: [],
            dotRate: 0,
            gamesPlayed: 0
        };

        return aiConfig;
    }

    /**
     * 生成唯一的AI ID
     * @returns {string} AI ID
     */
    generateAIId() {
        return 'AI_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    /**
     * 获取指定范围内的随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机整数
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 将AI配置保存到IntelligenceList.json
     * @param {Object} aiConfig - AI配置对象
     */
    saveToIntelligenceList(aiConfig) {
        // 在实际实现中，这里会将AI配置保存到文件
        console.log('保存AI配置到IntelligenceList.json:', aiConfig);
    }

    /**
     * 从IntelligenceList.json加载指定AI配置
     * @param {number} index - AI配置索引
     * @returns {Object|null} AI配置对象或null
     */
    loadIntelligenceList(index) {
        // 在实际实现中，这里会从文件加载AI配置
        console.log('从IntelligenceList.json加载AI配置，索引:', index);
        return null;
    }
}