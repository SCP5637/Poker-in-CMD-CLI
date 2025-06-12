/**
 * 下注规则类
 * 定义和验证德州扑克的下注规则
 */
export class BettingRules {
    /**
     * 检查下注是否有效
     * @param {Player} player - 要下注的玩家
     * @param {number} amount - 下注金额
     * @param {number} minBet - 最小下注金额（通常是大盲注）
     * @param {number} currentBet - 当前轮次的最高下注额
     * @returns {boolean} 如果下注有效返回true
     */
    static isValidBet(player, amount, minBet, currentBet) {
        // 检查玩家是否可以行动
        if (!player.canAct()) {
            return false;
        }

        // 检查下注金额是否为正数
        if (amount <= 0) {
            return false;
        }

        // 检查玩家是否有足够的筹码
        if (amount > player.chips) {
            return false;
        }

        // 如果已经有下注，新的下注必须至少等于当前最高下注
        if (currentBet > 0 && amount < currentBet) {
            return false;
        }

        // 如果是第一个下注，必须至少等于最小下注（大盲注）
        if (currentBet === 0 && amount < minBet) {
            return false;
        }

        return true;
    }

    /**
     * 获取最小加注金额
     * @param {number} currentBet - 当前轮次的最高下注额
     * @param {number} lastRaise - 上一次加注的金额
     * @param {number} minBet - 最小下注金额（通常是大盲注）
     * @returns {number} 最小加注金额
     */
    static getMinRaise(currentBet, lastRaise, minBet) {
        // 如果没有当前下注，最小加注就是最小下注（大盲注）
        if (currentBet === 0) {
            return minBet;
        }

        // 如果有上一次加注，新的加注必须至少等于上一次加注
        if (lastRaise > 0) {
            return currentBet + lastRaise;
        }

        // 否则，加注必须至少是当前下注的两倍
        return currentBet * 2;
    }

    /**
     * 获取玩家可以下注的最大金额
     * @param {Player} player - 玩家
     * @returns {number} 玩家可以下注的最大金额
     */
    static getMaxBet(player) {
        return player.chips;
    }

    /**
     * 检查跟注是否有效
     * @param {Player} player - 要跟注的玩家
     * @param {number} currentBet - 当前轮次的最高下注额
     * @returns {boolean} 如果跟注有效返回true
     */
    static isValidCall(player, currentBet) {
        // 检查玩家是否可以行动
        if (!player.canAct()) {
            return false;
        }

        // 计算需要跟注的金额
        const amountToCall = currentBet - player.getCurrentBet();

        // 如果没有需要跟注的金额，不能跟注
        if (amountToCall <= 0) {
            return false;
        }

        // 检查玩家是否有足够的筹码跟注
        return player.chips >= amountToCall;
    }

    /**
     * 检查加注是否有效
     * @param {Player} player - 要加注的玩家
     * @param {number} amount - 加注金额
     * @param {number} currentBet - 当前轮次的最高下注额
     * @param {number} minRaise - 最小加注金额
     * @returns {boolean} 如果加注有效返回true
     */
    static isValidRaise(player, amount, currentBet, minRaise) {
        // 检查玩家是否可以行动
        if (!player.canAct()) {
            return false;
        }

        // 检查加注金额是否为正数
        if (amount <= 0) {
            return false;
        }

        // 检查玩家是否有足够的筹码
        if (amount > player.chips) {
            return false;
        }

        // 加注必须大于当前下注
        if (amount <= currentBet) {
            return false;
        }

        // 加注必须至少达到最小加注金额
        if (amount - currentBet < minRaise) {
            return false;
        }

        return true;
    }

    /**
     * 检查看牌是否有效
     * @param {Player} player - 要看牌的玩家
     * @param {number} currentBet - 当前轮次的最高下注额
     * @returns {boolean} 如果看牌有效返回true
     */
    static isValidCheck(player, currentBet) {
        // 检查玩家是否可以行动
        if (!player.canAct()) {
            return false;
        }

        // 只有在没有当前下注或玩家已经下注等于当前最高下注时才能看牌
        return currentBet === 0 || player.getCurrentBet() === currentBet;
    }
}