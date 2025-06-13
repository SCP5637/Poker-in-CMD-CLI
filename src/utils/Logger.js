/**
 * 日志工具
 * 用于记录游戏过程中的各种信息
 */

// 日志级别
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    ERROR: 2
};

class Logger {
    constructor() {
        this.logLevel = LOG_LEVELS.INFO; // 默认日志级别
    }

    setLogLevel(level) {
        if (typeof level === 'string') {
            level = level.toUpperCase();
            if (LOG_LEVELS[level] !== undefined) {
                this.logLevel = LOG_LEVELS[level];
            }
        }
    }

    debug(message) {
        if (this.logLevel <= LOG_LEVELS.DEBUG) {
            console.log(`[DEBUG] ${message}`);
        }
    }

    info(message) {
        if (this.logLevel <= LOG_LEVELS.INFO) {
            console.log(`[INFO] ${message}`);
        }
    }

    error(message) {
        if (this.logLevel <= LOG_LEVELS.ERROR) {
            console.error(`[ERROR] ${message}`);
        }
    }

    // 记录游戏状态
    logGameState(game) {
        if (!game) return;
        
        this.info(`当前游戏状态：${game.state}`);
        if (game.table) {
            // 计算实际玩家数量（非null值）
            const activePlayers = game.table.players.filter(player => player !== null);
            this.info(`玩家数量：${activePlayers.length}`);
            this.info('玩家状态：');
            game.table.players.forEach(player => {
                if (player !== null) {
                    this.info(`  ${player.name}: 筹码=${player.chips}, 状态=${player.status}`);
                }
            });
        }
    }

    // 记录玩家动作
    logPlayerAction(player, action, amount) {
        if (!player) return;
        
        let message = `玩家 ${player.name} 执行动作：${action}`;
        if (amount !== undefined) {
            message += ` (${amount}筹码)`;
        }
        this.info(message);
    }
}

// 导出单例实例
export const logger = new Logger();