/**
 * AI排名系统
 * 评估和筛选表现最佳的AI
 */
export class AIrank {
    /**
     * 创建AI排名系统
     */
    constructor() {
    }

    /**
     * 根据dotRate对所有AI进行排序
     * @param {Array} aiList - AI列表
     * @returns {Array} 排序后的AI列表
     */
    calculateRankings(aiList) {
        // 根据dotRate对AI进行排序，从高到低
        return aiList.sort((a, b) => (b.dotRate || 0) - (a.dotRate || 0));
    }

    /**
     * 获取dotRate最高的count个AI
     * @param {Array} aiList - AI列表
     * @param {number} count - 数量
     * @returns {Array} 表现最佳的AI列表
     */
    getTopPerformers(aiList, count) {
        const sorted = this.calculateRankings(aiList);
        return sorted.slice(0, Math.min(count, sorted.length));
    }

    /**
     * 获取dotRate最低的count个AI
     * @param {Array} aiList - AI列表
     * @param {number} count - 数量
     * @returns {Array} 表现最差的AI列表
     */
    getBottomPerformers(aiList, count) {
        const sorted = this.calculateRankings(aiList);
        return sorted.slice(-Math.min(count, sorted.length)).reverse();
    }

    /**
     * 将表现最好和最差的AI保存到MasterAI.json
     * @param {Array} aiList - AI列表
     */
    updateMasterAI(aiList) {
        const topPerformers = this.getTopPerformers(aiList, 10);
        const bottomPerformers = this.getBottomPerformers(aiList, 10);
        
        const masterAI = {
            top: topPerformers,
            bottom: bottomPerformers
        };
        
        // 在实际实现中，这里会将数据保存到MasterAI.json文件
        console.log('更新MasterAI.json:', masterAI);
    }
}