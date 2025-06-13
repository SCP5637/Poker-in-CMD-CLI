import { PlayerAction } from '../core/Game.js';

/**
 * 加注命令类
 * 处理玩家的加注行为
 */
export class RaiseCommand {
    /**
     * 创建一个加注命令
     * @param {number} amount - 加注金额（最终的下注总额）
     */
    constructor(amount) {
        this.amount = amount;
    }

    /**
     * 验证加注金额是否有效
     * @param {Game} game - 游戏实例
     * @param {Player} player - 当前玩家
     * @returns {boolean} 如果加注金额有效返回true
     * @throws {Error} 如果加注金额无效
     */
    validate(game, player) {
        // 检查是否有足够的筹码
        const additionalAmount = this.amount - player.getCurrentBet();
        if (additionalAmount > player.chips) {
            throw new Error('Insufficient chips for raise');
        }

        // 检查是否已经有人下注
        if (game.currentBet === 0) {
            throw new Error('Cannot raise when there is no bet (use bet instead)');
        }

        // 检查是否满足最小加注要求
        const minRaiseAmount = game.currentBet + game.minRaise;
        if (this.amount < minRaiseAmount) {
            throw new Error(`Raise must be at least ${minRaiseAmount} (current bet + min raise)`);
        }

        return true;
    }

    /**
     * 执行加注命令
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 验证加注的有效性
        this.validate(game, currentPlayer);

        // 执行加注操作
        try {
            game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.RAISE, this.amount);
            return true;
        } catch (error) {
            throw new Error(`Failed to execute raise: ${error.message}`);
        }
    }

    /**
     * 获取命令的字符串表示
     * @returns {string} 命令的字符串表示
     */
    toString() {
        return `Raise to ${this.amount} chips`;
    }
}