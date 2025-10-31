import { CLI } from '../interface/CLI.js';
import { CommandParser } from '../commands/CommandParser.js';
import { CommandExecutor } from '../commands/CommandExecutor.js';

/**
 * 测试界面系统和命令系统
 * 对应项目规划的第6阶段和第7阶段
 */
function testInterfaceAndCommands() {
    console.log('===== 测试界面系统和命令系统 =====');
    
    // 测试命令解析器
    console.log('\n--- 测试命令解析器 ---');
    const parser = new CommandParser();
    
    const testCommands = ['001', '011 100', '012', '016', '000'];
    testCommands.forEach(cmd => {
        const parsed = parser.parse(cmd);
        console.log(`解析命令 "${cmd}":`, parsed);
    });
    
    // 测试命令执行器
    console.log('\n--- 测试命令执行器 ---');
    const executor = new CommandExecutor();
    
    // 测试简单命令执行
    const simpleCommands = [
        { code: '001', name: 'CreateGame', description: '创建游戏' },
        { code: '012', name: 'Call', description: '跟注' },
        { code: '016', name: 'Fold', description: '弃牌' }
    ];
    
    simpleCommands.forEach(cmd => {
        const result = executor.execute(cmd, null);
        console.log(`执行命令 "${cmd.name}":`, result);
    });
    
    console.log('\n界面系统和命令系统测试完成');
}

// 运行测试
testInterfaceAndCommands();