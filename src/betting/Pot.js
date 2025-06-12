/**
 * 底池类
 * 管理游戏中的底池，包括主池和边池
 */
export class Pot {
    /**
     * 创建一个新的底池
     */
    constructor() {
        this.mainPot = 0;           // 主池金额
        this.sidePots = [];         // 边池列表
        this.playerContributions = new Map(); // 记录每个玩家对底池的贡献
    }

    /**
     * 添加下注到底池
     * @param {Player} player - 下注的玩家
     * @param {number} amount - 下注金额
     */
    addBet(player, amount) {
        // 更新玩家对底池的贡献
        const currentContribution = this.playerContributions.get(player) || 0;
        this.playerContributions.set(player, currentContribution + amount);
        
        // 增加主池金额
        this.mainPot += amount;
    }

    /**
     * 创建边池
     * 当一个玩家全下时，需要创建边池
     * @param {Player} allInPlayer - 全下的玩家
     * @returns {Object} 创建的边池信息
     */
    createSidePot(allInPlayer) {
        const allInAmount = this.playerContributions.get(allInPlayer) || 0;
        
        // 如果玩家没有贡献，不需要创建边池
        if (allInAmount === 0) {
            return null;
        }

        let sidePotAmount = 0;
        let mainPotAmount = 0;
        const eligiblePlayers = new Set();

        // 计算边池金额和主池金额
        for (const [player, contribution] of this.playerContributions.entries()) {
            if (contribution > allInAmount) {
                // 超过全下玩家贡献的部分进入边池
                sidePotAmount += (contribution - allInAmount);
                // 更新玩家贡献
                this.playerContributions.set(player, allInAmount);
                // 这个玩家有资格参与边池
                eligiblePlayers.add(player);
            }
            // 所有玩家的贡献（最多到全下金额）进入主池
            mainPotAmount += Math.min(contribution, allInAmount);
        }

        // 更新主池金额
        this.mainPot = mainPotAmount;

        // 创建新的边池
        if (sidePotAmount > 0) {
            const sidePot = {
                amount: sidePotAmount,
                eligiblePlayers: Array.from(eligiblePlayers)
            };
            this.sidePots.push(sidePot);
            return sidePot;
        }

        return null;
    }

    /**
     * 获取总底池金额
     * @returns {number} 总底池金额（主池+所有边池）
     */
    getTotalAmount() {
        let total = this.mainPot;
        for (const sidePot of this.sidePots) {
            total += sidePot.amount;
        }
        return total;
    }

    /**
     * 分配底池给赢家
     * @param {Array<Object>} winners - 赢家列表，每个对象包含玩家和牌型排名
     * @returns {Array<Object>} 分配结果，每个对象包含玩家和赢得的金额
     */
    distributePot(winners) {
        const results = [];

        // 首先处理边池，从最后创建的开始
        for (let i = this.sidePots.length - 1; i >= 0; i--) {
            const sidePot = this.sidePots[i];
            const eligibleWinners = winners.filter(w => 
                sidePot.eligiblePlayers.includes(w.player));
            
            if (eligibleWinners.length > 0) {
                this.distributeToWinners(eligibleWinners, sidePot.amount, results);
            }
        }

        // 然后处理主池
        this.distributeToWinners(winners, this.mainPot, results);

        // 重置底池
        this.reset();

        return results;
    }

    /**
     * 将指定金额分配给赢家
     * @param {Array<Object>} winners - 赢家列表
     * @param {number} amount - 要分配的金额
     * @param {Array<Object>} results - 分配结果
     */
    distributeToWinners(winners, amount, results) {
        if (winners.length === 0 || amount === 0) {
            return;
        }

        // 找出最高牌型排名
        const highestRank = Math.max(...winners.map(w => w.rank));
        
        // 筛选出拥有最高牌型的赢家
        const highestWinners = winners.filter(w => w.rank === highestRank);
        
        // 计算每个赢家应得的金额
        const amountPerWinner = Math.floor(amount / highestWinners.length);
        const remainder = amount % highestWinners.length;
        
        // 分配给每个赢家
        for (let i = 0; i < highestWinners.length; i++) {
            const winner = highestWinners[i];
            let winAmount = amountPerWinner;
            
            // 处理余数（分给第一个赢家）
            if (i === 0) {
                winAmount += remainder;
            }
            
            // 更新赢家的筹码
            winner.player.addChips(winAmount);
            
            // 记录分配结果
            const existingResult = results.find(r => r.player === winner.player);
            if (existingResult) {
                existingResult.amount += winAmount;
            } else {
                results.push({
                    player: winner.player,
                    amount: winAmount
                });
            }
        }
    }

    /**
     * 重置底池
     */
    reset() {
        this.mainPot = 0;
        this.sidePots = [];
        this.playerContributions.clear();
    }

    /**
     * 获取玩家对底池的贡献
     * @param {Player} player - 玩家
     * @returns {number} 玩家的贡献金额
     */
    getPlayerContribution(player) {
        return this.playerContributions.get(player) || 0;
    }

    /**
     * 获取所有边池
     * @returns {Array<Object>} 边池列表
     */
    getSidePots() {
        return this.sidePots;
    }

    /**
     * 获取主池金额
     * @returns {number} 主池金额
     */
    getMainPot() {
        return this.mainPot;
    }
}