# Poker-in-CMD-CLI 项目设计文档

## 项目概述
这是一个基于命令行界面的德州扑克游戏实现，使用JavaScript语言开发，可以在命令行或浏览器控制台中运行。

## 目录结构
```
src/
├── core/                   # 核心游戏逻辑
│   ├── Game.js            # 游戏主控制器
│   ├── Player.js          # 玩家类
│   ├── Deck.js            # 扑克牌组类
│   ├── Card.js            # 扑克牌类
│   └── Table.js           # 牌桌类
│
├── poker/                  # 扑克牌相关逻辑
│   ├── HandEvaluator.js   # 牌型判定器
│   ├── HandRanking.js     # 牌型排名定义
│   └── Combinations.js    # 牌型组合计算
│
├── betting/               # 下注系统
│   ├── BettingRound.js   # 下注轮次管理
│   ├── Pot.js            # 奖池管理
│   └── BettingRules.js   # 下注规则
│
├── commands/              # 命令系统
│   ├── CommandParser.js  # 命令解析器
│   ├── CommandExecutor.js # 命令执行器
│   ├── BetCommand.js
│   ├── CallCommand.js
│   ├── RaiseCommand.js
│   ├── FoldCommand.js
│   └── CheckCommand.js
│
├── utils/                # 工具类
│   ├── Logger.js        # 日志工具
│   ├── Validator.js     # 输入验证
│   └── Constants.js     # 常量定义
│
└── interface/           # 界面相关
    ├── CLI.js          # 命令行接口
    └── Display.js      # 显示管理器
```

## 核心类设计

### Game 类
- 管理游戏整体流程
- 控制游戏状态
- 协调各个组件

### Player 类
- 玩家信息管理
- 筹码管理
- 手牌管理

### Table 类
- 管理牌桌状态
- 追踪玩家位置
- 处理公共牌

### Deck 类
- 扑克牌组管理
- 洗牌功能
- 发牌功能

### HandEvaluator 类
- 牌型判定
- 牌力比较
- 最佳牌型计算

### BettingRound 类
- 下注轮次管理
- 下注顺序控制
- 下注规则实施

## 游戏流程

1. 游戏初始化
   - 创建牌桌
   - 玩家入座
   - 设置盲注

2. 回合流程
   - 发手牌
   - 翻牌前下注轮
   - 发翻牌
   - 翻牌圈下注轮
   - 发转牌
   - 转牌圈下注轮
   - 发河牌
   - 河牌圈下注轮
   - 摊牌比较
   - 分配奖池

3. 命令系统
   - bet: 下注
   - call: 跟注
   - raise: 加注
   - fold: 弃牌
   - check: 过牌
   - all-in: 全下

## 技术实现

### 命令行交互
- 使用Node.js的readline模块处理用户输入
- 实现命令解析和执行系统
- 提供清晰的游戏状态显示

### 牌型判定
- 实现所有德州扑克牌型的判定逻辑
- 支持多人牌型比较
- 处理同等牌型的大小比较

### 下注系统
- 支持多人下注
- 处理边池情况
- 实现各种下注规则

## 扩展性考虑

1. 支持不同的游戏变体
2. 可配置的游戏规则
3. 支持AI玩家
4. 网络对战功能
5. 数据统计和分析

## 后续优化方向

1. 性能优化
   - 牌型判定算法优化
   - 内存使用优化

2. 用户体验
   - 更友好的界面
   - 更详细的提示信息
   - 游戏回放功能

3. 功能扩展
   - 保存/加载游戏
   - 玩家数据统计
   - 排行榜系统