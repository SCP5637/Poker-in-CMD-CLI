import { GameStateDescription } from '../core/Game.js';
import { HandRanking } from '../poker/HandRanking.js';

/**
 * 显示管理器
 * 负责渲染游戏界面的各个区域
 */
export class Display {
    /**
     * 创建显示管理器
     * @param {Game} game - 游戏实例
     */
    constructor(game) {
        this.game = game;
        this.regions = {};
    }

    /**
     * 渲染数据区域
     * 显示游戏进程、轮次、玩家筹码和下注行动
     */
    renderDataRegion() {
        if (!this.game || !this.game.table) {
            return '';
        }

        let output = this.createSeparator();
        // 游戏状态和轮次信息
        const roundInfo = this.getRoundInfo();
        let gameStateText = GameStateDescription[this.game.state] || this.game.state;
        output += `[GameState: ${gameStateText}] | ${roundInfo}\n`;

        // 玩家信息
        this.game.table.players.forEach((player, index) => {
            if (player) {
                const isDealer = index === this.game.table.dealerPosition ? '(D) ' : '';
                const isSmallBlind = index === this.game.table.getSmallBlindPosition() ? '(SB) ' : '';
                const isBigBlind = index === this.game.table.getBigBlindPosition() ? '(BB) ' : '';
                const blindInfo = isDealer + isSmallBlind + isBigBlind;
                
                const action = this.getPlayerAction(player);
                output += `Player${index}: ${player.name}${blindInfo}|[$$: ${player.chips}]|[Action: ${action}]|[here$: ${player.currentBet}]\n`;
            }
        });

        output += this.createSeparator();
        return output;
    }

    /**
     * 获取轮次信息
     * @returns {string} 轮次信息字符串
     */
    getRoundInfo() {
        if (!this.game || !this.game.table) {
            return '[GameRound: 0/0]';
        }
        
        // 计算游戏轮次信息
        const roundNumber = Math.floor(this.game.table.dealerPosition / this.game.table.players.length) + 1;
        const totalRounds = this.game.table.players.length;
        return `[GameRound: ${roundNumber}/${totalRounds}]`;
    }

    /**
     * 获取玩家行动信息
     * @param {Player} player - 玩家
     * @returns {string} 行动信息
     */
    getPlayerAction(player) {
        if (!player) return 'Unknown';
        
        switch (player.status) {
            case 'folded':
                return 'Fold';
            case 'all-in':
                return 'All-in';
            case 'active':
                return 'Active';
            case 'out':
                return 'Out';
            default:
                return 'Waiting';
        }
    }

    /**
     * 渲染公共展示区域
     * 显示公共牌和当前注额信息
     */
    renderPublicRegion() {
        if (!this.game || !this.game.table) {
            return '';
        }

        let output = this.createSeparator();
        // 注额和底池信息
        output += `[${this.getRoundName()}: ${this.game.currentBet}$] | [底池: ${this.game.table.pot.getTotalAmount()}$] | [边池: ${this.getSidePotAmount()}$]\n`;
        output += this.createSeparator();

        // 公共牌
        output += '\n';
        output += '                                Table: ';
        if (this.game.table.communityCards.length > 0) {
            this.game.table.communityCards.forEach(card => {
                output += `【${card.toString()}】`;
            });
        }

        // 未翻开的牌用?表示
        const totalCommunityCards = 5;
        const remainingCards = totalCommunityCards - this.game.table.communityCards.length;
        for (let i = 0; i < remainingCards; i++) {
            output += '【?】';
        }
        output += '\n\n';

        // 玩家手牌
        this.game.table.players.forEach((player, index) => {
            if (player && player.status !== 'folded') {
                // 在结算阶段显示所有玩家的手牌，否则隐藏
                if ((this.game.state === 'finished' || this.game.state === 'showdown') && player.holeCards && player.holeCards.length >= 2) {
                    output += `player${index}：【${player.holeCards[0].toString()}】【${player.holeCards[1].toString()}】\n`;
                } else {
                    output += `player${index}：【？】【？】\n`;
                }
            } else if (player && player.status === 'folded') {
                output += `player${index}：FOLD\n`;
            }
        });

        output += this.createSeparator();
        return output;
    }

    /**
     * 获取轮次名称
     * @returns {string} 轮次名称
     */
    getRoundName() {
        switch (this.game.table.currentRound) {
            case 'preflop': return '翻牌前';
            case 'flop': return '翻牌';
            case 'turn': return '转牌';
            case 'river': return '河牌';
            default: return '游戏';
        }
    }

    /**
     * 获取边池金额
     * @returns {number} 边池金额
     */
    getSidePotAmount() {
        if (!this.game || !this.game.table || !this.game.table.pot) {
            return 0;
        }
        
        // 计算边池总金额
        const sidePots = this.game.table.pot.getSidePots();
        if (!sidePots || sidePots.length === 0) {
            return 0;
        }
        
        return sidePots.reduce((total, pot) => total + pot.amount, 0);
    }

    /**
     * 渲染私人展示区域
     * 显示玩家手牌和筹码信息
     */
    renderPrivateRegion() {
        let output = this.createSeparator();
        
        if (!this.game || !this.game.table) {
            output += '[remain: 0] | [跟注所需: 0]\n';
            output += this.createSeparator();
            output += '                                YOUR CARDS: 【?】【?】\n';
            output += this.createSeparator();
            return output;
        }
        
        // 获取当前玩家（默认为位置0的玩家）
        const currentPlayer = this.game.getCurrentPlayer();
        
        if (currentPlayer) {
            const remainingChips = currentPlayer.chips;
            const callAmount = this.game.currentBet - currentPlayer.currentBet;
            output += `[remain: $${remainingChips}] | [跟注所需: $${Math.max(0, callAmount)}]\n`;
            
            output += this.createSeparator();
            
            // 只有在玩家有手牌时才显示手牌
            if (currentPlayer.holeCards && currentPlayer.holeCards.length >= 2) {
                output += `                                YOUR CARDS: 【${currentPlayer.holeCards[0].toString()}】【${currentPlayer.holeCards[1].toString()}】\n`;
            } else {
                // 隐藏手牌信息
                output += '                                YOUR CARDS: 【?】【?】\n';
            }
        } else {
            // 如果没有当前玩家，显示位置0的玩家信息
            const defaultPlayer = this.game.table.players[0];
            if (defaultPlayer) {
                const remainingChips = defaultPlayer.chips;
                const callAmount = this.game.currentBet - defaultPlayer.currentBet;
                output += `[remain: $${remainingChips}] | [跟注所需: $${Math.max(0, callAmount)}]\n`;
                
                output += this.createSeparator();
                
                // 只有在当前是该玩家行动时才显示手牌
                if (defaultPlayer.holeCards && defaultPlayer.holeCards.length >= 2) {
                    output += `                                YOUR CARDS: 【${defaultPlayer.holeCards[0].toString()}】【${defaultPlayer.holeCards[1].toString()}】\n`;
                } else {
                    // 隐藏手牌信息
                    output += '                                YOUR CARDS: 【?】【?】\n';
                }
            } else {
                output += '[remain: 0] | [跟注所需: 0]\n';
                output += this.createSeparator();
                output += '                                YOUR CARDS: 【?】【?】\n';
            }
        }
        
        output += this.createSeparator();
        return output;
    }

    /**
     * 渲染结算页面
     * 摊牌后显示结算详情
     */
    renderSettlementRegion() {
        let output = this.createSeparator();
        if (this.game.state === 'finished') {
            output += '结算详细:\n';
            // 显示赢家信息
            const winners = this.game.getWinners();
            if (winners && winners.length > 0) {
                output += `[主池: ${this.game.getLastPotAmount()}$]{\n`;
                winners.forEach(winnerInfo => {
                    const player = winnerInfo.player;
                    output += `    ${player.name} [+${winnerInfo.amount}$] !Winner!\n`;
                });
                output += '}\n';
            }
        } else if (this.game.state === 'showdown') {
            output += '[正在结算...]\n';
        } else {
            output += '[等待进入结算...]\n';
        }
        output += this.createSeparator();
        return output;
    }

    /**
     * 渲染可执行指令区域
     * 根据游戏状态显示可用命令
     */
    renderCommandRegion() {
        let output = this.createSeparator();
        
        // 显示当前操作的玩家
        const currentPlayer = this.game.getCurrentPlayer();
        if (currentPlayer && this.game.state === 'betting') {
            output += `[${currentPlayer.name} Command:]\n`;
        } else {
            output += '[Command:]\n';
        }

        // 根据游戏状态显示不同的命令
        switch (this.game.state) {
            case 'waiting':
                output += '001.创建游戏\n';
                output += '000.Exit-[强制退出]\n';
                break;
            case 'betting':
                const currentBet = this.game.currentBet;
                const playerCurrentBet = currentPlayer ? currentPlayer.currentBet : 0;
                
                output += '011.Bet-[下注]\n';
                
                // 跟注命令：当前有下注且玩家需要跟注时可用
                if (currentBet > playerCurrentBet) {
                    output += '012.Call-[跟注]\n';
                }
                
                output += '013.Raise-[加注]\n';
                output += '014.All-in-[全下]\n';
                
                // 过牌命令：当前无下注或玩家已跟注到当前下注额时可用
                if (currentBet === playerCurrentBet) {
                    output += '015.Check-[过牌]\n';
                }
                
                output += '016.Fold-[弃牌]\n';
                output += '000.Exit-[强制退出]\n';
                break;
            case 'showdown':
            case 'finished':
                output += '091.Next-[继续下一轮游戏]\n';
                output += '099.EndGame-[结束当前游戏]\n';
                output += '000.Exit-[强制退出]\n';
                break;
            default:
                output += '000.Exit-[强制退出]\n';
        }

        output += this.createSeparator();
        output += '$: ';
        return output;
    }

    /**
     * 渲染完整页面
     * 按顺序调用各区域渲染方法
     */
    renderAll() {
        let output = '';
        output += this.renderDataRegion();
        output += '\n';
        output += this.renderPublicRegion();
        output += '\n';
        output += this.renderPrivateRegion();
        output += '\n';
        output += this.renderSettlementRegion();
        output += '\n';
        output += this.renderCommandRegion();
        return output;
    }

    /**
     * 创建分隔线
     * @returns {string} 分隔线
     */
    createSeparator() {
        return '————————————————————————————————————————————————————————————\n';
    }
}