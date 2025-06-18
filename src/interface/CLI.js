import readline from 'readline';
import { Display } from './Display.js';
import { GameEngine } from '../core/GameEngine.js';
import { CommandManager } from '../commands/CommandManager.js';
import { Game } from '../core/Game.js';
import { Table } from '../core/Table.js';
import { Player } from '../core/Player.js';

/**
 * CLI类 - 命令行接口，处理用户输入和游戏流程
 */
export class CLI {
    /**
     * 构造函数
     */
    constructor() {
        // 创建readline接口
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // 游戏设置默认值
        this.gameSettings = {
            playerCount: 3,
            playerNames: [],
            initialChips: 1000,
            bigBlind: 20
        };

        // 创建显示管理器
        this.displayManager = new Display(null); // 暂时传入null，后面会设置

        // 游戏引擎
        this.gameEngine = null;
    }

    /**
     * 启动CLI
     */
    async start() {
        console.clear();
        await this.showMainPage();
    }

    /**
     * 显示主页面
     */
    async showMainPage() {
        console.log(this.displayManager.renderMainPage());
        
        const input = await this.getInput();
        
        switch (input) {
            case '001':
                await this.showGameSetupPage();
                break;
            case '002':
                this.displayManager.displayError('测试模式尚未实现');
                await this.showMainPage();
                break;
            case '003':
                this.displayManager.displayError('统计功能尚未实现');
                await this.showMainPage();
                break;
            case '004':
                this.displayManager.displayError('拓展功能尚未实现');
                await this.showMainPage();
                break;
            case '000':
                this.exit();
                break;
            default:
                this.displayManager.displayError('无效的命令，请重新输入');
                await this.showMainPage();
                break;
        }
    }

    /**
     * 显示游戏设置页面
     */
    async showGameSetupPage() {
        console.clear();
        console.log(this.displayManager.renderGameSetupPage(this.gameSettings));
        
        const input = await this.getInput();
        
        switch (input) {
            case '091':
                await this.setPlayerCount();
                break;
            case '092':
                await this.setPlayerNames();
                break;
            case '093':
                await this.setInitialChips();
                break;
            case '094':
                await this.setBigBlind();
                break;
            case '090':
                await this.startGame();
                break;
            case '000':
                await this.showMainPage();
                break;
            default:
                this.displayManager.displayError('无效的命令，请重新输入');
                await this.showGameSetupPage();
                break;
        }
    }

    /**
     * 设置玩家人数
     */
    async setPlayerCount() {
        console.log('请输入玩家人数 (2-8):');
        const input = await this.getInput();
        const count = parseInt(input);
        
        if (isNaN(count) || count < 2 || count > 8) {
            this.displayManager.displayError('无效的玩家人数，请输入2-8之间的数字');
        } else {
            this.gameSettings.playerCount = count;
            this.displayManager.displaySuccess(`玩家人数已设置为 ${count}`);
        }
        
        await this.showGameSetupPage();
    }

    /**
     * 设置玩家名称
     */
    async setPlayerNames() {
        for (let i = 0; i < this.gameSettings.playerCount; i++) {
            console.log(`请输入Player${i}的名称 (直接回车使用默认名称 Player${i}):`)
            const name = await this.getInput();
            
            if (name.trim() !== '') {
                this.gameSettings.playerNames[i] = name.trim();
            } else {
                this.gameSettings.playerNames[i] = `Player${i}`;
            }
        }
        
        this.displayManager.displaySuccess('玩家名称设置完成');
        await this.showGameSetupPage();
    }

    /**
     * 设置初始筹码
     */
    async setInitialChips() {
        console.log('请输入初始筹码数量 (300-10000):');
        const input = await this.getInput();
        const chips = parseInt(input);
        
        if (isNaN(chips) || chips < 300 || chips > 10000) {
            this.displayManager.displayError('无效的筹码数量，请输入300-10000之间的数字');
        } else {
            this.gameSettings.initialChips = chips;
            this.displayManager.displaySuccess(`初始筹码已设置为 ${chips}`);
        }
        
        await this.showGameSetupPage();
    }

    /**
     * 设置大盲注
     */
    async setBigBlind() {
        console.log('请输入起始大盲注金额 (必须是100以内能被2整除的数):');
        const input = await this.getInput();
        const blind = parseInt(input);
        
        if (isNaN(blind) || blind <= 0 || blind > 100 || blind % 2 !== 0) {
            this.displayManager.displayError('无效的大盲注金额，请输入100以内能被2整除的数');
        } else {
            this.gameSettings.bigBlind = blind;
            this.displayManager.displaySuccess(`起始大盲注已设置为 ${blind}，小盲注为 ${blind/2}`);
        }
        
        await this.showGameSetupPage();
    }

    /**
     * 启动游戏
     */
    async startGame() {
        try {
            // 创建牌桌
            const table = new Table(this.gameSettings.bigBlind / 2, this.gameSettings.bigBlind);
            
            // 创建玩家
            for (let i = 0; i < this.gameSettings.playerCount; i++) {
                const name = this.gameSettings.playerNames[i] || `Player${i}`;
                const player = new Player(name, this.gameSettings.initialChips);
                table.addPlayer(player, i);
            }
            
            // 创建游戏实例
            const game = new Game(table);
            
            // 创建命令管理器
            const commandManager = new CommandManager(game, {
                onCommandExecuted: (command, result, playerName) => {
                    this.displayManager.updateGameState(game);
                },
                onError: (error) => {
                    this.displayManager.displayError(error.message);
                }
            });
            
            // 更新显示管理器中的命令管理器引用
            this.displayManager.commandManager = commandManager;
            
            // 创建游戏引擎
            this.gameEngine = new GameEngine(this.displayManager, this);
            this.gameEngine.game = game;
            this.gameEngine.commandManager = commandManager;
            
            // 开始游戏
            game.startNewRound();
            await this.gameEngine.start();
        } catch (error) {
            this.displayManager.displayError(`游戏启动失败: ${error.message}`);
            await this.showGameSetupPage();
        }
    }

    /**
     * 获取用户输入
     * @returns {Promise<string>} - 用户输入的文本
     */
    getInput() {
        return new Promise((resolve) => {
            this.rl.question('', (answer) => {
                resolve(answer.trim());
            });
        });
    }

    /**
     * 显示错误信息
     * @param {string} message - 错误消息
     */
    displayError(message) {
        this.displayManager.displayError(message);
    }

    /**
     * 询问是否再玩一轮
     * @returns {Promise<boolean>} - 是否再玩一轮
     */
    async askPlayAgain() {
        console.log('游戏结束。是否再玩一轮? (y/n)');
        const input = await this.getInput();
        return input.toLowerCase() === 'y';
    }

    /**
     * 退出程序
     */
    exit() {
        console.log('感谢使用，再见!');
        this.rl.close();
        process.exit(0);
    }
}

// 如果直接运行此文件，则启动CLI
if (require.main === module) {
    const cli = new CLI();
    cli.start().catch(error => {
        console.error('程序出错:', error);
        process.exit(1);
    });
}