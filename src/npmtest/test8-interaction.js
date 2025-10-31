import { CommandParser } from '../commands/CommandParser.js';
import { CommandExecutor } from '../commands/CommandExecutor.js';
import { Game } from '../core/Game.js';
import { Table } from '../core/Table.js';
import { Player } from '../core/Player.js';

/**
 * 测试第8阶段：交互流程
 * 测试命令解析、执行和游戏状态同步
 */
function testInteractionFlow() {
    console.log('===== 测试第8阶段：交互流程 =====');
    
    // 创建游戏实例
    const table = new Table(10, 20);
    const game = new Game(table);
    
    // 添加玩家
    const player1 = new Player('玩家1', 1000, 0);
    const player2 = new Player('玩家2', 1000, 1);
    const player3 = new Player('玩家3', 1000, 2);
    
    table.addPlayer(player1, 0);
    table.addPlayer(player2, 1);
    table.addPlayer(player3, 2);
    
    // 初始化游戏
    game.startNewRound();
    
    // 创建命令解析器和执行器
    const parser = new CommandParser();
    const executor = new CommandExecutor();
    
    console.log('\n--- 测试命令解析 ---');
    const testCommands = ['001', '011 100', '012', '013 50', '015', '016', '000'];
    testCommands.forEach(cmd => {
        const parsed = parser.parse(cmd);
        console.log(`解析命令 "${cmd}":`, parsed);
    });
    
    console.log('\n--- 测试游戏状态同步 ---');
    console.log('游戏状态:', game.state);
    console.log('当前玩家位置:', game.currentPlayerPosition);
    console.log('当前下注:', game.currentBet);
    
    console.log('\n--- 测试动态页面更新 ---');
    // 模拟玩家行动
    try {
        game.handlePlayerAction(0, 'bet', 50);
        console.log('玩家0下注50');
    } catch (error) {
        console.log('下注错误:', error.message);
    }
    
    try {
        game.handlePlayerAction(1, 'call');
        console.log('玩家1跟注');
    } catch (error) {
        console.log('跟注错误:', error.message);
    }
    
    console.log('更新后的游戏状态:');
    console.log('游戏状态:', game.state);
    console.log('当前玩家位置:', game.currentPlayerPosition);
    console.log('当前下注:', game.currentBet);
    
    console.log('\n--- 测试输入反馈机制 ---');
    // 测试无效命令
    const invalidCommand = parser.parse('999');
    const result = executor.execute(invalidCommand, game);
    console.log('执行无效命令 "999" 的结果:', result);
    
    console.log('\n交互流程测试完成');
}

// 运行测试
testInteractionFlow();