/**
 * 游戏常量定义
 * 集中管理所有游戏常量，保持一致性
 */

// 牌型排名
export const HAND_RANKINGS = {
    HIGH_CARD: 1,
    ONE_PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_A_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_A_KIND: 8,
    STRAIGHT_FLUSH: 9,
    ROYAL_FLUSH: 10
};

// 游戏状态
export const GAME_STATES = {
    WAITING: 'waiting',
    PREFLOP: 'preflop',
    FLOP: 'flop',
    TURN: 'turn',
    RIVER: 'river',
    SHOWDOWN: 'showdown'
};

// 玩家状态
export const PLAYER_STATUS = {
    ACTIVE: 'active',
    FOLDED: 'folded',
    ALL_IN: 'all_in',
    OUT: 'out'
};

// 命令类型
export const COMMAND_TYPES = {
    // 游戏控制指令
    CREATE_GAME: '001',
    EXIT: '000',
    END_GAME: '099',

    // 游戏操作指令
    BET: '011',
    CALL: '012',
    RAISE: '013',
    ALL_IN: '014',
    CHECK: '015',
    FOLD: '016',

    // 设置指令
    SET_PLAYERS: '091',
    SET_NAMES: '092',
    SET_CHIPS: '093',
    SET_BLINDS: '094'
};

// 默认游戏设置
export const DEFAULT_SETTINGS = {
    PLAYER_COUNT: 3,
    STARTING_CHIPS: 1000,
    BIG_BLIND: 20,
    SMALL_BLIND: 10
};

// 错误消息
export const ERROR_MESSAGES = {
    INVALID_COMMAND: '无效指令',
    INVALID_AMOUNT: '无效金额',
    INVALID_PLAYER_COUNT: '玩家数量必须在2-8之间',
    INVALID_BLIND: '盲注必须为正偶数'
};
