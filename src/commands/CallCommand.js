import { PlayerAction } from '../core/Game.js';

/**
 * 跟注命令类
 * 处理玩家的跟注行为
 */
export class CallCommand {
    /**
     * 创建一个跟注命令
     */
    constructor() {
        // 跟注命令不需要额外参数
    }

    /**
     * 验证跟注是否有效
     * @param {Game} game - 游戏实例
     * @param {Player} player - 当前玩家
     * @returns {boolean} 如果跟注有效返回true
     * @throws {Error} 如果跟注无效
     */
    validate(game, player) {
        // 检查是否有下注可以跟
        if (game.currentBet <= player.getCurrentBet()) {
            throw new Error('Nothing to call (use check instead)');
        }

        return true;
    }

    /**
     * 执行跟注命令
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 验证跟注的有效性
        this.validate(game, currentPlayer);

        // 执行跟注操作
        try {
            game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.CALL);
            return true;
        } catch (error) {
            throw new Error(`Failed to execute call: ${error.message}`);
        }
    }

    /**
     * 获取命令的字符串表示
     * @returns {string} 命令的字符串表示
     */
    toString() {
        return 'Call the current bet';
    }
}