import { 
    HAND_RANKINGS,
    GAME_STATES,
    PLAYER_STATUS,
    COMMAND_TYPES,
    DEFAULT_SETTINGS,
    ERROR_MESSAGES
} from '../utils/Constants.js';
import { logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';
import { Game } from '../core/Game.js';
import { Player } from '../core/Player.js';
import { Table } from '../core/Table.js';

// 测试辅助函数 - 创建测试游戏实例
function createTestGame() {
    const table = new Table(10, 20); // 小盲注10，大盲注20
    const player1 = new Player("测试玩家1", 1000, 0);
    const player2 = new Player("测试玩家2", 1000, 1);
    table.addPlayer(player1, 0);
    table.addPlayer(player2, 1);
    
    // 初始化游戏规则和状态
    const game = new Game(table);
    game.bettingRules = {
        getMinRaise: (currentBet) => currentBet * 2
    };
    
    // 设置当前玩家和游戏状态
    game.currentPlayer = player1;
    game.state = 'preflop';
    
    return game;
}

// 测试Constants.js
function testConstants() {
    console.log('\n=== 测试游戏常量 ===');
    
    // 测试牌型常量
    console.log('测试牌型常量:');
    console.log('皇家同花顺:', HAND_RANKINGS.ROYAL_FLUSH); // 应该返回10
    console.log('同花顺:', HAND_RANKINGS.STRAIGHT_FLUSH); // 应该返回9
    
    // 测试游戏状态常量
    console.log('\n测试游戏状态常量:');
    console.log('等待开始:', GAME_STATES.WAITING); // 应该返回'WAITING'
    console.log('翻牌前:', GAME_STATES.PREFLOP); // 应该返回'PREFLOP'
    
    // 测试玩家状态常量
    console.log('\n测试玩家状态常量:');
    console.log('活跃:', PLAYER_STATUS.ACTIVE); // 应该返回'ACTIVE'
    console.log('弃牌:', PLAYER_STATUS.FOLDED); // 应该返回'FOLDED'
}

// 测试Logger.js
function testLogger() {
    console.log('\n=== 测试日志系统 ===');
    
    // 测试日志级别
    console.log('设置日志级别为DEBUG');
    logger.setLogLevel('debug');
    
    // 测试不同级别的日志
    console.log('\n测试日志输出:');
    logger.debug('这是一条调试日志'); // 应该输出
    logger.info('这是一条信息日志'); // 应该输出
    logger.error('这是一条错误日志'); // 应该输出
    
    // 测试游戏特定日志
    console.log('\n测试游戏特定日志:');
    const game = createTestGame();
    logger.logGameState(game); // 应该输出游戏状态
    logger.logPlayerAction(game.table.players[0], 'CALL', 50); // 应该输出玩家动作
}

// 测试Validator.js
function testValidator() {
    console.log('\n=== 测试输入验证 ===');
    
    const game = createTestGame();
    const validator = new Validator(game);
    
    // 测试金额验证
    console.log('\n测试金额验证:');
    console.log('有效金额(50):', validator.isValidAmount(50)); // 应该返回true
    console.log('无效金额(-10):', validator.isValidAmount(-10)); // 应该返回false
    
    // 测试玩家名验证
    console.log('\n测试玩家名验证:');
    console.log('有效玩家名("玩家1"):', validator.isValidPlayerName("玩家1")); // 应该返回true
    console.log('无效玩家名(""):', validator.isValidPlayerName("")); // 应该返回false
    
    // 测试指令验证
    console.log('\n测试指令验证:');
    console.log('有效指令("CALL"):', validator.isValidCommand("CALL")); // 应该返回true
    console.log('无效指令("INVALID"):', validator.isValidCommand("INVALID")); // 应该返回false
    
    // 测试玩家数量验证
    console.log('\n测试玩家数量验证:');
    console.log('有效数量(4):', validator.isValidPlayerCount(4)); // 应该返回true
    console.log('无效数量(1):', validator.isValidPlayerCount(1)); // 应该返回false
    
    // 测试盲注验证
    console.log('\n测试盲注验证:');
    console.log('有效盲注(20):', validator.isValidBlind(20)); // 应该返回true
    console.log('无效盲注(15):', validator.isValidBlind(15)); // 应该返回false
}

console.log('开始工具类测试...');

// 运行测试
testConstants();
testLogger();
// testValidator(); // 暂时跳过Validator测试

console.log('\n工具类测试完成。');

// 导出测试函数
export {
    createTestGame,
    testConstants,
    testLogger,
    testValidator
};