import { GameState, GameStateDescription } from '../core/Game.js';
import { PlayerStatus } from '../core/Player.js';
import { CommandType } from '../commands/CommandParser.js';

/**
 * Display类 - 负责游戏界面的渲染
 */
export class Display {
    /**
     * 构造函数
     * @param {object} commandManager - 命令管理器实例
     */
    constructor(commandManager) {
        this.commandManager = commandManager;
        this.regions = {
            data: '',
            public: '',
            private: '',
            settlement: '',
            command: ''
        };
        this.divider = '————————————————————————————————————————————————————————————';
    }

    /**
     * 清空控制台
     */
    clearConsole() {
        console.clear();
    }

    /**
     * 更新游戏状态
     * @param {object} game - 游戏实例
     */
    updateGameState(game) {
        this.game = game;
    }

    /**
     * 渲染数据区域
     * @param {object} game - 游戏实例
     * @returns {string} - 渲染后的数据区域文本
     */
    renderDataRegion(game) {
        const table = game.table;
        const players = table.players;
        const currentRound = game.getCurrentRound();
        const totalRounds = game.getTotalRounds();
        const gameState = GameStateDescription[game.state];

        let output = `${this.divider}\n`;
        output += `[GameState:${gameState}] | [GameRound:${currentRound}/${totalRounds}]\n`;

        // 显示所有玩家信息
        players.forEach((player, index) => {
            if (!player) return;

            const isCurrentPlayer = index === game.currentPlayerPosition;
            const prefix = isCurrentPlayer ? 'YOU:     ' : `Player${index}: `;
            const blindStatus = this.getBlindStatus(table, index);
            const chips = player.chips;
            const action = this.getPlayerActionText(player);
            const bet = player.getCurrentBet();

            output += `${prefix} ${player.name}${blindStatus}|[$$:${chips}]|[Action:${action}]|[here$:${bet}]\n`;
        });

        output += `${this.divider}\n`;
        return output;
    }

    /**
     * 获取玩家的盲注状态
     * @param {object} table - 牌桌实例
     * @param {number} playerIndex - 玩家索引
     * @returns {string} - 盲注状态文本
     */
    getBlindStatus(table, playerIndex) {
        if (playerIndex === table.smallBlindPosition) {
            return '(小盲注)';
        } else if (playerIndex === table.bigBlindPosition) {
            return '(大盲注)';
        } else if (playerIndex === table.dealerPosition) {
            return '(庄家)';
        }
        return '';
    }

    /**
     * 获取玩家行动文本
     * @param {object} player - 玩家实例
     * @returns {string} - 行动文本
     */
    getPlayerActionText(player) {
        if (player.status === PlayerStatus.ALL_IN) {
            return 'all-in';
        } else if (player.status === PlayerStatus.FOLDED) {
            return 'fold';
        } else if (player.lastAction) {
            return player.lastAction;
        }
        return '等待中';
    }

    /**
     * 渲染公共展示区域
     * @param {object} game - 游戏实例
     * @returns {string} - 渲染后的公共展示区域文本
     */
    renderPublicRegion(game) {
        const table = game.table;
        const communityCards = table.communityCards;
        const bettingRound = game.getBettingRound();
        const currentBet = game.getCurrentBet();
        const mainPot = table.pot.getMainPot();
        const sidePots = table.pot.getSidePots();
        const totalSidePot = sidePots.reduce((sum, pot) => sum + pot.amount, 0);

        let output = `\n${this.divider}\n`;
        output += `[${bettingRound}:${currentBet}$] | [底池:${mainPot}$]`;
        
        if (totalSidePot > 0) {
            output += ` | [边池:${totalSidePot}$]`;
        }
        
        output += `\n${this.divider}\n\n`;
        output += `                Table: `;

        // 显示公共牌
        if (communityCards.length === 0) {
            output += `暂无公共牌`;
        } else {
            for (let i = 0; i < 5; i++) {
                if (i < communityCards.length) {
                    output += `【${communityCards[i].toString()}】`;
                } else {
                    output += `【?】`;
                }
            }
        }

        output += `\n\n${this.divider}\n`;

        // 如果是摊牌阶段，显示所有玩家的手牌
        if (game.state === GameState.SHOWDOWN) {
            table.players.forEach((player, index) => {
                if (!player) return;
                
                if (player.status === PlayerStatus.FOLDED) {
                    output += `${player.name}：FOLD(弃牌后不参与所以不展示开牌)\n`;
                } else {
                    const cards = player.getHoleCards().map(card => `【${card.toString()}】`).join('');
                    output += `${player.name}：${cards}\n`;
                }
            });
        } else {
            // 非摊牌阶段，只显示其他玩家的背面牌
            table.players.forEach((player, index) => {
                if (!player || index === game.currentPlayerPosition) return;
                
                if (player.status === PlayerStatus.FOLDED) {
                    output += `${player.name}：FOLD\n`;
                } else {
                    output += `${player.name}：【?】【?】\n`;
                }
            });
        }

        output += `${this.divider}\n`;
        return output;
    }

    /**
     * 渲染私人展示区域
     * @param {object} game - 游戏实例
     * @returns {string} - 渲染后的私人展示区域文本
     */
    renderPrivateRegion(game) {
        const currentPlayer = game.getCurrentPlayer();
        if (!currentPlayer) return '';

        const remainingChips = currentPlayer.chips;
        const callAmount = game.getCallAmount(currentPlayer);
        const holeCards = currentPlayer.getHoleCards().map(card => `【${card.toString()}】`).join('');

        let output = `\n${this.divider}\n`;
        output += `[remain:$${remainingChips}] | [跟注所需:$${callAmount}]\n`;
        output += `${this.divider}\n`;
        output += `                YOUR CARDS: ${holeCards}\n`;
        output += `${this.divider}\n`;

        return output;
    }

    /**
     * 渲染结算页面
     * @param {object} game - 游戏实例
     * @returns {string} - 渲染后的结算页面文本
     */
    renderSettlementRegion(game) {
        if (game.state !== GameState.SHOWDOWN) {
            return `\n${this.divider}\n[等待进入结算...]\n${this.divider}\n`;
        }

        const winners = game.getWinners();
        const mainPot = game.table.pot.getMainPot();
        const sidePots = game.table.pot.getSidePots();
        const tips = this.getRandomTip();

        let output = `\n${this.divider}\n`;
        output += `结算详细:\n`;

        // 主池结算
        output += `[主池:${mainPot}$]{\n`;
        game.table.players.forEach(player => {
            if (!player) return;
            
            const isWinner = winners.some(w => w.player === player && w.potIndex === 0);
            const amount = isWinner ? `+${winners.find(w => w.player === player && w.potIndex === 0).amount}$` : `-${player.getCurrentBet()}$`;
            const winnerTag = isWinner ? ' !Winner!' : '';
            
            output += `    ${player.name} [${amount}]${winnerTag}\n`;
        });
        output += `}\n`;

        // 边池结算
        sidePots.forEach((sidePot, index) => {
            output += `[边池${index + 1}:${sidePot.amount}$]{\n`;
            sidePot.contributors.forEach(playerId => {
                const player = game.table.getPlayerById(playerId);
                if (!player) return;
                
                const isWinner = winners.some(w => w.player === player && w.potIndex === index + 1);
                const amount = isWinner ? `+${winners.find(w => w.player === player && w.potIndex === index + 1).amount}$` : `-${player.getCurrentBet()}$`;
                const winnerTag = isWinner ? ' !Winner!' : '';
                
                output += `    ${player.name} [${amount}]${winnerTag}\n`;
            });
            output += `}\n`;
        });

        output += `Tips:${tips}\n`;
        output += `${this.divider}\n`;

        return output;
    }

    /**
     * 获取随机提示
     * @returns {string} - 随机提示文本
     */
    getRandomTip() {
        const tips = [
            "德州扑克不仅是运气，更是技巧和心理的较量。",
            "观察对手的行为模式，可能会发现他们的弱点。",
            "有时候，最好的策略是知道何时该弃牌。",
            "不要因为已经投入了筹码就不愿意放弃一手牌。",
            "耐心是德州扑克中最重要的美德之一。",
            "了解位置的重要性可以大大提高你的胜率。",
            "记住，即使是职业选手也会有失误的时候。",
            "不要让情绪影响你的决策，保持冷静。",
            "学会计算底池赔率可以帮助你做出更好的决策。",
            "有时候，诈唬是必要的，但不要过度使用。",
            "所有，或者一无所有",
            "haochi",
            "zhua",
            "你找到真正的面壁者了吗？"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    /**
     * 渲染可执行指令区域
     * @param {object} game - 游戏实例
     * @returns {string} - 渲染后的可执行指令区域文本
     */
    renderCommandRegion(game) {
        const availableCommands = this.commandManager.getAvailableActionCommands();
        const currentPlayer = game.getCurrentPlayer();

        let output = `\n${this.divider}\n`;
        output += `[Command:]\n`;

        // 显示可用的游戏命令
        if (availableCommands.length > 0 && currentPlayer) {
            availableCommands.forEach(cmd => {
                let description = '';
                let cmdText = '';

                switch (cmd.type) {
                    case CommandType.BET:
                        const betAmount = game.getMinBet();
                        cmdText = `011.Bet-[下注: -${betAmount}$]`;
                        break;
                    case CommandType.CALL:
                        const callAmount = game.getCallAmount(currentPlayer);
                        cmdText = `012.Call-[跟注: -${callAmount}$]`;
                        break;
                    case CommandType.RAISE:
                        const minRaise = game.getMinRaise();
                        cmdText = `013.Raise-[加注: -${minRaise}$]`;
                        break;
                    case CommandType.ALL_IN:
                        const allInAmount = currentPlayer.chips;
                        cmdText = `014.All-in-[全下: -${allInAmount}$]`;
                        break;
                    case CommandType.CHECK:
                        cmdText = `015.Check-[过牌]`;
                        break;
                    case CommandType.FOLD:
                        cmdText = `016.Fold-[弃牌]`;
                        break;
                }

                if (cmdText) {
                    output += `${cmdText}\n`;
                }
            });
        }

        // 添加退出和结束游戏命令
        output += `\n000.Exit-[强制退出](关闭程序)(隐藏)\n`;
        output += `\n099.EndGame-[结束当前游戏](结束当前游戏实例,并回到主页面)\n`;
        output += `${this.divider}\n`;
        output += `$: (此处输入指令代号，输入三位数字指令头以进行交互，输入内容不合适则提示)\n`;
        output += `${this.divider}\n`;

        return output;
    }

    /**
     * 渲染主页面
     * @returns {string} - 渲染后的主页面文本
     */
    renderMainPage() {
        let output = `${this.divider}\n`;
        output += `德州扑克命令行版 - 主页面\n\n`;
        output += `001.创建游戏\n`;
        output += `002.测试模式(待考虑实现)\n`;
        output += `003.统计(待考虑实现)\n`;
        output += `004.其他拓展功能(待考虑功能与新模块，如德扑变体，联网人人对战等)\n\n`;
        output += `000.Exit\n`;
        output += `${this.divider}\n`;
        output += `$: `;
        return output;
    }

    /**
     * 渲染游戏设置页面
     * @param {object} settings - 当前设置
     * @returns {string} - 渲染后的游戏设置页面文本
     */
    renderGameSetupPage(settings) {
        const { playerCount = 3, playerNames = [], initialChips = 1000, bigBlind = 20 } = settings;

        let output = `${this.divider}\n`;
        output += `游戏设置页面\n\n`;
        output += `091.玩家人数：${playerCount} (默认3，包括玩家在内，剩余为AI)(可填范围2-8)\n`;
        output += `092.玩家名设置：\n`;
        
        // 显示当前玩家名设置
        for (let i = 0; i < playerCount; i++) {
            const name = playerNames[i] || `Player${i}`;
            output += `    Player${i}: ${name}\n`;
        }

        output += `093.初始筹码：${initialChips} (默认1000)(可填范围300-10000)\n`;
        output += `094.起始大盲注：${bigBlind} (默认20，小盲注为大盲注的一半)(可填范围，100以内能被2整除的数)\n\n`;
        output += `090.确认创建\n\n`;
        output += `000.返回主页面\n`;
        output += `${this.divider}\n`;
        output += `$: `;
        return output;
    }

    /**
     * 渲染完整页面
     * @param {object} game - 游戏实例
     */
    renderAll(game) {
        this.clearConsole();
        
        if (!game) {
            // 如果没有游戏实例，显示主页面
            console.log(this.renderMainPage());
            return;
        }

        // 渲染游戏各个区域
        console.log(this.renderDataRegion(game));
        console.log(this.renderPublicRegion(game));
        console.log(this.renderPrivateRegion(game));
        console.log(this.renderSettlementRegion(game));
        console.log(this.renderCommandRegion(game));
    }

    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    displayError(message) {
        console.log(`\n错误: ${message}\n`);
    }

    /**
     * 显示成功消息
     * @param {string} message - 成功消息
     */
    displaySuccess(message) {
        console.log(`\n${message}\n`);
    }
}