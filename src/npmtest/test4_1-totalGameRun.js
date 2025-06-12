import { Card } from '../core/Card.js';
import { Deck } from '../core/Deck.js';
import { Player, PlayerStatus } from '../core/Player.js';
import { Table } from '../core/Table.js';
import { Game } from '../core/Game.js';
import { HandEvaluator } from '../poker/HandEvaluator.js';
import { BettingRound } from '../betting/BettingRound.js';
import { Pot } from '../betting/Pot.js';

console.log('开始综合游戏测试...\n');

// 创建游戏实例
function setupGame() {
    console.log('=== 游戏初始化 ===');
    
    // 创建牌桌 (小盲注10，大盲注20)
    const table = new Table(10, 20);
    
    // 创建玩家
    const player1 = new Player("玩家1", 1000, 0);
    const player2 = new Player("玩家2", 1000, 1);
    const player3 = new Player("玩家3", 1000, 2);
    
    // 添加玩家到牌桌
    table.addPlayer(player1, 0); // 庄家
    table.addPlayer(player2, 1); // 小盲注
    table.addPlayer(player3, 2); // 大盲注
    
    // 设置庄家位置
    table.dealerPosition = 0;
    
    // 创建游戏实例
    const game = new Game(table);
    
    console.log('- 创建牌桌和玩家成功');
    console.log(`- 玩家数量: ${table.players.length}`);
    console.log(`- 庄家位置: ${table.dealerPosition}`);
    console.log(`- 小盲注: ${table.smallBlind}, 大盲注: ${table.bigBlind}\n`);
    
    return game;
}

// 模拟一轮下注
function simulateBettingRound(game, roundName, currentBet = 0) {
    console.log(`=== ${roundName}下注轮 ===`);
    
    const bettingRound = new BettingRound(game.table, roundName, currentBet);
    bettingRound.start();
    
    // 模拟玩家行动
    const actions = ['call', 'raise', 'call']; // 简单的行动序列
    const amounts = [0, 60, 0]; // 相应的下注金额
    
    game.table.players.forEach((player, index) => {
        if (player !== null && player.getStatus() !== PlayerStatus.FOLDED) {
            const action = actions[index];
            const amount = amounts[index];
            
            console.log(`${player.name} ${action}${amount ? ' 到 ' + amount : ''}`);
            bettingRound.handleAction(player, action, amount);
        }
    });
    
    // 收集所有下注到底池
    game.table.collectBets();
    
    console.log(`- 当前底池: ${game.table.pot}\n`);
    return bettingRound.getCurrentBet();
}

// 显示玩家手牌
function displayPlayerHands(players, communityCards) {
    console.log('=== 玩家手牌 ===');
    players.forEach(player => {
        if (player !== null && player.getStatus() !== PlayerStatus.FOLDED) {
            const holeCards = player.getHoleCards();
            const allCards = [...holeCards, ...communityCards];
            const bestHand = HandEvaluator.evaluate(allCards);
            console.log(`${player.name}:`);
            console.log(`- 手牌: ${holeCards.map(card => card.toString()).join(', ')}`);
            console.log(`- 牌型: ${bestHand.getDescription()}\n`);
        }
    });
}

// 确定赢家
function determineWinner(players, communityCards) {
    console.log('=== 确定赢家 ===');
    
    const activePlayers = players.filter(p => p !== null && p.getStatus() !== PlayerStatus.FOLDED);
    const hands = activePlayers.map(player => {
        const allCards = [...player.getHoleCards(), ...communityCards];
        const hand = HandEvaluator.evaluate(allCards);
        return { player, hand };
    });
    
    // 按牌型排序
    hands.sort((a, b) => b.hand.rank - a.hand.rank);
    
    return hands[0]; // 返回最大牌型的玩家
}

// 运行完整游戏测试
function runGameTest() {
    const game = setupGame();
    
    // 创建并洗牌
    const deck = new Deck();
    deck.shuffle();
    
    // 发手牌
    console.log('=== 发手牌 ===');
    game.table.players.forEach(player => {
        if (player !== null) {
            const cards = deck.deal(2);
            player.dealHoleCards(cards);
            console.log(`${player.name}: ${cards.map(card => card.toString()).join(', ')}`);
        }
    });
    console.log();
    
    // 翻牌前下注轮
    let currentBet = simulateBettingRound(game, '翻牌前');
    
    // 发公共牌
    console.log('=== 发公共牌 ===');
    const flop = deck.deal(3);
    console.log(`翻牌: ${flop.map(card => card.toString()).join(', ')}`);
    game.table.communityCards = flop;
    console.log();
    
    // 翻牌圈下注轮
    currentBet = simulateBettingRound(game, '翻牌圈', currentBet);
    
    // 发转牌
    const turn = deck.deal(1);
    console.log(`转牌: ${turn.map(card => card.toString()).join(', ')}`);
    game.table.communityCards.push(turn[0]);
    console.log();
    
    // 转牌圈下注轮
    currentBet = simulateBettingRound(game, '转牌圈', currentBet);
    
    // 发河牌
    const river = deck.deal(1);
    console.log(`河牌: ${river.map(card => card.toString()).join(', ')}`);
    game.table.communityCards.push(river[0]);
    console.log();
    
    // 河牌圈下注轮
    currentBet = simulateBettingRound(game, '河牌圈', currentBet);
    
    // 显示所有玩家的手牌和牌型
    displayPlayerHands(game.table.players, game.table.communityCards);
    
    // 确定赢家并分配底池
    const winner = determineWinner(game.table.players, game.table.communityCards);
    console.log(`赢家是 ${winner.player.name}，牌型: ${winner.hand.getDescription()}`);
    
    // 分配底池
    const results = game.table.pot.distributePot([{
        player: winner.player, 
        rank: winner.hand.rank 
    }]);
    
    console.log(`\n底池分配: ${winner.player.name} 获得 ${results[0].amount} 筹码`);
}

// 运行测试
runGameTest();
console.log('\n综合游戏测试完成。');