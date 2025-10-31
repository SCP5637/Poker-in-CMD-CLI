/**
 * 下一局命令
 * 处理进入下一局游戏的操作
 */
export class NextCommand {
    /**
     * 执行进入下一局命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            // 检查游戏是否已结束
            if (game.state !== 'finished') {
                return {
                    success: false,
                    message: '游戏尚未结束，无法进入下一局'
                };
            }

            // 开始新一局游戏
            game.startNewRound();

            return {
                success: true,
                message: '成功进入下一局游戏'
            };
        } catch (error) {
            return {
                success: false,
                message: `进入下一局失败: ${error.message}`
            };
        }
    }
}