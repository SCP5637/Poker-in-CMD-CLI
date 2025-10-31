/**
 * 跟注命令
 * 处理玩家跟注操作
 */
export class CallCommand {
    /**
     * 执行跟注命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            // 检查游戏状态是否允许跟注
            if (game.state !== 'betting') {
                return {
                    success: false,
                    message: '当前游戏状态下无法跟注'
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

            // 执行跟注操作
            game.handlePlayerAction(game.currentPlayerPosition, 'call');

            return {
                success: true,
                message: '成功跟注'
            };
        } catch (error) {
            return {
                success: false,
                message: `跟注失败: ${error.message}`
            };
        }
    }
}