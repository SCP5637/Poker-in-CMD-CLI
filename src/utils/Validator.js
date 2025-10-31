/**
 * 输入验证工具类
 * 用于验证游戏中的各种输入
 */
export class Validator {
    /**
     * 检查金额是否有效
     * @param {number} amount - 要检查的金额
     * @returns {boolean} 如果金额有效返回true，否则返回false
     */
    static isValidAmount(amount) {
        return typeof amount === 'number' && amount >= 0 && Number.isFinite(amount);
    }

    /**
     * 检查玩家名称是否有效
     * @param {string} name - 要检查的玩家名称
     * @returns {boolean} 如果名称有效返回true，否则返回false
     */
    static isValidPlayerName(name) {
        return typeof name === 'string' && name.length > 0 && name.length <= 20;
    }

    /**
     * 检查命令是否有效
     * @param {string} command - 要检查的命令
     * @returns {boolean} 如果命令有效返回true，否则返回false
     */
    static isValidCommand(command) {
        // 命令应该是3位数字
        return typeof command === 'string' && /^\d{3}$/.test(command);
    }

    /**
     * 检查玩家数量是否有效
     * @param {number} count - 玩家数量
     * @returns {boolean} 如果数量有效返回true，否则返回false
     */
    static isValidPlayerCount(count) {
        return Number.isInteger(count) && count >= 2 && count <= 9;
    }

    /**
     * 检查盲注设置是否有效
     * @param {number} smallBlind - 小盲注
     * @param {number} bigBlind - 大盲注
     * @returns {boolean} 如果设置有效返回true，否则返回false
     */
    static isValidBlindSettings(smallBlind, bigBlind) {
        return this.isValidAmount(smallBlind) && 
               this.isValidAmount(bigBlind) && 
               smallBlind > 0 && 
               bigBlind > 0 && 
               bigBlind > smallBlind &&
               bigBlind <= 100 &&
               bigBlind % 2 === 0;
    }

    /**
     * 检查筹码数量是否有效
     * @param {number} chips - 筹码数量
     * @returns {boolean} 如果数量有效返回true，否则返回false
     */
    static isValidChipAmount(chips) {
        return Number.isInteger(chips) && chips >= 300 && chips <= 10000;
    }
}