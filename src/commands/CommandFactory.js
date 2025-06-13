import { CommandType } from './CommandParser.js';
import { BetCommand } from './BetCommand.js';
import { CallCommand } from './CallCommand.js';
import { RaiseCommand } from './RaiseCommand.js';
import { FoldCommand } from './FoldCommand.js';
import { CheckCommand } from './CheckCommand.js';

/**
 * 命令工厂类
 * 负责创建各种命令对象
 */
export class CommandFactory {
    /**
     * 根据命令对象创建具体的命令实例
     * @param {Object} commandObj - 命令对象
     * @returns {Object} 具体的命令实例
     * @throws {Error} 如果命令类型无效
     */
    static createCommand(commandObj) {
        switch (commandObj.type) {
            case CommandType.BET:
                return new BetCommand(commandObj.args.amount);
            
            case CommandType.CALL:
                return new CallCommand();
            
            case CommandType.RAISE:
                return new RaiseCommand(commandObj.args.amount);
            
            case CommandType.FOLD:
                return new FoldCommand();
            
            case CommandType.CHECK:
                return new CheckCommand();
            
            case CommandType.ALL_IN:
                // 全下命令实际上是一个特殊的加注命令
                // 具体金额会在执行时确定
                return {
                    execute: (game) => {
                        const currentPlayer = game.getCurrentPlayer();
                        if (!currentPlayer) {
                            throw new Error('No current player');
                        }
                        
                        // 全下金额为玩家所有的筹码
                        const allInAmount = currentPlayer.chips + currentPlayer.getCurrentBet();
                        
                        // 如果已经有人下注，则使用加注命令
                        if (game.currentBet > 0) {
                            return new RaiseCommand(allInAmount).execute(game);
                        } else {
                            // 否则使用下注命令
                            return new BetCommand(allInAmount).execute(game);
                        }
                    },
                    toString: () => 'All-In'
                };
            
            default:
                throw new Error(`Unsupported command type: ${commandObj.type}`);
        }
    }

    /**
     * 创建下注命令
     * @param {number} amount - 下注金额
     * @returns {BetCommand} 下注命令实例
     */
    static createBetCommand(amount) {
        return new BetCommand(amount);
    }

    /**
     * 创建跟注命令
     * @returns {CallCommand} 跟注命令实例
     */
    static createCallCommand() {
        return new CallCommand();
    }

    /**
     * 创建加注命令
     * @param {number} amount - 加注金额
     * @returns {RaiseCommand} 加注命令实例
     */
    static createRaiseCommand(amount) {
        return new RaiseCommand(amount);
    }

    /**
     * 创建弃牌命令
     * @returns {FoldCommand} 弃牌命令实例
     */
    static createFoldCommand() {
        return new FoldCommand();
    }

    /**
     * 创建看牌命令
     * @returns {CheckCommand} 看牌命令实例
     */
    static createCheckCommand() {
        return new CheckCommand();
    }
}