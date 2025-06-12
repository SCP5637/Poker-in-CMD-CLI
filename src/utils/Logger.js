/**
 * 游戏日志工具
 * 提供分级日志功能，记录游戏运行过程
 */

import { GAME_STATES, PLAYER_STATUS } from './Constants.js';

export class Logger {
    constructor() {
        this.logLevel = 'info'; // 默认日志级别: debug, info, error
    }

    setLogLevel(level) {
        this.logLevel = level;
    }

    debug(message) {
        if (this.logLevel === 'debug') {
            console.debug(`[DEBUG] ${this._timestamp()} - ${message}`);
        }
    }

    info(message) {
        if (this.logLevel === 'debug' || this.logLevel === 'info') {
            console.log(`[INFO] ${this._timestamp()} - ${message}`);
        }
    }

    error(message) {
        console.error(`[ERROR] ${this._timestamp()} - ${message}`);
    }

    logGameState(game) {
        this.info(`游戏状态更新: ${GAME_STATES[game.state]}`);
        this.debug(`当前玩家: ${game.currentPlayer}, 奖池: ${game.pot}`);
    }

    logPlayerAction(player, action, amount = 0) {
        this.info(`玩家 ${player.name} 执行 ${action}, 金额: ${amount}`);
    }

    _timestamp() {
        return new Date().toISOString();
    }
}

// 导出Logger实例
export const logger = new Logger();