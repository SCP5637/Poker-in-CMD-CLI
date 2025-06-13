import { PlayerAction } from '../core/Game.js';

/**
 * 弃牌命令类
 * 处理玩家的弃牌行为
 */
export class FoldCommand {
    /**
     * 创建一个弃牌命令
     */
    constructor() {
        // 弃牌命令不需要额外参数
    }

    /**
     * 验证弃牌是否有效
     * @param {Game} game - 游戏实例
     * @param {Player} player - 当前玩家
     * @returns {boolean} 如果弃牌有效返回true
     */
    validate(game, player) {
        // 弃牌通常总是有效的
        return true;
    }

    /**
     * 执行弃牌命令
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 验证弃牌的有效性
        this.validate(game, currentPlayer);

        // 执行弃牌操作
        try {
            game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.FOLD);
            return true;
        } catch (error) {
            throw new Error(`Failed to execute fold: ${error.message}`);
        }
    }

    /**
     * 获取命令的字符串表示
     * @returns {string} 命令的字符串表示
     */
    toString() {
        return 'Fold';
    }
}