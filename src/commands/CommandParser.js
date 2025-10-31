/**
 * 命令解析器
 * 将用户输入解析为命令对象
 */
export class CommandParser {
    /**
     * 创建命令解析器
     */
    constructor() {
    }

    /**
     * 解析用户输入
     * @param {string} input - 用户输入的命令字符串
     * @returns {Object|null} 解析后的命令对象，如果解析失败返回null
     */
    parse(input) {
        if (!input || typeof input !== 'string') {
            return null;
        }

        // 去除首尾空格并转换为大写
        input = input.trim();

        // 验证命令格式（3位数字）
        if (!this.isValidCommandFormat(input)) {
            return null;
        }

        // 提取命令代码
        const commandCode = input.substring(0, 3);

        // 创建命令对象
        const command = {
            code: commandCode,
            name: this.getCommandName(commandCode),
            description: this.getCommandDescription(commandCode),
            args: this.parseArguments(input.substring(3).trim())
        };

        return command;
    }

    /**
     * 验证命令格式是否有效
     * @param {string} input - 输入字符串
     * @returns {boolean} 如果格式有效返回true，否则返回false
     */
    isValidCommandFormat(input) {
        // 检查是否以3位数字开头
        return /^\d{3}/.test(input);
    }

    /**
     * 根据命令代码获取命令名称
     * @param {string} code - 命令代码
     * @returns {string} 命令名称
     */
    getCommandName(code) {
        const commandMap = {
            '000': 'Exit',
            '001': 'CreateGame',
            '011': 'Bet',
            '012': 'Call',
            '013': 'Raise',
            '014': 'AllIn',
            '015': 'Check',
            '016': 'Fold',
            '091': 'Next',
            '092': 'PlayerNameSetting',
            '093': 'StartChips',
            '094': 'BigBlindSetting',
            '099': 'Quit'
        };

        return commandMap[code] || 'Unknown';
    }

    /**
     * 根据命令代码获取命令描述
     * @param {string} code - 命令代码
     * @returns {string} 命令描述
     */
    getCommandDescription(code) {
        const descriptionMap = {
            '000': '退出游戏',
            '001': '创建游戏',
            '011': '下注',
            '012': '跟注',
            '013': '加注',
            '014': '全押',
            '015': '过牌',
            '016': '弃牌',
            '091': '下一局',
            '092': '设置玩家名称',
            '093': '设置初始筹码',
            '094': '设置大盲注',
            '099': '退出当前游戏'
        };

        return descriptionMap[code] || '未知命令';
    }

    /**
     * 解析命令参数
     * @param {string} argsString - 参数字符串
     * @returns {Array} 参数数组
     */
    parseArguments(argsString) {
        if (!argsString) {
            return [];
        }

        // 简单的参数解析，按空格分割
        return argsString.split(/\s+/).filter(arg => arg.length > 0);
    }

    /**
     * 验证命令是否有效
     * @param {Object} command - 命令对象
     * @returns {boolean} 如果命令有效返回true，否则返回false
     */
    validateCommand(command) {
        if (!command || !command.code) {
            return false;
        }

        // 检查是否为有效的3位数字命令
        return /^\d{3}$/.test(command.code);
    }
}