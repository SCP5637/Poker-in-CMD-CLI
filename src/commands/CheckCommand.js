import { PlayerAction } from '../core/Game.js';

/**
 * 看牌命令类
 * 处理玩家的看牌行为
 */
export class CheckCommand {
    /**
     * 创建一个看牌命令
     */
    constructor() {
        // 看牌命令不需要额外参数
    }

    /**
     * 验证看牌是否有效
     * @param {Game} game - 游戏实例
     * @param {Player} player - 当前玩家
     * @returns {boolean} 如果看牌有效返回true
     * @throws {Error} 如果看牌无效
     */
    validate(game, player) {
        // 检查是否有人下注
        if (game.currentBet > player.getCurrentBet()) {
            throw new Error('Cannot check when there is a bet to call');
        }

        return true;
    }

    /**
     * 执行看牌命令
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 验证看牌的有效性
        this.validate(game, currentPlayer);

        // 执行看牌操作
        try {
            game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.CHECK);
            return true;
        } catch (error) {
            throw new Error(`Failed to execute check: ${error.message}`);
        }
    }

    /**
     * 获取命令的字符串表示
     * @returns {string} 命令的字符串表示
     */
    toString() {
        return 'Check';
    }
}