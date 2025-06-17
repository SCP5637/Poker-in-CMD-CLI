import { Game, GameState, GameStateDescription } from '../core/Game.js';
import { Table } from '../core/Table.js';
import { Player, PlayerStatus } from '../core/Player.js';
import { CommandType } from '../commands/CommandParser.js';
import { CommandManager } from '../commands/CommandManager.js';
import { HandEvaluator } from '../poker/HandEvaluator.js';
import readline from 'readline';

console.log('开始测试6_1：使用命令系统进行完整游戏测试...');

// 创建readline接口用于用户输入
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 辅助函数：格式化命令显示，包括参数
function formatCommandDisplay(command, description) {
    let display = `${command.type}-${description}`;
    
    // 添加参数信息
    if (command.args) {
        if (command.type === CommandType.BET && command.args.amount) {
            display += ` ${command.args.amount}筹码`;
        } else if (command.type === CommandType.RAISE && command.args.amount) {
            display += ` 至${command.args.amount}筹码`;
        } else if (command.type === CommandType.ALL_IN && command.args.amount) {
            display += ` ${command.args.amount}筹码`;
        }
    }
    
    return display;
}

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
function printGameState(game, table, commandManager) {
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

// 辅助函数：检查游戏是否应该结束
function shouldGameEnd(table) {
    // 检查是否只有一个玩家还有筹码
    const activePlayers = table.players.filter(player => player && player.chips > 0);
    return activePlayers.length <= 1;
}

// 辅助函数：运行一轮游戏
async function runGameRound(roundNumber, game, table, commandManager) {
    console.log(`\n\n========== 开始第 ${roundNumber} 轮游戏 ==========`);
    
    // 开始新的一轮游戏
    try {
        game.startNewRound();
    } catch (error) {
        console.error(`无法开始第 ${roundNumber} 轮游戏:`, error.message);
        return false;
    }
    
    printGameState(game, table, commandManager);

    console.log('\n\n开始翻牌前轮...');
    // 翻牌前下注轮
    try {
        commandManager.executeCommand('012'); // CALL
        commandManager.executeCommand('013', { amount: 60 }); // RAISE
        commandManager.executeCommand('012'); // CALL
        commandManager.executeCommand('012'); // CALL
    } catch (error) {
        console.error('翻牌前轮执行命令失败:', error.message);
        return false;
    }

    printGameState(game, table, commandManager);

    console.log('\n\n发放翻牌...');
    // 进入翻牌圈，自动发3张公共牌
    game.finishBettingRound();
    printGameState(game, table, commandManager);

    // 翻牌圈下注轮
    try {
        commandManager.executeCommand('015'); // CHECK
        commandManager.executeCommand('015'); // CHECK
        commandManager.executeCommand('011', { amount: 100 }); // BET
        commandManager.executeCommand('012'); // CALL
        commandManager.executeCommand('016'); // FOLD
    } catch (error) {
        console.error('翻牌圈执行命令失败:', error.message);
        return false;
    }

    printGameState(game, table, commandManager);

    console.log('\n\n发放转牌...');
    // 进入转牌圈，自动发1张转牌
    game.finishBettingRound();
    printGameState(game, table, commandManager);

    // 如果游戏已经进入摊牌阶段，我们就不再执行后续的下注命令
    if (game.state !== GameState.SHOWDOWN) {
        // 转牌圈下注轮
        try {
            commandManager.executeCommand('015'); // CHECK
            commandManager.executeCommand('011', { amount: 200 }); // BET
            commandManager.executeCommand('012'); // CALL
        } catch (error) {
            console.error('转牌圈执行命令失败:', error.message);
            return false;
        }

        printGameState(game, table, commandManager);

        console.log('\n\n发放河牌...');
        // 进入河牌圈，自动发1张河牌
        game.finishBettingRound();
        printGameState(game, table, commandManager);

        // 河牌圈下注轮
        try {
            commandManager.executeCommand('015'); // CHECK
            commandManager.executeCommand('015'); // CHECK
        } catch (error) {
            console.error('河牌圈执行命令失败:', error.message);
            return false;
        }

        printGameState(game, table, commandManager);

        // 摊牌阶段
        console.log('\n\n摊牌!');
        game.finishBettingRound(); // 结束最后一轮下注，进入摊牌阶段
    } else {
        console.log('\n游戏已进入摊牌阶段，跳过剩余下注轮。');
    }
    
    // 使用HandEvaluator.determineWinners方法确定赢家
    const activePlayers = table.players.filter(player => player && player.status !== PlayerStatus.FOLDED);
    const winners = HandEvaluator.determineWinners(activePlayers, table.communityCards);
    
    // 获取最后的底池金额
    const finalPotAmount = game.getLastPotAmount();
    
    console.log('\n\n游戏结果:');
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
    console.log('\n\n本轮命令历史:');
    const commandHistory = commandManager.getCommandHistory();
    commandHistory.forEach((entry, index) => {
        const description = commandManager.getCommandDescription(entry.command.type);
        const commandDisplay = formatCommandDisplay(entry.command, description);
        console.log(`${index + 1}. ${entry.playerName}: ${commandDisplay} 于 ${new Date(entry.timestamp).toLocaleTimeString()}`);
    });

    // 清除命令历史，为下一轮做准备
    commandManager.clearCommandHistory();
    
    // 更新庄家位置
    table.moveDealerButton();
    
    // 检查玩家状态，将筹码为0的玩家标记为出局
    table.players.forEach(player => {
        if (player && player.chips <= 0) {
            player.status = PlayerStatus.OUT;
            console.log(`${player.name} 筹码耗尽，已出局！`);
        }
    });
    
    return true;
}

// 主函数：运行多轮游戏测试
async function runMultipleGameRounds() {
    try {
        // 询问用户要测试多少轮
        rl.question('请输入要测试的游戏轮数 (1-10，直接回车默认为2轮): ', async (input) => {
            let rounds = parseInt(input);
            
            // 验证输入
            if (isNaN(rounds) || rounds < 1) {
                rounds = 2; // 默认2轮
                console.log('使用默认值: 2轮');
            } else if (rounds > 10) {
                rounds = 10;
                console.log('最多测试10轮，已设置为10轮');
            }
            
            // 创建牌桌和游戏实例
            const table = new Table(10, 20);  // 小盲10，大盲20
            const game = new Game(table);
            
            // 创建命令管理器
            const commandManager = new CommandManager(game, {
                onCommandExecuted: (command, result, playerName) => {
                    const description = commandManager.getCommandDescription(command.type);
                    const commandDisplay = formatCommandDisplay(command, description);
                    console.log(`命令执行: ${playerName}: ${commandDisplay}`, result ? '✓' : '✗');
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
            
            // 运行指定轮数的游戏
            for (let i = 1; i <= rounds; i++) {
                const success = await runGameRound(i, game, table, commandManager);
                
                // 如果游戏提前结束，则退出循环
                if (!success || shouldGameEnd(table)) {
                    if (shouldGameEnd(table)) {
                        console.log('\n游戏结束：只剩一名玩家有筹码！');
                    }
                    break;
                }
                
                // 如果不是最后一轮，显示玩家当前筹码情况
                if (i < rounds) {
                    console.log('\n\n当前玩家筹码情况:');
                    table.players.forEach((player, index) => {
                        if (player) {
                            console.log(`${player.name}: ${player.chips} 筹码 (状态: ${getStatusInChinese(player.status)})`);
                        }
                    });
                }
            }
            
            console.log('\n\n所有测试轮数完成！');
            console.log('最终玩家筹码情况:');
            table.players.forEach((player, index) => {
                if (player) {
                    console.log(`${player.name}: ${player.chips} 筹码 (状态: ${getStatusInChinese(player.status)})`);
                }
            });
            
            console.log('\n测试成功完成！');
            rl.close();
        });
    } catch (error) {
        console.error('测试失败:', error);
        rl.close();
    }
}

// 运行测试
runMultipleGameRounds();