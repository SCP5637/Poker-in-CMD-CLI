/**
 * 游戏常量定义
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
    WAITING: 'WAITING',
    PREFLOP: 'PREFLOP',
    FLOP: 'FLOP',
    TURN: 'TURN',
    RIVER: 'RIVER',
    SHOWDOWN: 'SHOWDOWN',
    FINISHED: 'FINISHED'
};

// 玩家状态
export const PLAYER_STATUS = {
    ACTIVE: 'ACTIVE',
    FOLDED: 'FOLDED',
    ALL_IN: 'ALL_IN',
    OUT: 'OUT'
};

// 命令类型
export const COMMAND_TYPES = {
    BET: '011',
    CALL: '012',
    RAISE: '013',
    ALL_IN: '014',
    CHECK: '015',
    FOLD: '016',
    PLAYER_AMOUNT: '091',
    PLAYER_NAME_SETTING: '092',
    START_CHIPS: '093',
    BIG_BLIND_SETTING: '094',
    END_GAME: '099',
    EXIT: '000'
};

// 默认设置
export const DEFAULT_SETTINGS = {
    PLAYER_COUNT: 3,
    INITIAL_CHIPS: 1000,
    BIG_BLIND: 20,
    SMALL_BLIND: 10
};

// 错误消息
export const ERROR_MESSAGES = {
    INVALID_AMOUNT: '无效的金额',
    INVALID_COMMAND: '无效的命令',
    INVALID_PLAYER_COUNT: '玩家数量必须在2-8之间',
    INVALID_BLIND: '盲注必须是100以内的偶数',
    INVALID_PLAYER_NAME: '玩家名称必须在2-16个字符之间'
};