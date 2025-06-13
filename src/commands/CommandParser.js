/**
 * 命令类型枚举
 * @enum {string}
 */
export const CommandType = {
    // 游戏控制命令 (000-009)
    EXIT: '000',
    CREATE_GAME: '001',
    TEST_MODE: '002',
    STATISTICS: '003',

    // 游戏设置命令 (090-099)
    SET_PLAYER_COUNT: '091',
    SET_PLAYER_NAMES: '092',
    SET_INITIAL_CHIPS: '093',
    SET_BIG_BLIND: '094',
    START_GAME: '090',
    END_GAME: '099',

    // 游戏行动命令 (010-019)
    BET: '011',
    CALL: '012',
    RAISE: '013',
    ALL_IN: '014',
    CHECK: '015',
    FOLD: '016'
};

/**
 * 命令解析器类
 * 负责解析用户输入的命令
 */
export class CommandParser {
    /**
     * 解析命令字符串
     * @param {string} input - 用户输入的命令字符串
     * @param {Object} [args={}] - 命令的附加参数
     * @returns {Object} 解析后的命令对象
     * @throws {Error} 如果命令无效
     */
    static parse(input, args = {}) {
        // 验证输入格式
        if (!/^\d{3}$/.test(input)) {
            throw new Error('Invalid command format. Command must be a three-digit number.');
        }

        // 检查命令是否存在
        const commandType = Object.values(CommandType).find(type => type === input);
        if (!commandType) {
            throw new Error(`Unknown command: ${input}`);
        }

        // 创建命令对象
        const command = {
            type: commandType,
            args: { ...args }
        };

        // 根据命令类型验证和处理参数
        switch (commandType) {
            case CommandType.BET:
            case CommandType.RAISE:
                if (typeof args.amount !== 'number' || args.amount <= 0) {
                    throw new Error('Invalid amount for bet/raise command');
                }
                break;

            case CommandType.SET_PLAYER_COUNT:
                if (typeof args.count !== 'number' || args.count < 2 || args.count > 8) {
                    throw new Error('Invalid player count (must be between 2 and 8)');
                }
                break;

            case CommandType.SET_INITIAL_CHIPS:
                if (typeof args.chips !== 'number' || args.chips < 300 || args.chips > 10000) {
                    throw new Error('Invalid initial chips amount (must be between 300 and 10000)');
                }
                break;

            case CommandType.SET_BIG_BLIND:
                if (typeof args.amount !== 'number' || args.amount <= 0 || args.amount > 100 || args.amount % 2 !== 0) {
                    throw new Error('Invalid big blind amount (must be an even number between 2 and 100)');
                }
                break;

            case CommandType.SET_PLAYER_NAMES:
                if (!Array.isArray(args.names)) {
                    throw new Error('Player names must be provided as an array');
                }
                break;
        }

        return command;
    }

    /**
     * 验证命令在当前游戏状态下是否可用
     * @param {Object} command - 命令对象
     * @param {Game} game - 当前游戏实例
     * @returns {boolean} 如果命令在当前状态下可用返回true
     */
    static isCommandAvailable(command, game) {
        if (!game) {
            // 如果没有游戏实例，只允许创建游戏和退出命令
            return [CommandType.CREATE_GAME, CommandType.EXIT].includes(command.type);
        }

        const { state } = game;
        const currentPlayer = game.getCurrentPlayer();

        switch (command.type) {
            case CommandType.BET:
            case CommandType.CALL:
            case CommandType.RAISE:
            case CommandType.ALL_IN:
            case CommandType.CHECK:
            case CommandType.FOLD:
                // 游戏行动命令只能在下注阶段由当前玩家执行
                return state === 'betting' && currentPlayer && currentPlayer.canAct();

            case CommandType.END_GAME:
                // 可以在任何时候结束游戏
                return true;

            case CommandType.EXIT:
                // 可以在任何时候退出
                return true;

            default:
                // 其他命令在游戏进行中不可用
                return state === 'waiting';
        }
    }

    /**
     * 获取命令的描述
     * @param {Object} command - 命令对象
     * @returns {string} 命令的描述
     */
    static getCommandDescription(command) {
        switch (command.type) {
            case CommandType.BET:
                return `Bet ${command.args.amount} chips`;
            case CommandType.CALL:
                return 'Call the current bet';
            case CommandType.RAISE:
                return `Raise to ${command.args.amount} chips`;
            case CommandType.ALL_IN:
                return 'Go all-in';
            case CommandType.CHECK:
                return 'Check';
            case CommandType.FOLD:
                return 'Fold';
            case CommandType.CREATE_GAME:
                return 'Create new game';
            case CommandType.END_GAME:
                return 'End current game';
            case CommandType.EXIT:
                return 'Exit application';
            default:
                return 'Unknown command';
        }
    }
}