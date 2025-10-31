/**
 * 命令执行器
 * 执行解析后的命令
 */
export class CommandExecutor {
    /**
     * 创建命令执行器
     */
    constructor() {
        this.commands = new Map();
        this.initializeDefaultCommands();
    }

    /**
     * 初始化默认命令
     */
    initializeDefaultCommands() {
        // 这里可以注册默认的命令处理器
        // 具体的命令类将在后续实现
    }

    /**
     * 执行命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    execute(command, game) {
        try {
            if (!command || !command.code) {
                return {
                    success: false,
                    message: '无效的命令'
                };
            }

            // 根据命令代码执行相应的操作
            switch (command.code) {
                case '000':
                    return this.executeExit(game);
                case '001':
                    return this.executeCreateGame(game);
                case '011':
                    return this.executeBet(command, game);
                case '012':
                    return this.executeCall(game);
                case '013':
                    return this.executeRaise(command, game);
                case '014':
                    return this.executeAllIn(game);
                case '015':
                    return this.executeCheck(game);
                case '016':
                    return this.executeFold(game);
                case '091':
                    return this.executeNext(game);
                case '099':
                    return this.executeQuit(game);
                default:
                    return {
                        success: false,
                        message: `未知命令: ${command.code}`
                    };
            }
        } catch (error) {
            return {
                success: false,
                message: `执行命令时出错: ${error.message}`
            };
        }
    }

    /**
     * 注册命令处理器
     * @param {string} name - 命令名称
     * @param {Function} handler - 命令处理器函数
     */
    registerCommand(name, handler) {
        if (typeof handler !== 'function') {
            throw new Error('命令处理器必须是一个函数');
        }
        this.commands.set(name, handler);
    }

    /**
     * 执行退出命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeExit(game) {
        return {
            success: true,
            exit: true,
            message: '再见!'
        };
    }

    /**
     * 执行创建游戏命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeCreateGame(game) {
        // 创建游戏的逻辑将在后续完善
        return {
            success: true,
            message: '游戏创建命令已执行'
        };
    }

    /**
     * 执行下注命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeBet(command, game) {
        try {
            const amount = command.args.length > 0 ? parseInt(command.args[0]) : 0;
            const currentPlayerPosition = game.currentPlayerPosition;
            game.handlePlayerAction(currentPlayerPosition, 'bet', amount);
            return {
                success: true,
                message: `下注命令已执行，金额: ${amount}`
            };
        } catch (error) {
            return {
                success: false,
                message: `下注失败: ${error.message}`
            };
        }
    }

    /**
     * 执行跟注命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeCall(game) {
        try {
            const currentPlayerPosition = game.currentPlayerPosition;
            game.handlePlayerAction(currentPlayerPosition, 'call');
            return {
                success: true,
                message: '跟注命令已执行'
            };
        } catch (error) {
            return {
                success: false,
                message: `跟注失败: ${error.message}`
            };
        }
    }

    /**
     * 执行加注命令
     * @param {Object} command - 命令对象
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeRaise(command, game) {
        try {
            const amount = command.args.length > 0 ? parseInt(command.args[0]) : 0;
            const currentPlayerPosition = game.currentPlayerPosition;
            game.handlePlayerAction(currentPlayerPosition, 'raise', amount);
            return {
                success: true,
                message: `加注命令已执行，金额: ${amount}`
            };
        } catch (error) {
            return {
                success: false,
                message: `加注失败: ${error.message}`
            };
        }
    }

    /**
     * 执行全押命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeAllIn(game) {
        try {
            const currentPlayerPosition = game.currentPlayerPosition;
            const player = game.table.players[currentPlayerPosition];
            const allInAmount = player.chips;
            game.handlePlayerAction(currentPlayerPosition, 'raise', allInAmount);
            return {
                success: true,
                message: `全押命令已执行，金额: ${allInAmount}`
            };
        } catch (error) {
            return {
                success: false,
                message: `全押失败: ${error.message}`
            };
        }
    }

    /**
     * 执行过牌命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeCheck(game) {
        try {
            const currentPlayerPosition = game.currentPlayerPosition;
            game.handlePlayerAction(currentPlayerPosition, 'check');
            return {
                success: true,
                message: '过牌命令已执行'
            };
        } catch (error) {
            return {
                success: false,
                message: `过牌失败: ${error.message}`
            };
        }
    }

    /**
     * 执行弃牌命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeFold(game) {
        try {
            const currentPlayerPosition = game.currentPlayerPosition;
            game.handlePlayerAction(currentPlayerPosition, 'fold');
            return {
                success: true,
                message: '弃牌命令已执行'
            };
        } catch (error) {
            return {
                success: false,
                message: `弃牌失败: ${error.message}`
            };
        }
    }

    /**
     * 执行下一局命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeNext(game) {
        try {
            // 重置游戏状态并开始新回合
            game.startNewRound();
            return {
                success: true,
                message: '下一局游戏已开始'
            };
        } catch (error) {
            return {
                success: false,
                message: `无法开始下一局: ${error.message}`
            };
        }
    }

    /**
     * 执行退出当前游戏命令
     * @param {Game} game - 游戏实例
     * @returns {Object} 执行结果
     */
    executeQuit(game) {
        try {
            // 检查游戏是否已经结束
            if (game.state === 'finished') {
                return {
                    success: true,
                    message: '游戏已结束'
                };
            }
            
            // 设置游戏状态为结束
            game.state = 'finished';
            return {
                success: true,
                message: '游戏已结束'
            };
        } catch (error) {
            return {
                success: false,
                message: `退出游戏失败: ${error.message}`
            };
        }
    }
}