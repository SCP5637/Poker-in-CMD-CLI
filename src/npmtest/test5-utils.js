import { HandRankings, PlayerStatus, GameStates, CommandTypes, BettingRounds, ErrorMessages } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { Validator } from '../utils/Validator.js';

/**
 * 测试第5阶段：工具类
 * 测试Constants.js、Logger.js和Validator.js的功能
 */
function testUtils() {
    console.log('===== 测试第5阶段：工具类 =====');
    
    console.log('\n--- 测试Constants.js ---');
    console.log('牌型排名枚举:', HandRankings);
    console.log('玩家状态枚举:', PlayerStatus);
    console.log('游戏状态枚举:', GameStates);
    console.log('命令类型枚举:', CommandTypes);
    console.log('下注轮次枚举:', BettingRounds);
    console.log('错误消息常量:', ErrorMessages);
    
    console.log('\n--- 测试Logger.js ---');
    Logger.log('这是一条普通日志');
    Logger.info('这是一条信息日志');
    Logger.warn('这是一条警告日志');
    Logger.error('这是一条错误日志');
    console.log('日志功能测试完成');
    
    console.log('\n--- 测试Validator.js ---');
    // 测试金额验证
    console.log('验证金额 100:', Validator.isValidAmount(100));
    console.log('验证金额 -50:', Validator.isValidAmount(-50));
    console.log('验证金额 NaN:', Validator.isValidAmount(NaN));
    console.log('验证金额 Infinity:', Validator.isValidAmount(Infinity));
    
    // 测试玩家名称验证
    console.log('验证玩家名称 "张三":', Validator.isValidPlayerName('张三'));
    console.log('验证玩家名称 "":', Validator.isValidPlayerName(''));
    console.log('验证玩家名称 null:', Validator.isValidPlayerName(null));
    
    // 测试命令验证
    console.log('验证命令 "001":', Validator.isValidCommand('001'));
    console.log('验证命令 "1":', Validator.isValidCommand('1'));
    console.log('验证命令 "abc":', Validator.isValidCommand('abc'));
    
    // 测试玩家数量验证
    console.log('验证玩家数量 6:', Validator.isValidPlayerCount(6));
    console.log('验证玩家数量 1:', Validator.isValidPlayerCount(1));
    console.log('验证玩家数量 10:', Validator.isValidPlayerCount(10));
    
    // 测试盲注设置验证
    console.log('验证盲注设置 (10, 20):', Validator.isValidBlindSettings(10, 20));
    console.log('验证盲注设置 (20, 10):', Validator.isValidBlindSettings(20, 10));
    console.log('验证盲注设置 (10, 101):', Validator.isValidBlindSettings(10, 101));
    
    // 测试筹码数量验证
    console.log('验证筹码数量 1000:', Validator.isValidChipAmount(1000));
    console.log('验证筹码数量 200:', Validator.isValidChipAmount(200));
    console.log('验证筹码数量 15000:', Validator.isValidChipAmount(15000));
    
    console.log('\n工具类测试完成');
}

// 运行测试
testUtils();