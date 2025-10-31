import { Display } from '../interface/Display.js';
import { Game } from '../core/Game.js';
import { Table } from '../core/Table.js';
import { Player } from '../core/Player.js';
import { Card } from '../core/Card.js';

/**
 * 测试第7阶段：界面系统
 * 测试Display.js的渲染功能
 */
function testInterfaceSystem() {
    console.log('===== 测试第7阶段：界面系统 =====');
    
    // 创建游戏实例
    const table = new Table(10, 20);
    const game = new Game(table);
    
    // 添加玩家
    const player1 = new Player('玩家1', 1000, 0);
    const player2 = new Player('玩家2', 1000, 1);
    const player3 = new Player('玩家3', 1000, 2);
    
    table.addPlayer(player1, 0);
    table.addPlayer(player2, 1);
    table.addPlayer(player3, 2);
    
    // 发手牌
    player1.dealHoleCards([new Card('A', '♠'), new Card('K', '♠')]);
    player2.dealHoleCards([new Card('Q', '♥'), new Card('J', '♥')]);
    player3.dealHoleCards([new Card('10', '♦'), new Card('9', '♦')]);
    
    // 发公共牌
    table.communityCards = [
        new Card('A', '♥'),
        new Card('K', '♥'),
        new Card('Q', '♦'),
        new Card('J', '♦'),
        new Card('10', '♣')
    ];
    
    // 创建显示管理器
    const display = new Display(game);
    
    console.log('\n--- 测试数据区域渲染 ---');
    console.log(display.renderDataRegion());
    
    console.log('\n--- 测试公共展示区域渲染 ---');
    console.log(display.renderPublicRegion());
    
    console.log('\n--- 测试私人展示区域渲染 ---');
    console.log(display.renderPrivateRegion());
    
    console.log('\n--- 测试结算页面渲染 ---');
    console.log(display.renderSettlementRegion());
    
    console.log('\n--- 测试命令区域渲染 ---');
    console.log(display.renderCommandRegion());
    
    console.log('\n--- 测试完整页面渲染 ---');
    console.log(display.renderAll());
    
    console.log('\n界面系统测试完成');
}

// 运行测试
testInterfaceSystem();