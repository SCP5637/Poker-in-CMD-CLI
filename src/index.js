#!/usr/bin/env node

import { Game } from './core/Game.js';
import { Player } from './core/Player.js';
import { Table } from './core/Table.js';
import { CLI } from './ui/index.js';

/**
 * 创建并启动扑克游戏
 * @param {Object} options - 游戏选项
 */
function startGame(options = {}) {
    // 默认选项
    const defaultOptions = {
        playerCount: 4,
        initialChips: 1000,
        smallBlind: 5,
        bigBlind: 10,
        playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4']
    };
    
    const gameOptions = { ...defaultOptions, ...options };
    
    // 创建牌桌
    const table = new Table({
        smallBlind: gameOptions.smallBlind,
        bigBlind: gameOptions.bigBlind
    });
    
    // 创建玩家
    const players = [];
    for (let i = 0; i < gameOptions.playerCount; i++) {
        const name = gameOptions.playerNames[i] || `Player ${i + 1}`;
        players.push(new Player(name, gameOptions.initialChips));
    }
    
    // 创建游戏
    const game = new Game(table, players);
    
    // 创建CLI
    const cli = new CLI(game, {
        welcomeMessage: `
╔═══════════════════════════════════════════════╗
║                                               ║
║   ██████╗  ██████╗ ██╗  ██╗███████╗██████╗    ║
║   ██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝██╔══██╗   ║
║   ██████╔╝██║   ██║█████╔╝ █████╗  ██████╔╝   ║
║   ██╔═══╝ ██║   ██║██╔═██╗ ██╔══╝  ██╔══██╗   ║
║   ██║     ╚██████╔╝██║  ██╗███████╗██║  ██║   ║
║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ║
║                                               ║
║   Command Line Interface                      ║
║                                               ║
╚═══════════════════════════════════════════════╝

Welcome to Poker CLI!
Type 'help' or 'h' for a list of commands.
`
    });
    
    // 开始游戏
    game.start();
    
    // 启动CLI
    cli.start();
    
    return { game, cli };
}

// 如果直接运行此文件，则启动游戏
if (import.meta.url === `file://${process.argv[1]}`) {
    startGame();
}

// 导出启动函数和主要类
export { startGame, Game, Player, Table, CLI };