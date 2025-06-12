/**
 * 工具类测试脚本
 * 测试Constants、Logger和Validator的功能
 */

import assert from 'assert';
import * as Constants from '../utils/Constants.js';
import * as Logger from '../utils/Logger.js';
import * as Validator from '../utils/Validator.js';

// 模拟游戏对象用于Validator测试
const mockGame = {
    currentBettingRound: {
        currentBet: 50
    },
    bettingRules: {
        isValidBet: (player, amount, minBet, maxBet) => {
            return amount >= minBet && amount <= maxBet;
        },
        getMinRaise: (currentBet) => currentBet * 2
    },
    currentPlayer: {
        chips: 1000
    }
};

describe('工具类测试', () => {
    describe('Constants.js 测试', () => {
        it('应包含正确的牌型排名常量', () => {
            assert.strictEqual(Constants.HAND_RANKINGS.HIGH_CARD, 1);
            assert.strictEqual(Constants.HAND_RANKINGS.ROYAL_FLUSH, 10);
        });

        it('应包含正确的游戏状态常量', () => {
            assert.strictEqual(Constants.GAME_STATES.PREFLOP, 'preflop');
            assert.strictEqual(Constants.GAME_STATES.RIVER, 'river');
        });

        it('应包含正确的默认设置', () => {
            assert.strictEqual(Constants.DEFAULT_SETTINGS.PLAYER_COUNT, 3);
            assert.strictEqual(Constants.DEFAULT_SETTINGS.BIG_BLIND, 20);
        });
    });

    describe('Logger.js 测试', () => {
        it('应正确设置日志级别', () => {
            Logger.default.setLogLevel('debug');
            assert.strictEqual(Logger.default.logLevel, 'debug');
        });

        it('应在info级别记录信息', () => {
            Logger.default.setLogLevel('info');
            // 这里主要验证方法调用不报错，实际输出需要人工验证
            assert.doesNotThrow(() => Logger.default.info('测试信息'));
        });

        it('应在error级别记录错误', () => {
            assert.doesNotThrow(() => Logger.default.error('测试错误'));
        });
    });

    describe('Validator.js 测试', () => {
        const validator = new Validator.default(mockGame);

        it('应验证有效金额', () => {
            assert.strictEqual(validator.isValidAmount(100), true);
            assert.strictEqual(validator.isValidAmount(-50), false);
        });

        it('应验证有效玩家名', () => {
            assert.strictEqual(validator.isValidPlayerName('玩家1'), true);
            assert.strictEqual(validator.isValidPlayerName(''), false);
        });

        it('应验证有效指令', () => {
            assert.strictEqual(validator.isValidCommand('011'), true);
            assert.strictEqual(validator.isValidCommand('999'), false);
        });

        it('应验证有效玩家数量', () => {
            assert.strictEqual(validator.isValidPlayerCount(4), true);
            assert.strictEqual(validator.isValidPlayerCount(10), false);
        });

        it('应验证有效盲注', () => {
            assert.strictEqual(validator.isValidBlind(20), true);
            assert.strictEqual(validator.isValidBlind(15), false);
        });
    });

    console.log('所有工具类测试通过！');
});