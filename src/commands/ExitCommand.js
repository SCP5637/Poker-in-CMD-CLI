/**
 * 退出游戏命令
 * 处理退出整个游戏程序的操作
 */
export class ExitCommand {
    /**
     * 执行退出游戏命令
     * @param {Game} game - 游戏实例
     */
    execute(game) {
        try {
            console.log('感谢游玩德州扑克命令行版！');
            
            // 退出程序
            process.exit(0);
        } catch (error) {
            return {
                success: false,
                message: `退出游戏失败: ${error.message}`
            };
        }
    }
}