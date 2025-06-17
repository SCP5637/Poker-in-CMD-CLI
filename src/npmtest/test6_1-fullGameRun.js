import { Game, GameState, GameStateDescription } from '../core/Game.js';
import { Table } from '../core/Table.js';
import { Player, PlayerStatus } from '../core/Player.js';
import { CommandType } from '../commands/CommandParser.js';
import { CommandManager } from '../commands/CommandManager.js';
import { HandEvaluator } from '../poker/HandEvaluator.js';

console.log('开始测试6_1：使用命令系统进行完整游戏测试...');

// 创建牌桌和游戏实例，直接在构造函数中设置盲注
const table = new Table(10, 20);  // 小盲10，大盲20
const game = new Game(table);

// 创建命令管理器
const commandManager = new CommandManager(game, {
    onCommandExecuted: (command, result) => {
        console.log(`命令执行: ${command.type}`, result ? '✓' : '✗');
    },
    onError: (error) => {
        console.error('命令错误:', error.message);
    }
});

// 创建玩家
const player1 = new Player('玩家1', 1000);
const player2 = new Player('玩家2', 1000);
const player3 = new Player('玩家3', 1000);

// 添加玩家到牌桌
table.addPlayer(player1, 0);  // 位置0
table.addPlayer(player2, 1);  // 位置1
table.addPlayer(player3, 2);  // 位置2

// 设置庄家位置
table.dealerPosition = 0;  // 玩家1是庄家

// 辅助函数：将玩家状态转换为中文
function getStatusInChinese(status) {
    switch (status) {
        case PlayerStatus.ACTIVE:
            return '进行中';
        case PlayerStatus.ALL_IN:
            return '全下';
        case PlayerStatus.FOLDED:
            return '弃牌';
        case PlayerStatus.OUT:
            return '出局';
        default:
            return status;
    }
}

// 辅助函数：打印当前游戏状态
function printGameState() {
    console.log('\n\n————————————————————————————————————————————————————————————————')
    console.log('当前游戏状态:');
    
    // 获取底池金额 - 安全处理
    let potAmount = 0;
    try {
        if (typeof table.pot === 'object' && table.pot !== null && typeof table.pot.getTotalAmount === 'function') {
            potAmount = table.pot.getTotalAmount();
        } else if (typeof table.pot === 'number') {
            potAmount = table.pot;
        }
    } catch (error) {
        console.error('获取底池金额时出错:', error.message);
    }
    
    console.log('底池:', potAmount);
    console.log('公共牌:', table.communityCards.map(card => card.toString()));
    console.log('当前玩家:', game.getCurrentPlayer()?.name || '无');
    console.log('游戏状态:', GameStateDescription[game.state]);
    console.log('当前玩家位置:', game.currentPlayerPosition);
    console.log('庄家位置:', table.dealerPosition);
    
    table.players.forEach((player, index) => {
        if (player) {  // 检查玩家是否存在
            console.log(`${player.name} （位置 ${index}）:`, 
                `筹码=${player.chips}`, 
                `下注=${player.getCurrentBet()}`,
                `手牌=[${player.getHoleCards().map(card => card.toString()).join(', ')}]`,
                `状态=${getStatusInChinese(player.status)}`);
        }
    });
    
    // 打印当前可用的命令
    const availableCommands = commandManager.getAvailableActionCommands();
    if (availableCommands.length > 0) {
        console.log('\n当前玩家可用命令:');
        availableCommands.forEach(cmd => {
            const description = commandManager.getCommandDescription(cmd.type);
            console.log(`- ${cmd.type}-${description}`);
        });
    }
}

try {
    // 开始游戏
    console.log('\n初始化游戏...');
    
    // 使用game.startNewRound()方法开始游戏，它会自动设置游戏状态和当前玩家
    game.startNewRound();
    
    printGameState();

    console.log('\n开始翻牌前轮...');
    // 翻牌前下注轮
    commandManager.executeCommand('012'); // CALL
    commandManager.executeCommand('013', { amount: 60 }); // RAISE
    commandManager.executeCommand('012'); // CALL
    commandManager.executeCommand('012'); // CALL

    printGameState();

    console.log('\n发放翻牌...');
    // 进入翻牌圈，自动发3张公共牌
    game.finishBettingRound();
    printGameState();

    // 翻牌圈下注轮
    commandManager.executeCommand('015'); // CHECK
    commandManager.executeCommand('015'); // CHECK
    commandManager.executeCommand('011', { amount: 100 }); // BET
    commandManager.executeCommand('012'); // CALL
    commandManager.executeCommand('016'); // FOLD

    printGameState();

    console.log('\n发放转牌...');
    // 进入转牌圈，自动发1张转牌
    game.finishBettingRound();
    printGameState();

    // 如果游戏已经进入摊牌阶段，我们就不再执行后续的下注命令
    if (game.state !== GameState.SHOWDOWN) {
        // 转牌圈下注轮
        commandManager.executeCommand('015'); // CHECK
        commandManager.executeCommand('011', { amount: 200 }); // BET
        commandManager.executeCommand('012'); // CALL

        printGameState();

        console.log('\n发放河牌...');
        // 进入河牌圈，自动发1张河牌
        game.finishBettingRound();
        printGameState();

        // 河牌圈下注轮
        commandManager.executeCommand('015'); // CHECK
        commandManager.executeCommand('015'); // CHECK

        printGameState();

        // 摊牌阶段
        console.log('\n摊牌!');
        game.finishBettingRound(); // 结束最后一轮下注，进入摊牌阶段
    } else {
        console.log('\n游戏已进入摊牌阶段，跳过剩余下注轮。');
    }
    
    // 使用HandEvaluator.determineWinners方法确定赢家
    const activePlayers = table.players.filter(player => player && player.status !== PlayerStatus.FOLDED);
    const winners = HandEvaluator.determineWinners(activePlayers, table.communityCards);
    
    // 获取最后的底池金额
    const finalPotAmount = game.getLastPotAmount();
    
    console.log('\n游戏结果:');
    winners.forEach(winner => {
        const hand = winner.getHoleCards();
        const communityCards = table.communityCards;
        const bestHand = HandEvaluator.evaluate([...hand, ...communityCards]);
        console.log(`赢家: ${winner.name}`);
        console.log(`牌型: ${bestHand.getDescription()}`);
        console.log(`牌面: ${bestHand.toString()}`);
        console.log(`赢得: ${finalPotAmount} 筹码`);
    });

    // 打印命令历史
    console.log('\n命令历史:');
    const commandHistory = commandManager.getCommandHistory();
    commandHistory.forEach((entry, index) => {
        const description = commandManager.getCommandDescription(entry.command.type);
        console.log(`${index + 1}. ${entry.command.type}-${description} 于 ${new Date(entry.timestamp).toLocaleTimeString()}`);
    });

    console.log('\n测试成功完成！');
} catch (error) {
    console.error('测试失败:', error);
    throw error;
}