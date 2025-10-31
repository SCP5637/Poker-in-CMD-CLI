/**
 * 过牌命令
 * 处理玩家过牌操作
 */
export class CheckCommand {
    /**
     * 执行过牌命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            // 检查游戏状态是否允许过牌
            if (game.state !== 'betting') {
                return {
                    success: false,
                    message: '当前游戏状态下无法过牌'
                };
            }

            // 检查当前玩家是否可以行动
            const currentPlayer = game.getCurrentPlayer();
            if (!currentPlayer) {
                return {
                    success: false,
                    message: '无法确定当前玩家'
                };
            }

            // 检查是否可以过牌（当前没有下注）
            if (game.currentBet > currentPlayer.currentBet) {
                return {
                    success: false,
                    message: '当前有下注，无法过牌'
                };
            }

            // 执行过牌操作
            game.handlePlayerAction(game.currentPlayerPosition, 'check');

            return {
                success: true,
                message: '成功过牌'
            };
        } catch (error) {
            return {
                success: false,
                message: `过牌失败: ${error.message}`
            };
        }
    }
}