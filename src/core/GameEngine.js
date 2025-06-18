import { Game } from './Game.js';
import { Table } from './Table.js';
import { Player } from './Player.js';
import { CommandManager } from '../commands/CommandManager.js';

/**
 * GameEngine类 - 游戏引擎，负责协调游戏流程
 */
export class GameEngine {
    /**
     * 构造函数
     * @param {object} displayManager - 显示管理器实例
     * @param {object} cli - 命令行接口实例
     */
    constructor(displayManager, cli) {
        this.displayManager = displayManager;
        this.cli = cli;
        this.game = null;
        this.commandManager = null;
        this.isRunning = false;
    }

    /**
     * 初始化新游戏
     * @param {object} config - 游戏配置
     */
    async initializeGame(config) {
        const {
            playerCount = 3,
            initialChips = 1000,
            smallBlind = 10,
            playerNames = []
        } = config;

        // 创建牌桌
        const table = new Table(smallBlind, smallBlind * 2);

        // 创建玩家
        for (let i = 0; i < playerCount; i++) {
            const name = playerNames[i] || `Player${i}`;
            const player = new Player(name, initialChips);
            table.addPlayer(player, i);
        }

        // 创建游戏实例
        this.game = new Game(table);

        // 创建命令管理器
        this.commandManager = new CommandManager(this.game, {
            onCommandExecuted: (command, result, playerName) => {
                this.displayManager.updateGameState(this.game);
            },
            onError: (error) => {
                this.cli.displayError(error.message);
            }
        });
    }

    /**
     * 启动游戏主循环
     */
    async start() {
        this.isRunning = true;
        while (this.isRunning) {
            try {
                // 更新显示
                this.displayManager.renderAll(this.game);

                // 获取用户输入
                const input = await this.cli.getInput();

                // 处理退出命令
                if (input === '000') {
                    this.isRunning = false;
                    break;
                }

                // 处理输入
                await this.processInput(input);

                // 检查游戏是否结束
                if (this.game.isGameOver()) {
                    await this.handleGameOver();
                }
            } catch (error) {
                this.cli.displayError(error.message);
            }
        }
    }

    /**
     * 处理用户输入
     * @param {string} input - 用户输入的命令
     */
    async processInput(input) {
        try {
            // 验证输入格式
            if (!/^\d{3}$/.test(input)) {
                throw new Error('无效的命令格式，请输入三位数字命令。');
            }

            // 执行命令
            await this.commandManager.executeCommand(input);
        } catch (error) {
            throw new Error(`命令执行失败: ${error.message}`);
        }
    }

    /**
     * 处理游戏结束
     */
    async handleGameOver() {
        this.displayManager.renderSettlementRegion(this.game);
        const playAgain = await this.cli.askPlayAgain();
        if (playAgain) {
            await this.game.startNewRound();
        } else {
            this.isRunning = false;
        }
    }

    /**
     * 暂停游戏
     */
    pause() {
        this.isRunning = false;
    }

    /**
     * 恢复游戏
     */
    resume() {
        this.isRunning = true;
        this.start();
    }
}