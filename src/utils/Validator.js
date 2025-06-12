/**
 * 输入验证工具
 * 验证游戏输入的有效性，包括金额、玩家名和指令
 */

const {
    COMMAND_TYPES,
    ERROR_MESSAGES,
    DEFAULT_SETTINGS
} = require('./Constants');
const Logger = require('./Logger');

class Validator {
    constructor(game) {
        this.game = game;
    }

    // 验证金额是否有效
    isValidAmount(amount) {
        if (isNaN(amount) || amount <= 0) {
            Logger.error(ERROR_MESSAGES.INVALID_AMOUNT);
            return false;
        }

        // 复用下注系统的验证逻辑
        const currentBet = this.game.currentBettingRound?.currentBet || 0;
        const minRaise = this.game.bettingRules.getMinRaise(currentBet);

        return this.game.bettingRules.isValidBet(
            this.game.currentPlayer,
            amount,
            currentBet,
            this.game.currentPlayer.chips
        );
    }

    // 验证玩家名是否有效
    isValidPlayerName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }
        return name.length >= 2 && name.length <= 16;
    }

    // 验证指令是否有效
    isValidCommand(command) {
        if (!command || command.length !== 3) {
            Logger.error(ERROR_MESSAGES.INVALID_COMMAND);
            return false;
        }

        // 检查是否为已知指令类型
        return Object.values(COMMAND_TYPES).includes(command);
    }

    // 验证玩家数量设置
    isValidPlayerCount(count) {
        const num = parseInt(count);
        if (isNaN(num) || num < 2 || num > 8) {
            Logger.error(ERROR_MESSAGES.INVALID_PLAYER_COUNT);
            return false;
        }
        return true;
    }

    // 验证盲注设置
    isValidBlind(blind) {
        const num = parseInt(blind);
        if (isNaN(num) || num <= 0 || num % 2 !== 0 || num > 100) {
            Logger.error(ERROR_MESSAGES.INVALID_BLIND);
            return false;
        }
        return true;
    }
}

module.exports = Validator;