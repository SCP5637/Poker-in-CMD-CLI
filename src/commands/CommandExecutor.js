import { CommandType } from './CommandParser.js';
import { BetCommand } from './BetCommand.js';
import { CallCommand } from './CallCommand.js';
import { RaiseCommand } from './RaiseCommand.js';
import { FoldCommand } from './FoldCommand.js';
import { CheckCommand } from './CheckCommand.js';
import { GameState, PlayerAction } from '../core/Game.js';

/**
 * 命令执行器类
 * 负责执行解析后的命令
 */
export class CommandExecutor {
    /**
     * 创建一个新的命令执行器
     */
    constructor() {
        // 命令处理器映射
        this.commandHandlers = {
            [CommandType.BET]: this.executeBet.bind(this),
            [CommandType.CALL]: this.executeCall.bind(this),
            [CommandType.RAISE]: this.executeRaise.bind(this),
            [CommandType.ALL_IN]: this.executeAllIn.bind(this),
            [CommandType.CHECK]: this.executeCheck.bind(this),
            [CommandType.FOLD]: this.executeFold.bind(this),
            [CommandType.END_GAME]: this.executeEndGame.bind(this),
            [CommandType.EXIT]: this.executeExit.bind(this)
        };
    }

    /**
     * 执行命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @param {Object} context - 执行上下文，包含回调函数等
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(command, game, context = {}) {
        const handler = this.commandHandlers[command.type];
        if (!handler) {
            throw new Error(`No handler for command type: ${command.type}`);
        }

        return handler(command, game, context);
    }

    /**
     * 执行下注命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeBet(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot bet in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        const amount = command.args.amount;
        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.BET, amount);
        return true;
    }

    /**
     * 执行跟注命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeCall(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot call in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.CALL);
        return true;
    }

    /**
     * 执行加注命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeRaise(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot raise in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        const amount = command.args.amount;
        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.RAISE, amount);
        return true;
    }

    /**
     * 执行全下命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeAllIn(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot go all-in in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 全下相当于下注玩家所有的筹码
        const amount = currentPlayer.chips + currentPlayer.getCurrentBet();
        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.RAISE, amount);
        return true;
    }

    /**
     * 执行看牌命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeCheck(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot check in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.CHECK);
        return true;
    }

    /**
     * 执行弃牌命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeFold(command, game) {
        if (game.state !== GameState.BETTING) {
            throw new Error('Cannot fold in current game state');
        }

        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.FOLD);
        return true;
    }

    /**
     * 执行结束游戏命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @param {Object} context - 执行上下文
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeEndGame(command, game, context) {
        if (context.onEndGame) {
            context.onEndGame();
        }
        return true;
    }

    /**
     * 执行退出命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @param {Object} context - 执行上下文
     * @returns {boolean} 如果命令执行成功返回true
     */
    executeExit(command, game, context) {
        if (context.onExit) {
            context.onExit();
        }
        return true;
    }
}