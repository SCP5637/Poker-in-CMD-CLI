#!/usr/bin/env node

import { CLI } from './src/interface/CLI.js';

/**
 * 德州扑克命令行版入口文件
 */
console.log('欢迎使用德州扑克命令行版！');
console.log('正在启动游戏...');

try {
    // 创建CLI实例并启动
    const cli = new CLI();
    cli.start().catch(error => {
        console.error('游戏运行出错:', error);
        process.exit(1);
    });
} catch (error) {
    console.error('游戏启动失败:', error);
    process.exit(1);
}