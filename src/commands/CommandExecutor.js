import { CommandType } from './CommandParser.js';
import { CommandFactory } from './CommandFactory.js';

/**
 * 命令执行器类
 * 负责执行解析后的命令
 */
export class CommandExecutor {
    /**
     * 执行命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @param {Object} context - 执行上下文，包含回调函数等
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(command, game, context = {}) {
        // 处理特殊命令（不需要创建命令实例的命令）
        if (command.type === CommandType.END_GAME) {
            if (context.onEndGame) {
                context.onEndGame();
            }
            return true;
        }
        
        if (command.type === CommandType.EXIT) {
            if (context.onExit) {
                context.onExit();
            }
            return true;
        }

        // 使用CommandFactory创建命令实例并执行
        const commandInstance = CommandFactory.createCommand(command);
        if (!commandInstance) {
            throw new Error(`No handler for command type: ${command.type}`);
        }

        try {
            commandInstance.execute(game);
            return true;
        } catch (error) {
            throw error;
        }
    }
}