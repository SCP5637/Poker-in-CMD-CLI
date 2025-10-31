/**
 * 弃牌命令
 * 处理玩家弃牌操作
 */
export class FoldCommand {
    /**
     * 执行弃牌命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            // 检查游戏状态是否允许弃牌
            if (game.state !== 'betting') {
                return {
                    success: false,
                    message: '当前游戏状态下无法弃牌'
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

            // 执行弃牌操作
            game.handlePlayerAction(game.currentPlayerPosition, 'fold');

            return {
                success: true,
                message: '成功弃牌'
            };
        } catch (error) {
            return {
                success: false,
                message: `弃牌失败: ${error.message}`
            };
        }
    }
}