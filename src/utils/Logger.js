/**
 * 日志记录器
 * 用于记录游戏过程中的输入和输出
 */
import { appendFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class Logger {
    static logFile = join(process.cwd(), 'text', 'latest.log');
    
    /**
     * 记录用户输入
     * @param {string} input - 用户输入
     */
    static logInput(input) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] INPUT: ${input}\n`;
        appendFileSync(this.logFile, logEntry);
    }
    
    /**
     * 记录游戏输出
     * @param {string} output - 游戏输出
     */
    static logOutput(output) {
        const logEntry = `[OUTPUT]:
${output}


`;
        appendFileSync(this.logFile, logEntry);
    }
    
    /**
     * 清除日志文件
     */
    static clearLog() {
        writeFileSync(this.logFile, '');
    }
    
    /**
     * 记录普通日志
     * @param {string} message - 日志消息
     */
    static log(message) {
        console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * 记录错误日志
     * @param {string} message - 错误消息
     */
    static error(message) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * 记录信息日志
     * @param {string} message - 信息消息
     */
    static info(message) {
        console.info(`[INFO] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * 记录调试日志
     * @param {string} message - 调试消息
     */
    static debug(message) {
        if (process.env.DEBUG) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
        }
    }

    /**
     * 记录警告日志
     * @param {string} message - 警告消息
     */
    static warn(message) {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
}