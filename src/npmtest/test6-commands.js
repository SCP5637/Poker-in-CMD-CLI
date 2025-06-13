import { CommandParser, CommandType } from '../commands/CommandParser.js';
import { CommandExecutor } from '../commands/CommandExecutor.js';
import { CommandFactory } from '../commands/CommandFactory.js';
import { Game } from '../core/Game.js';
import { Player } from '../core/Player.js';
import { Table } from '../core/Table.js';

/**
 * 测试命令系统的基本功能
 */
function testCommandSystem() {
    console.log('===== 测试命令系统 =====');
    
    // 测试命令解析器
    console.log('\n--- 测试命令解析器 ---');
    testCommandParser();
    
    // 测试命令工厂
    console.log('\n--- 测试命令工厂 ---');
    testCommandFactory();
    
    // 测试命令执行器
    console.log('\n--- 测试命令执行器 ---');
    testCommandExecutor();
    
    console.log('\n===== 命令系统测试完成 =====');
}

/**
 * 测试命令解析器功能
 */
function testCommandParser() {
    // 测试下注命令解析
    try {
        const betCommand = CommandParser.parse('011', { amount: 100 });
        console.log(`下注命令解析成功: ${betCommand.type === CommandType.BET && betCommand.args.amount === 100}`);
    } catch (error) {
        console.error(`下注命令解析失败: ${error.message}`);
    }

    // 测试跟注命令解析
    try {
        const callCommand = CommandParser.parse('012');
        console.log(`跟注命令解析成功: ${callCommand.type === CommandType.CALL}`);
    } catch (error) {
        console.error(`跟注命令解析失败: ${error.message}`);
    }

    // 测试加注命令解析
    try {
        const raiseCommand = CommandParser.parse('013', { amount: 200 });
        console.log(`加注命令解析成功: ${raiseCommand.type === CommandType.RAISE && raiseCommand.args.amount === 200}`);
    } catch (error) {
        console.error(`加注命令解析失败: ${error.message}`);
    }

    // 测试弃牌命令解析
    try {
        const foldCommand = CommandParser.parse('016');
        console.log(`弃牌命令解析成功: ${foldCommand.type === CommandType.FOLD}`);
    } catch (error) {
        console.error(`弃牌命令解析失败: ${error.message}`);
    }

    // 测试看牌命令解析
    try {
        const checkCommand = CommandParser.parse('015');
        console.log(`看牌命令解析成功: ${checkCommand.type === CommandType.CHECK}`);
    } catch (error) {
        console.error(`看牌命令解析失败: ${error.message}`);
    }

    // 测试无效命令解析
    try {
        CommandParser.parse('999');
        console.log('无效命令应该抛出错误: 失败');
    } catch (error) {
        console.log('无效命令抛出错误: 成功');
    }
}

/**
 * 测试命令工厂功能
 */
function testCommandFactory() {
    try {
        const betCommand = CommandFactory.createBetCommand(100);
        console.log(`下注命令创建成功: ${betCommand !== null}`);
        
        const callCommand = CommandFactory.createCallCommand();
        console.log(`跟注命令创建成功: ${callCommand !== null}`);
        
        const raiseCommand = CommandFactory.createRaiseCommand(200);
        console.log(`加注命令创建成功: ${raiseCommand !== null}`);
        
        const foldCommand = CommandFactory.createFoldCommand();
        console.log(`弃牌命令创建成功: ${foldCommand !== null}`);
        
        const checkCommand = CommandFactory.createCheckCommand();
        console.log(`看牌命令创建成功: ${checkCommand !== null}`);
    } catch (error) {
        console.error(`命令创建失败: ${error.message}`);
    }
}

/**
 * 创建测试游戏实例
 */
function createTestGame() {
    const table = new Table(10, 20); // 小盲10，大盲20
    const game = new Game(table);
    
    // 添加玩家
    table.addPlayer(new Player("玩家1", 1000, 0), 0);
    table.addPlayer(new Player("玩家2", 1000, 1), 1);
    
    // 开始游戏
    game.startNewRound();
    return game;
}

/**
 * 测试命令执行器功能
 */
function testCommandExecutor() {
    const game = createTestGame();
    const executor = new CommandExecutor();

    // 测试跟注命令执行（第一个玩家跟注大盲注）
    try {
        const callCommand = CommandParser.parse('012');
        const success = executor.execute(callCommand, game);
        console.log(`第一个玩家跟注命令执行成功: ${success}`);
    } catch (error) {
        console.error(`第一个玩家跟注命令执行失败: ${error.message}`);
    }

    // 测试跟注命令执行
    try {
        // 切换到第二个玩家
        game.moveToNextPlayer();
        const callCommand = CommandParser.parse('012');
        const success = executor.execute(callCommand, game);
        console.log(`第二个玩家跟注命令执行成功: ${success}`);
    } catch (error) {
        console.error(`第二个玩家跟注命令执行失败: ${error.message}`);
    }

    // 测试错误状态下的命令执行
    try {
        // 尝试在错误的游戏状态下执行命令
        game.state = 'INVALID_STATE';
        const checkCommand = CommandParser.parse('015');
        executor.execute(checkCommand, game);
        console.log('无效状态下命令应该抛出错误: 失败');
    } catch (error) {
        console.log('无效状态下命令抛出错误: 成功');
    }
}

// 运行测试
testCommandSystem();