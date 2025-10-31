/**
 * 退出当前游戏命令
 * 处理退出当前游戏的操作
 */
export class QuitCommand {
    /**
     * 执行退出当前游戏命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            // 重置游戏状态
            game.state = 'waiting';
            
            // 可以在这里添加其他清理逻辑
            
            return {
                success: true,
                message: '已退出当前游戏'
            };
        } catch (error) {
            return {
                success: false,
                message: `退出游戏失败: ${error.message}`
            };
        }
    }
}