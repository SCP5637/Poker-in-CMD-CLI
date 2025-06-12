import { BettingRules } from '../betting/BettingRules.js';
import { BettingRound } from '../betting/BettingRound.js';
import { Pot } from '../betting/Pot.js';
import { Player, PlayerStatus } from '../core/Player.js';
import { Table } from '../core/Table.js';

// 测试用例的辅助函数
function createTestPlayer(name, chips, position) {
    return new Player(name, chips, position);
}

function createTestTable() {
    return new Table(10, 20); // 小盲注10，大盲注20
}

function testBettingRules() {
    const player = createTestPlayer('测试玩家', 1000, 0);
    
    // 测试有效下注
    console.log('测试有效下注:');
    console.log('下注20筹码是否有效:', BettingRules.isValidBet(player, 20, 10, 0));  // 应该返回true
    
    // 测试无效下注（超过筹码）
    console.log('测试无效下注（超过筹码）:');
    console.log('下注1200筹码是否有效:', BettingRules.isValidBet(player, 1200, 10, 0));  // 应该返回false
    
    // 测试最小加注
    console.log('测试最小加注:');
    console.log('当前下注50，上次加注30的最小加注额:', BettingRules.getMinRaise(50, 30, 10));  // 应该返回80
    
    // 测试看牌规则
    console.log('测试看牌规则:');
    console.log('当前无人下注时看牌是否有效:', BettingRules.isValidCheck(player, 0));  // 应该返回true
    console.log('当前有人下注时看牌是否有效:', BettingRules.isValidCheck(player, 50));  // 应该返回false
}

function testBettingRound() {
    const table = createTestTable();
    const player1 = createTestPlayer('玩家1', 1000, 0);
    const player2 = createTestPlayer('玩家2', 1000, 1);
    const player3 = createTestPlayer('玩家3', 1000, 2);
    
    // 按位置添加玩家
    table.addPlayer(player1, 0);  // 庄家
    table.addPlayer(player2, 1);  // 小盲注
    table.addPlayer(player3, 2);  // 大盲注
    
    // 设置庄家位置
    table.dealerPosition = 0;
    
    const bettingRound = new BettingRound(table, 'preflop', table.bigBlind);
    
    console.log('开始下注轮次...');
    bettingRound.start();
    
    // 测试收集盲注
    console.log('盲注收集后的当前下注:', bettingRound.getCurrentBet());  // 应该是20（大盲注）
    
    // 测试玩家行动
    console.log('\n测试玩家行动:');
    // 从大盲注后的玩家开始行动（玩家1）
    console.log('玩家1加注到60');
    bettingRound.handleAction(player1, 'raise', 60);
    console.log('当前下注额:', bettingRound.getCurrentBet());
    
    console.log('玩家2跟注');
    bettingRound.handleAction(player2, 'call');
    
    console.log('玩家3弃牌');
    bettingRound.handleAction(player3, 'fold');
    
    // 测试轮次完成检查
    console.log('\n检查轮次是否完成:', bettingRound.isComplete());
}

function testPot() {
    const pot = new Pot();
    const player1 = createTestPlayer('玩家1', 1000, 0);
    const player2 = createTestPlayer('玩家2', 500, 1);
    const player3 = createTestPlayer('玩家3', 1000, 2);
    
    // 测试添加下注
    console.log('添加下注到底池:');
    pot.addBet(player1, 100);
    pot.addBet(player2, 100);
    pot.addBet(player3, 100);
    console.log('当前底池总额:', pot.getTotalAmount());  // 应该是300
    
    // 测试创建边池（玩家2全下）
    console.log('\n创建边池（玩家2全下）:');
    pot.addBet(player1, 400);
    pot.addBet(player3, 400);
    const sidePot = pot.createSidePot(player2);
    console.log('主池金额:', pot.getMainPot());
    console.log('边池金额:', sidePot ? sidePot.amount : 0);
    
    // 测试分配底池
    console.log('\n测试分配底池:');
    const winners = [
        { player: player1, rank: 8 },  // 假设玩家1赢得边池
        { player: player2, rank: 7 }   // 玩家2赢得主池
    ];
    const results = pot.distributePot(winners);
    console.log('分配结果:', results.map(r => `${r.player.name}: ${r.amount}`).join(', '));
}

console.log('开始下注系统测试...\n');

// 测试BettingRules
console.log('\n=== 测试下注规则 ===');
testBettingRules();

// 测试BettingRound
console.log('\n=== 测试下注轮次 ===');
testBettingRound();

// 测试Pot
console.log('\n=== 测试底池 ===');
testPot();

console.log('\n下注系统测试完成。');

// 导出测试函数，以便其他模块可以使用
export {
    createTestPlayer,
    createTestTable,
    testBettingRules,
    testBettingRound,
    testPot
};