/**
 * 输入验证工具
 * 用于验证游戏中的各种输入
 */

import { COMMAND_TYPES, ERROR_MESSAGES } from './Constants.js';
import { logger } from './Logger.js';

export class Validator {
    constructor(game) {
        this.game = game;
    }

    /**
     * 验证金额是否有效
     * @param {number} amount 金额
     * @returns {boolean} 是否有效
     */
    isValidAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            logger.error(ERROR_MESSAGES.INVALID_AMOUNT);
            return false;
        }
        return true;
    }

    /**
     * 验证玩家名称是否有效
     * @param {string} name 玩家名称
     * @returns {boolean} 是否有效
     */
    isValidPlayerName(name) {
        if (typeof name !== 'string' || name.length < 2 || name.length > 16) {
            logger.error(ERROR_MESSAGES.INVALID_PLAYER_NAME);
            return false;
        }
        return true;
    }

    /**
     * 验证命令是否有效
     * @param {string} command 命令
     * @returns {boolean} 是否有效
     */
    isValidCommand(command) {
        // 检查命令是否是命令名称（如"CALL"）
        if (Object.keys(COMMAND_TYPES).includes(command)) {
            return true;
        }
        
        // 检查命令是否是命令代码（如"012"）
        const validCommandCodes = Object.values(COMMAND_TYPES);
        if (validCommandCodes.includes(command)) {
            return true;
        }
        
        logger.error(ERROR_MESSAGES.INVALID_COMMAND);
        return false;
    }

    /**
     * 验证玩家数量是否有效
     * @param {number} count 玩家数量
     * @returns {boolean} 是否有效
     */
    isValidPlayerCount(count) {
        if (typeof count !== 'number' || count < 2 || count > 8) {
            logger.error(ERROR_MESSAGES.INVALID_PLAYER_COUNT);
            return false;
        }
        return true;
    }

    /**
     * 验证盲注是否有效
     * @param {number} blind 盲注金额
     * @returns {boolean} 是否有效
     */
    isValidBlind(blind) {
        if (typeof blind !== 'number' || blind <= 0 || blind > 100 || blind % 2 !== 0) {
            logger.error(ERROR_MESSAGES.INVALID_BLIND);
            return false;
        }
        return true;
    }
}