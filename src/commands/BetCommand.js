import { PlayerAction } from '../core/Game.js';

/**
 * 下注命令类
 * 处理玩家的下注行为
 */
export class BetCommand {
    /**
     * 创建一个下注命令
     * @param {number} amount - 下注金额
     */
    constructor(amount) {
        this.amount = amount;
    }

    /**
     * 验证下注金额是否有效
     * @param {Game} game - 游戏实例
     * @param {Player} player - 当前玩家
     * @returns {boolean} 如果下注金额有效返回true
     * @throws {Error} 如果下注金额无效
     */
    validate(game, player) {
        // 检查是否有足够的筹码
        if (this.amount > player.chips) {
            throw new Error('Insufficient chips for bet');
        }

        // 检查是否满足最小下注要求（大盲注）
        if (this.amount < game.table.bigBlind) {
            throw new Error(`Bet must be at least the big blind (${game.table.bigBlind})`);
        }

        // 检查是否已经有人下注
        if (game.currentBet > 0) {
            throw new Error('Cannot bet when there is already a bet (use raise instead)');
        }

        return true;
    }

    /**
     * 执行下注命令
     * @param {Game} game - 游戏实例
     * @returns {boolean} 如果命令执行成功返回true
     * @throws {Error} 如果命令执行失败
     */
    execute(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) {
            throw new Error('No current player');
        }

        // 验证下注的有效性
        this.validate(game, currentPlayer);

        // 执行下注操作
        try {
            game.handlePlayerAction(game.currentPlayerPosition, PlayerAction.BET, this.amount);
            return true;
        } catch (error) {
            throw new Error(`Failed to execute bet: ${error.message}`);
        }
    }

    /**
     * 获取命令的字符串表示
     * @returns {string} 命令的字符串表示
     */
    toString() {
        return `Bet ${this.amount} chips`;
    }
}