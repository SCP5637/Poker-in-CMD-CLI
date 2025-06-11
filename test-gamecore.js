// 导入所需的类
import { Card } from './src/core/Card.js';
import { Deck } from './src/core/Deck.js';
import { Player } from './src/core/Player.js';
import { Table } from './src/core/Table.js';
import { Game } from './src/core/Game.js';
import { HandEvaluator } from './src/poker/HandEvaluator.js';
import { Hand, HandRanking } from './src/poker/HandRanking.js';

// 测试函数
function runTests() {
    console.log("开始核心功能测试...\n");
    
    // 测试基础组件初始化
    testBasicInitialization();
    
    // 测试简单的游戏流程
    testBasicGameFlow();
    
    // 测试牌型评估
    testHandEvaluation();
    
    console.log("\n所有测试完成!");
}

// 测试基础组件初始化
function testBasicInitialization() {
    console.log("测试1: 基础组件初始化");
    
    // 测试牌组
    const deck = new Deck();
    console.log(`- 创建新牌组: ${deck.cards.length === 52 ? "成功" : "失败"}`);
    
    // 测试玩家
    const player = new Player("测试玩家", 1000);
    console.log(`- 创建玩家: ${player.name === "测试玩家" && player.chips === 1000 ? "成功" : "失败"}`);
    
    // 测试牌桌
    const table = new Table(10, 20); // 添加小盲和大盲参数
    try {
        table.addPlayer(player, 0); // 添加位置参数
        console.log(`- 创建牌桌并添加玩家: ${table.players[0] === player ? "成功" : "失败"}`);
    } catch (e) {
        console.log(`- 创建牌桌并添加玩家: 失败 (${e.message})`);
    }
    
    console.log("基础组件初始化测试完成\n");
}

// 测试基本游戏流程
function testBasicGameFlow() {
    console.log("测试2: 基本游戏流程");
    
    // 创建牌桌和游戏实例
    const table = new Table(10, 20); // 小盲10，大盲20
    const game = new Game(table);
    const player1 = new Player("玩家1", 1000);
    const player2 = new Player("玩家2", 1000);
    
    // 添加玩家
    game.table.addPlayer(player1, 0);
    game.table.addPlayer(player2, 1);
    
    // 开始新的一轮游戏
    game.startNewRound();
    
    // 验证盲注收取
    console.log(`- 盲注收取: ${player1.getCurrentBet() > 0 || player2.getCurrentBet() > 0 ? "成功" : "失败"}`);
    
    console.log("基本游戏流程测试完成\n");
}

// 测试牌型评估
function testHandEvaluation() {
    console.log("测试3: 牌型评估");
    
    // 测试同花顺
    const straightFlushHand = [
        new Card('A', 'S'),
        new Card('K', 'S'),
        new Card('Q', 'S'),
        new Card('J', 'S'),
        new Card('10', 'S')
    ];
    
    // 测试四条
    const fourOfAKindHand = [
        new Card('A', 'S'),
        new Card('A', 'C'),
        new Card('A', 'H'),
        new Card('A', 'D'),
        new Card('K', 'S')
    ];
    
    // 测试葫芦
    const fullHouseHand = [
        new Card('A', 'S'),
        new Card('A', 'C'),
        new Card('A', 'H'),
        new Card('K', 'S'),
        new Card('K', 'C')
    ];
    
    // 创建基准牌型对象 - 每种牌型使用对应的卡牌数据
    const straightFlushBaseCards = [
        new Card('A', 'S'),
        new Card('K', 'S'),
        new Card('Q', 'S'),
        new Card('J', 'S'),
        new Card('10', 'S')
    ];
    const fourOfAKindBaseCards = [
        new Card('A', 'S'),
        new Card('A', 'C'),
        new Card('A', 'H'),
        new Card('A', 'D'),
        new Card('K', 'S')
    ];
    const fullHouseBaseCards = [
        new Card('A', 'S'),
        new Card('A', 'C'),
        new Card('A', 'H'),
        new Card('K', 'S'),
        new Card('K', 'C')
    ];
    
    const straightFlushBase = new Hand(HandRanking.STRAIGHT_FLUSH, straightFlushBaseCards, straightFlushBaseCards);
    const fourOfAKindBase = new Hand(HandRanking.FOUR_OF_A_KIND, fourOfAKindBaseCards, fourOfAKindBaseCards);
    const fullHouseBase = new Hand(HandRanking.FULL_HOUSE, fullHouseBaseCards, fullHouseBaseCards);
    
    // 评估牌型
    const straightFlushHandObj = HandEvaluator.evaluate(straightFlushHand);
    const fourOfAKindHandObj = HandEvaluator.evaluate(fourOfAKindHand);
    const fullHouseHandObj = HandEvaluator.evaluate(fullHouseHand);
    
    // 调试输出
    console.log('\n评估结果:');
    console.log('同花顺评估结果:', straightFlushHandObj.toString());
    console.log('四条评估结果:', fourOfAKindHandObj.toString());
    console.log('葫芦评估结果:', fullHouseHandObj.toString());
    
    console.log('\n基准牌型:');
    console.log('同花顺基准:', straightFlushBase.toString());
    console.log('四条基准:', fourOfAKindBase.toString());
    console.log('葫芦基准:', fullHouseBase.toString());
    
    // 通过比较验证牌型
    console.log(`\n- 同花顺识别: ${straightFlushHandObj.compareTo(straightFlushBase) === 0 ? "成功" : "失败"}`);
    console.log(`- 四条识别: ${fourOfAKindHandObj.compareTo(fourOfAKindBase) === 0 ? "成功" : "失败"}`);
    console.log(`- 葫芦识别: ${fullHouseHandObj.compareTo(fullHouseBase) === 0 ? "成功" : "失败"}`);
    
    // 测试牌型大小比较
    const comparison1 = straightFlushHandObj.compareTo(fourOfAKindHandObj);
    const comparison2 = fourOfAKindHandObj.compareTo(fullHouseHandObj);
    console.log(`- 牌型大小比较: ${comparison1 > 0 && comparison2 > 0 ? "成功" : "失败"}`);
    
    console.log("牌型评估测试完成\n");
}

// 运行所有测试
runTests();