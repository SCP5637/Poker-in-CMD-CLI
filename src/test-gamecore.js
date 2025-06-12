// 导入所需的类
import { Card } from './core/Card.js';
import { Deck } from './core/Deck.js';
import { Player } from './core/Player.js';
import { Table } from './core/Table.js';
import { Game } from './core/Game.js';
import { HandEvaluator } from './poker/HandEvaluator.js';
import { Hand, HandRanking, HandDescription } from './poker/HandRanking.js';

// 测试函数
function runTests() {
    console.log("开始核心功能测试...\n");
    
    // 测试基础组件初始化
    testBasicInitialization();
    
    // 测试简单的游戏流程
    testBasicGameFlow();
    
    // 测试牌型评估
    testHandEvaluation();
    
    // 测试随机手牌
    testRandomHands();
    
    // 测试德州扑克手牌比较
    testPokerHands();
    
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

// 牌型测试辅助函数
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 测试牌型评估
function testHandEvaluation() {
    console.log("测试3: 牌型评估");
    
    // 定义所有牌型测试用例
    const testCases = [
        {
            name: "皇家同花顺",
            cards: [
                new Card('A', 'S'),
                new Card('K', 'S'),
                new Card('Q', 'S'),
                new Card('J', 'S'),
                new Card('10', 'S')
            ],
            expected: HandRanking.ROYAL_FLUSH
        },
        {
            name: "同花顺",
            cards: [
                new Card('K', 'H'),
                new Card('Q', 'H'),
                new Card('J', 'H'),
                new Card('10', 'H'),
                new Card('9', 'H')
            ],
            expected: HandRanking.STRAIGHT_FLUSH
        },
        {
            name: "特殊同花顺(A-5-4-3-2)",
            cards: [
                new Card('A', 'D'),
                new Card('5', 'D'),
                new Card('4', 'D'),
                new Card('3', 'D'),
                new Card('2', 'D')
            ],
            expected: HandRanking.STRAIGHT_FLUSH
        },
        {
            name: "四条",
            cards: [
                new Card('K', 'S'),
                new Card('K', 'C'),
                new Card('K', 'H'),
                new Card('K', 'D'),
                new Card('Q', 'S')
            ],
            expected: HandRanking.FOUR_OF_A_KIND
        },
        {
            name: "葫芦",
            cards: [
                new Card('Q', 'S'),
                new Card('Q', 'C'),
                new Card('Q', 'H'),
                new Card('J', 'D'),
                new Card('J', 'S')
            ],
            expected: HandRanking.FULL_HOUSE
        },
        {
            name: "同花",
            cards: [
                new Card('A', 'C'),
                new Card('K', 'C'),
                new Card('Q', 'C'),
                new Card('J', 'C'),
                new Card('9', 'C')
            ],
            expected: HandRanking.FLUSH
        },
        {
            name: "顺子",
            cards: [
                new Card('10', 'S'),
                new Card('9', 'H'),
                new Card('8', 'D'),
                new Card('7', 'C'),
                new Card('6', 'S')
            ],
            expected: HandRanking.STRAIGHT
        },
        {
            name: "三条",
            cards: [
                new Card('J', 'S'),
                new Card('J', 'C'),
                new Card('J', 'H'),
                new Card('Q', 'D'),
                new Card('K', 'S')
            ],
            expected: HandRanking.THREE_OF_A_KIND
        },
        {
            name: "两对",
            cards: [
                new Card('10', 'S'),
                new Card('10', 'C'),
                new Card('9', 'H'),
                new Card('9', 'D'),
                new Card('K', 'S')
            ],
            expected: HandRanking.TWO_PAIR
        },
        {
            name: "一对",
            cards: [
                new Card('A', 'S'),
                new Card('A', 'C'),
                new Card('K', 'H'),
                new Card('Q', 'D'),
                new Card('J', 'S')
            ],
            expected: HandRanking.ONE_PAIR
        },
        {
            name: "高牌",
            cards: [
                new Card('A', 'S'),
                new Card('K', 'C'),
                new Card('Q', 'H'),
                new Card('J', 'D'),
                new Card('9', 'S')
            ],
            expected: HandRanking.HIGH_CARD
        }
    ];

    let passed = 0;
    let failed = 0;
    
    // 运行所有测试用例
    testCases.forEach(testCase => {
        // 随机打乱牌组顺序
        const shuffledCards = shuffleArray(testCase.cards);
        
        // 评估牌型
        const hand = HandEvaluator.evaluate(shuffledCards);
        
        // 验证结果
        const isPassed = hand.rank === testCase.expected;
        if (isPassed) {
            passed++;
        } else {
            failed++;
        }
        
        // 输出详细测试结果
        console.log(`\n${testCase.name}测试:`);
        console.log(`- 牌组: ${shuffledCards.map(c => c.toString()).join(', ')}`);
        console.log(`- 预期数值: ${testCase.expected}`);
        console.log(`- 实际数值: ${hand.rank}`);
        console.log(`- 预期牌型: ${HandDescription[testCase.expected]}`);
        console.log(`- 实际牌型: ${hand.getDescription()}`);
        console.log(`- 结果: ${isPassed ? '✓ 通过' : '✗ 失败'}`);
    });
    
    // 输出测试摘要
    console.log(`\n测试摘要:`);
    console.log(`- 通过: ${passed}`);
    console.log(`- 失败: ${failed}`);
    console.log(`- 通过率: ${Math.round((passed / testCases.length) * 100)}%`);
    
    console.log("\n牌型评估测试完成");
}

// 测试随机手牌
function testRandomHands() {
    console.log("\n测试4: 随机手牌评估");
    
    for (let i = 1; i <= 3; i++) {
        console.log(`\n随机手牌测试 #${i}:`);
        
        // 创建新牌组并洗牌
        const deck = new Deck();
        deck.shuffle();
        
        // 抽取5张牌
        const cards = deck.deal(9);
        
        // 打乱这5张牌的顺序
        const shuffledCards = shuffleArray(cards);
        
        // 评估牌型
        const hand = HandEvaluator.evaluate(shuffledCards);
        
        // 输出结果
        console.log(`- 抽取的牌: ${shuffledCards.map(c => c.toString()).join(', ')}`);
        console.log(`- 牌型: ${hand.getDescription()}`);
    }
    
    console.log("\n随机手牌测试完成");
}

// 测试德州扑克手牌比较
function testPokerHands() {
    console.log("\n测试5: 单挑手牌比较");
    
    // 创建新牌组并洗牌
    const deck = new Deck();
    deck.shuffle();
    
    // 随机抽五张牌作为公共牌
    const communityCards = deck.deal(5);
    // 从牌组中抽取皇家同花顺作为公共牌
    // const communityCards = deck.extractSpecificCards([
    //     { rank: 'A', suit: '♦' },
    //     { rank: 'K', suit: '♦' },
    //     { rank: 'Q', suit: '♦' },
    //     { rank: 'J', suit: '♦' },
    //     { rank: '10', suit: '♦' }
    // ]);

    console.log(`公共牌: ${communityCards.map(c => c.toString()).join(', ')}`);
    
    // 抽取玩家1的两张手牌
    const player1Cards = deck.deal(2);
    console.log(`玩家1手牌: ${player1Cards.map(c => c.toString()).join(', ')}`);
    
    // 抽取玩家2的两张手牌
    const player2Cards = deck.deal(2);
    console.log(`玩家2手牌: ${player2Cards.map(c => c.toString()).join(', ')}`);
    
    // 评估玩家1的最佳牌型（从7张牌中选择最佳的5张）
    const player1AllCards = [...communityCards, ...player1Cards];
    const player1Hand = HandEvaluator.evaluate(player1AllCards);
    console.log(`\n玩家1最佳牌型: ${player1Hand.getDescription()}`);
    
    // 评估玩家2的最佳牌型（从7张牌中选择最佳的5张）
    const player2AllCards = [...communityCards, ...player2Cards];
    const player2Hand = HandEvaluator.evaluate(player2AllCards);
    console.log(`玩家2最佳牌型: ${player2Hand.getDescription()}`);
    
    // 比较两位玩家的牌型
    let result;
    if (player1Hand.rank > player2Hand.rank) {
        result = "玩家1胜出";
    } else if (player1Hand.rank < player2Hand.rank) {
        result = "玩家2胜出";
    } else {
        result = "平局";
    }
    console.log(`\n比较结果: ${result}`);
    
    console.log("\n德州扑克手牌比较测试完成");
}

// 运行所有测试
runTests();