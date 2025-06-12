import { Player, PlayerStatus } from './core/Player.js';
import { Table, BettingRound } from './core/Table.js';
import { Game, GameState, PlayerAction } from './core/Game.js';

/**
 * 测试Player、Table和Game类的基本功能
 */
function testGameLogic() {
    console.log('===== 测试游戏核心逻辑 =====');
    
    // 创建玩家
    console.log('\n--- 创建玩家 ---');
    const player1 = new Player('玩家1', 1000, 0);
    const player2 = new Player('玩家2', 1000, 1);
    const player3 = new Player('玩家3', 1000, 2);
    
    console.log(`创建了三名玩家:`);
    console.log(`- ${player1.toString()}`);
    console.log(`- ${player2.toString()}`);
    console.log(`- ${player3.toString()}`);
    
    // 创建牌桌
    console.log('\n--- 创建牌桌 ---');
    const table = new Table(10, 20);  // 小盲10，大盲20
    
    // 添加玩家到牌桌
    table.addPlayer(player1, 0);
    table.addPlayer(player2, 1);
    table.addPlayer(player3, 2);
    console.log('添加了三名玩家到牌桌');
    
    // 创建游戏
    console.log('\n--- 创建游戏 ---');
    const game = new Game(table);
    console.log(`游戏状态: ${game.state}`);
    
    // 开始新的一轮
    console.log('\n--- 开始新的一轮 ---');
    game.startNewRound();
    console.log(`游戏状态: ${game.state}`);
    console.log(`当前下注: ${game.currentBet}`);
    console.log(`当前玩家位置: ${game.currentPlayerPosition}`);
    
    // 显示玩家状态
    console.log('\n玩家状态:');
    table.players.forEach((player, i) => {
        if (player !== null) {
            console.log(`位置 ${i}: ${player.toString()}`);
        }
    });
    
    // 模拟玩家行动
    console.log('\n--- 模拟玩家行动 ---');
    
    // 获取当前玩家位置
    let currentPos = game.currentPlayerPosition;
    let currentPlayer = table.players[currentPos];
    
    // 第一个玩家行动 - 跟注
    console.log(`\n玩家${currentPos + 1} (位置${currentPos}) 选择跟注`);
    game.handlePlayerAction(currentPos, PlayerAction.CALL);
    console.log(`玩家${currentPos + 1}筹码: ${currentPlayer.chips}, 当前下注: ${currentPlayer.getCurrentBet()}`);
    console.log(`当前玩家位置: ${game.currentPlayerPosition}`);
    
    // 获取下一个玩家位置
    currentPos = game.currentPlayerPosition;
    currentPlayer = table.players[currentPos];
    
    // 第二个玩家行动 - 加注
    console.log(`\n玩家${currentPos + 1} (位置${currentPos}) 选择加注到60`);
    game.handlePlayerAction(currentPos, PlayerAction.RAISE, 60);
    console.log(`玩家${currentPos + 1}筹码: ${currentPlayer.chips}, 当前下注: ${currentPlayer.getCurrentBet()}`);
    console.log(`当前玩家位置: ${game.currentPlayerPosition}`);
    
    // 获取下一个玩家位置
    currentPos = game.currentPlayerPosition;
    currentPlayer = table.players[currentPos];
    
    // 第三个玩家行动 - 跟注
    console.log(`\n玩家${currentPos + 1} (位置${currentPos}) 选择跟注`);
    game.handlePlayerAction(currentPos, PlayerAction.CALL);
    console.log(`玩家${currentPos + 1}筹码: ${currentPlayer.chips}, 当前下注: ${currentPlayer.getCurrentBet()}`);
    console.log(`当前玩家位置: ${game.currentPlayerPosition}`);
    
    // 获取下一个玩家位置
    currentPos = game.currentPlayerPosition;
    if (currentPos !== -1) {  // 如果还有玩家可以行动
        currentPlayer = table.players[currentPos];
        
        // 第四个玩家行动 - 弃牌
        console.log(`\n玩家${currentPos + 1} (位置${currentPos}) 选择弃牌`);
        game.handlePlayerAction(currentPos, PlayerAction.FOLD);
        console.log(`玩家${currentPos + 1}状态: ${currentPlayer.status}`);
        console.log(`当前玩家位置: ${game.currentPlayerPosition}`);
    }
    
    // 检查是否进入下一轮
    console.log('\n--- 检查游戏状态 ---');
    console.log(`游戏状态: ${game.state}`);
    console.log(`当前下注轮次: ${table.currentRound}`);
    console.log(`公共牌: ${table.communityCards.map(c => c.toString()).join(' ')}`);
    console.log(`底池: ${table.pot}`);
    
    // 显示最终玩家状态
    console.log('\n最终玩家状态:');
    table.players.forEach((player, i) => {
        if (player !== null) {
            console.log(`位置 ${i}: ${player.toString()}`);
        }
    });
}

// 运行测试
testGameLogic();