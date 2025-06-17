import { CommandParser, CommandType } from './CommandParser.js';
import { CommandExecutor } from './CommandExecutor.js';
import { CommandFactory } from './CommandFactory.js';

/**
 * 命令管理器类
 * 负责管理命令的执行和历史记录
 */
export class CommandManager {
    /**
     * 创建一个新的命令管理器
     * @param {Game} game - 游戏实例
     * @param {Object} options - 配置选项
     * @param {Function} options.onCommandExecuted - 命令执行后的回调函数
     * @param {Function} options.onError - 错误处理回调函数
     */
    constructor(game, options = {}) {
        this.game = game;
        this.executor = new CommandExecutor();
        this.commandHistory = [];
        this.options = {
            onCommandExecuted: () => {},
            onError: (error) => console.error(error),
            ...options
        };
    }

    /**
     * 获取命令的中文描述
     * @param {string} commandType - 命令类型
     * @returns {string} 命令的中文描述
     */
    getCommandDescription(commandType) {
        const descriptions = {
            [CommandType.CHECK]: '看牌',
            [CommandType.CALL]: '跟注',
            [CommandType.BET]: '下注',
            [CommandType.RAISE]: '加注',
            [CommandType.ALL_IN]: '全下',
            [CommandType.FOLD]: '弃牌',
            [CommandType.EXIT]: '退出',
            [CommandType.HELP]: '帮助'
        };
        return descriptions[commandType] || commandType;
    }

    /**
     * 执行命令
     * @param {string} commandInput - 命令输入字符串
     * @param {Object} args - 命令参数
     * @param {Object} context - 执行上下文
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeCommand(commandInput, args = {}, context = {}) {
        try {
            // 解析命令
            const commandObj = CommandParser.parse(commandInput, args);
            
            // 检查命令在当前游戏状态下是否可用
            if (!CommandParser.isCommandAvailable(commandObj, this.game)) {
                throw new Error(`Command ${commandInput} is not available in current game state`);
            }
            
            // 获取当前玩家
            const currentPlayer = this.game.getCurrentPlayer();
            const playerName = currentPlayer ? currentPlayer.name : '系统';
            
            // 创建具体的命令实例
            const command = CommandFactory.createCommand(commandObj);
            
            // 执行命令
            const result = this.executor.execute(commandObj, this.game, context);
            
            // 记录命令历史
            this.commandHistory.push({
                command: commandObj,
                timestamp: Date.now(),
                playerName: playerName
            });
            
            // 调用命令执行后的回调
            this.options.onCommandExecuted(commandObj, result, playerName);
            
            return result;
        } catch (error) {
            // 处理错误
            this.options.onError(error);
            return false;
        }
    }

    /**
     * 获取命令历史
     * @param {number} limit - 返回的历史记录数量限制
     * @returns {Array} 命令历史记录
     */
    getCommandHistory(limit = 10) {
        return this.commandHistory.slice(-limit);
    }

    /**
     * 清除命令历史
     */
    clearCommandHistory() {
        this.commandHistory = [];
    }

    /**
     * 获取可用命令列表
     * @returns {Array} 可用命令列表
     */
    getAvailableCommands() {
        const availableCommands = [];
        
        // 检查每个命令是否可用
        for (const type of Object.values(CommandType)) {
            const commandObj = { type, args: {} };
            if (CommandParser.isCommandAvailable(commandObj, this.game)) {
                availableCommands.push({
                    type,
                    description: CommandParser.getCommandDescription({ type, args: {} })
                });
            }
        }
        
        return availableCommands;
    }

    /**
     * 获取当前玩家可用的行动命令
     * @returns {Array} 可用的行动命令列表
     */
    getAvailableActionCommands() {
        if (!this.game || this.game.state !== 'betting' || !this.game.getCurrentPlayer()) {
            return [];
        }
        
        const currentPlayer = this.game.getCurrentPlayer();
        const availableActions = [];
        
        // 检查各种行动命令是否可用
        
        // 检查是否可以看牌
        try {
            CommandFactory.createCheckCommand().validate(this.game, currentPlayer);
            availableActions.push({
                type: CommandType.CHECK,
                description: 'Check'
            });
        } catch (e) {
            // 不可用，忽略错误
        }
        
        // 检查是否可以跟注
        try {
            CommandFactory.createCallCommand().validate(this.game, currentPlayer);
            availableActions.push({
                type: CommandType.CALL,
                description: 'Call'
            });
        } catch (e) {
            // 不可用，忽略错误
        }
        
        // 检查是否可以下注
        if (this.game.currentBet === 0) {
            availableActions.push({
                type: CommandType.BET,
                description: 'Bet'
            });
        }
        
        // 检查是否可以加注
        if (this.game.currentBet > 0) {
            availableActions.push({
                type: CommandType.RAISE,
                description: 'Raise'
            });
        }
        
        // 全下总是可用的
        availableActions.push({
            type: CommandType.ALL_IN,
            description: 'All-In'
        });
        
        // 弃牌总是可用的
        availableActions.push({
            type: CommandType.FOLD,
            description: 'Fold'
        });
        
        return availableActions;
    }
}