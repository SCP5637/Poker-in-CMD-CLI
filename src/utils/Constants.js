/**
 * 游戏常量定义
 */

/**
 * 牌型排名枚举
 * @enum {number}
 */
export const HandRankings = {
    HIGH_CARD: 1,        // 高牌
    ONE_PAIR: 2,         // 一对
    TWO_PAIR: 3,         // 两对
    THREE_OF_A_KIND: 4,  // 三条
    STRAIGHT: 5,         // 顺子
    FLUSH: 6,            // 同花
    FULL_HOUSE: 7,       // 葫芦
    FOUR_OF_A_KIND: 8,   // 四条
    STRAIGHT_FLUSH: 9,   // 同花顺
    ROYAL_FLUSH: 10      // 皇家同花顺
};

/**
 * 玩家状态枚举
 * @enum {string}
 */
export const PlayerStatus = {
    ACTIVE: 'active',     // 活跃
    FOLDED: 'folded',     // 已弃牌
    ALL_IN: 'all-in',     // 全押
    OUT: 'out'            // 破产
};

/**
 * 游戏状态枚举
 * @enum {string}
 */
export const GameStates = {
    WAITING: 'waiting',   // 等待开始
    BETTING: 'betting',   // 下注中
    SHOWDOWN: 'showdown', // 摊牌
    FINISHED: 'finished'  // 已结束
};

/**
 * 命令类型枚举
 * @enum {string}
 */
export const CommandTypes = {
    GAME_CONTROL: 'game_control',     // 游戏控制命令 (000-009)
    GAME_ACTION: 'game_action',       // 游戏行动命令 (010-099)
    SETTINGS: 'settings'              // 设置命令 (090-099)
};

/**
 * 下注轮次枚举
 * @enum {string}
 */
export const BettingRounds = {
    PREFLOP: 'preflop',   // 翻牌前
    FLOP: 'flop',         // 翻牌
    TURN: 'turn',         // 转牌
    RIVER: 'river'        // 河牌
};

/**
 * 错误消息常量
 * @enum {string}
 */
export const ErrorMessages = {
    INVALID_BET: '下注金额无效',
    NOT_ENOUGH_CHIPS: '筹码不足',
    INVALID_COMMAND: '无效命令',
    NOT_YOUR_TURN: '不是你的回合',
    GAME_NOT_STARTED: '游戏尚未开始'
};