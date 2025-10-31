import { createInterface } from 'readline';
import { GameEngine } from './GameEngine.js';
import { Display } from './Display.js';
import { Table } from '../core/Table.js';
import { Game } from '../core/Game.js';
import { Player } from '../core/Player.js';
import { CommandParser } from '../commands/CommandParser.js';
import { CommandExecutor } from '../commands/CommandExecutor.js';
import { Logger } from '../utils/Logger.js';

/**
 * 命令行接口类
 * 处理命令行用户界面和输入
 */
export class CLI {
    /**
     * 创建CLI实例
     */
    constructor() {
        this.gameEngine = null;
        this.commandParser = new CommandParser();
        this.commandExecutor = new CommandExecutor();
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // 初始化日志
        Logger.clearLog();
    }

    /**
     * 启动主页面
     */
    async start() {
        console.clear();
        this.showMainMenu();
        // 等待用户输入
        await this.waitForInput();
    }

    /**
     * 显示主菜单
     */
    showMainMenu() {
        const output = '————————————————————————————————————————————————————————————\n' +
                      '欢迎来到德州扑克命令行版!\n' +
                      '\n' +
                      '001.创建游戏\n' +
                      '002.测试模式(待实现)\n' +
                      '003.统计(待实现)\n' +
                      '004.其他拓展功能(待实现)\n' +
                      '\n' +
                      '000.Exit\n' +
                      '————————————————————————————————————————————————————————————\n';
        
        // 记录输出到日志
        Logger.logOutput(output);
        process.stdout.write(output + '$: ');
    }

    /**
     * 显示游戏设置页面
     */
    showGameSetup() {
        // 游戏设置页面实现
        console.log('游戏设置页面待实现');
    }

    /**
     * 启动游戏主循环
     */
    startGame() {
        // 创建游戏实例
        const table = new Table(10, 20); // 小盲注10，大盲注20
        
        // 添加默认玩家
        const player1 = new Player('玩家1', 1000, 0);
        const player2 = new Player('玩家2', 1000, 1);
        const player3 = new Player('玩家3', 1000, 2);
        
        table.addPlayer(player1, 0);
        table.addPlayer(player2, 1);
        table.addPlayer(player3, 2);
        
        const game = new Game(table);
        this.gameEngine = new GameEngine(game);
        this.gameEngine.start();
        this.waitForGameInput();
    }

    /**
     * 等待用户输入主菜单命令
     */
    async waitForInput() {
        this.rl.question('$: ', async (input) => {
            // 记录输入到日志
            Logger.logInput(input);
            
            const command = this.commandParser.parse(input);
            
            if (command) {
                switch (command.code) {
                    case '000':
                        const output = '感谢游玩德州扑克命令行版！\n';
                        Logger.logOutput(output);
                        console.log(output);
                        process.exit(0);
                        break;
                    case '001':
                        this.startGame();
                        break;
                    default:
                        this.displayError('无效命令');
                        this.showMainMenu();
                        await this.waitForInput();
                        break;
                }
            } else {
                this.displayError('无效命令格式');
                this.showMainMenu();
                await this.waitForInput();
            }
        });
    }

    /**
     * 等待游戏中的用户输入
     */
    async waitForGameInput() {
        this.rl.question('$: ', async (input) => {
            // 记录输入到日志
            Logger.logInput(input);
            
            // 在每次输入前清除屏幕
            console.clear();
            
            const command = this.commandParser.parse(input);
            
            if (command) {
                if (command.code === '000') {
                    const output = '感谢游玩德州扑克命令行版！\n';
                    Logger.logOutput(output);
                    console.log(output);
                    process.exit(0);
                }
                
                if (this.gameEngine) {
                    const result = this.commandExecutor.execute(command, this.gameEngine.game);
                    if (!result.success) {
                        this.displayError(result.message);
                    } else if (result.exit) {
                        Logger.logOutput(result.message + '\n');
                        console.log(result.message);
                        process.exit(0);
                    }
                    // 重新显示游戏界面
                    this.gameEngine.render();
                }
                // 只有在游戏仍在进行时才继续等待输入
                if (this.gameEngine && this.gameEngine.state !== 'finished') {
                    await this.waitForGameInput();
                }
            } else {
                this.displayError('无效命令');
                this.gameEngine.render();
                await this.waitForGameInput();
            }
        });
    }

    /**
     * 显示输入错误
     * @param {string} message - 错误信息
     */
    displayError(message) {
        const output = `错误: ${message}\n`;
        Logger.logOutput(output);
        console.log(output);
    }
}