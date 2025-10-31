import { Display } from './Display.js';
import { Logger } from '../utils/Logger.js';

/**
 * 游戏引擎类
 * 控制游戏的主循环和整体流程
 */
export class GameEngine {
    /**
     * 创建游戏引擎
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.display = new Display(game);
        this.state = 'initial'; // initial, running, paused, finished
    }

    /**
     * 启动游戏主循环
     */
    start() {
        this.state = 'running';
        // 初始化游戏
        this.game.startNewRound();
        console.clear();
        const output = this.display.renderAll();
        Logger.logOutput(output);
        console.log(output);
    }

    /**
     * 处理用户输入
     * @param {string} input - 用户输入
     */
    processInput(input) {
        // 简化实现，实际应该解析命令并执行相应操作
        console.log(`处理输入: ${input}`);
        // 更新显示
        this.render();
    }

    /**
     * 更新游戏状态
     */
    update() {
        // 检查游戏是否结束
        if (this.game.isGameOver()) {
            this.handleGameOver();
        }
        // 其他游戏状态更新逻辑
    }

    /**
     * 渲染游戏界面
     */
    render() {
        console.clear();
        const output = this.display.renderAll();
        Logger.logOutput(output);
        console.log(output);
        this.update();
    }

    /**
     * 处理游戏结束逻辑
     */
    handleGameOver() {
        this.state = 'finished';
        // 游戏结束处理
    }
}