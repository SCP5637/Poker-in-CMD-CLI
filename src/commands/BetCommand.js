/**
 * 下注命令
 * 处理玩家下注操作
 */
export class BetCommand {
    /**
     * 执行下注命令
     * @param {Game} game - 游戏实例
     * @param {number} amount - 下注金额
     */
    execute(game, amount) {
        try {
            // 检查游戏状态是否允许下注
            if (game.state !== 'betting') {
                return {
                    success: false,
                    message: '当前游戏状态下无法下注'
                };
            }

            // 检查当前玩家是否可以下注
            const currentPlayer = game.getCurrentPlayer();
            if (!currentPlayer) {
                return {
                    success: false,
                    message: '无法确定当前玩家'
                };
            }

            // 检查下注金额是否有效
            if (!amount || amount <= 0) {
                return {
                    success: false,
                    message: '下注金额必须大于0'
                };
            }

            // 检查玩家是否有足够的筹码
            if (amount > currentPlayer.chips) {
                return {
                    success: false,
                    message: '筹码不足'
                };
            }

            // 执行下注操作
            game.handlePlayerAction(game.currentPlayerPosition, 'bet', amount);

            return {
                success: true,
                message: `成功下注 ${amount} 筹码`
            };
        } catch (error) {
            return {
                success: false,
                message: `下注失败: ${error.message}`
            };
        }
    }
}