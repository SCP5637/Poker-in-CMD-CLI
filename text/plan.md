# 实施流程规划

## 实现步骤

1. 实现基础类：Card, Deck           
————已完成功能和测试

2. 实现核心游戏逻辑：Player, Table, Game            
————已完成功能和测试

3. 实现牌型评估：HandRanking, HandEvaluator, Combinations           
————已完成功能和测试

4. 实现下注系统：BettingRules, BettingRound, Pot            
————已完成功能和测试

5. 实现工具类：
   - Constants.js - 游戏常量定义
   - Logger.js - 游戏日志记录
   - Validator.js - 输入验证
————已完成功能和测试

6. 实现命令系统：
   - CommandParser.js - 指令解析
   - CommandExecutor.js - 指令执行
   - Bet/Call/Raise/Fold/Check命令类
————待实现

7. 实现界面系统：
   - CLI.js - 命令行界面框架
   - Display.js - 页面渲染引擎
————待实现

8. 完善交互流程：
   - 指令与游戏状态同步
   - 动态页面更新
   - 输入反馈机制
————待实现

9. 集成测试和调试
————待实现

10. 优化和完善
————待实现

## 文件结构与功能实现

### 核心模块 (src/core/)

#### Card.js
- 实现扑克牌类，表示单张扑克牌
- 属性：点数(rank)、花色(suit)
- 方法：
  - `toString()`: 返回牌的字符串表示，如"A♠"
  - `getValue()`: 返回牌的数值，用于比较大小
  - `getSuit()`: 返回牌的花色
  - `getRank()`: 返回牌的点数

#### Deck.js
- 实现扑克牌组类，表示一副完整的扑克牌
- 属性：牌组(cards)
- 方法：
  - `shuffle()`: 洗牌
  - `deal(n)`: 发n张牌
  - `reset()`: 重置牌组为一副完整的扑克牌

#### Player.js
- 实现玩家类，表示游戏中的一个玩家
- 属性：
  - 名称(name)
  - 筹码(chips)
  - 手牌(holeCards)
  - 当前下注(currentBet)
  - 状态(status)：活跃、弃牌、全下等
- 方法：
  - `bet(amount)`: 下注指定金额
  - `fold()`: 弃牌
  - `check()`: 看牌
  - `call(amount)`: 跟注
  - `raise(amount)`: 加注
  - `allIn()`: 全下
  - `receiveCard(card)`: 接收一张牌
  - `getHand()`: 获取手牌
  - `clearHand()`: 清空手牌
  - `getStatus()`: 获取玩家状态
  - `setStatus(status)`: 设置玩家状态

#### Table.js
- 实现牌桌类，表示游戏的牌桌
- 属性：
  - 玩家列表(players)
  - 公共牌(communityCards)
  - 当前庄家位置(buttonPosition)
  - 小盲注位置(smallBlindPosition)
  - 大盲注位置(bigBlindPosition)
  - 当前行动玩家位置(currentPosition)
- 方法：
  - `addPlayer(player)`: 添加玩家
  - `removePlayer(player)`: 移除玩家
  - `dealCommunityCards(n)`: 发n张公共牌
  - `moveButton()`: 移动庄家按钮
  - `getNextActivePlayer(position)`: 获取下一个活跃玩家
  - `getCommunityCards()`: 获取公共牌

#### Game.js
- 实现游戏主控制器，协调整个游戏流程
- 属性：
  - 牌桌(table)
  - 牌组(deck)
  - 当前下注轮次(currentBettingRound)
  - 底池(pot)
  - 小盲注金额(smallBlind)
  - 大盲注金额(bigBlind)
  - 游戏状态(gameState)：等待开始、翻牌前、翻牌、转牌、河牌、亮牌等
- 方法：
  - `start()`: 开始游戏
  - `dealHoleCards()`: 发底牌
  - `dealFlop()`: 发翻牌
  - `dealTurn()`: 发转牌
  - `dealRiver()`: 发河牌
  - `collectBlinds()`: 收取盲注
  - `processBettingRound()`: 处理下注轮次
  - `determineWinners()`: 确定赢家
  - `distributePot()`: 分配底池
  - `nextHand()`: 进入下一手牌
  - `endGame()`: 结束游戏

### 扑克牌相关逻辑 (src/poker/)

#### HandRanking.js
- 定义扑克牌型排名
- 包含牌型枚举：高牌、一对、两对、三条、顺子、同花、葫芦、四条、同花顺、皇家同花顺
- 每种牌型的排名值

#### HandEvaluator.js
- 实现牌型判定器，用于评估玩家的最佳牌型
- 方法：
  - `evaluate(holeCards, communityCards)`: 评估玩家的最佳牌型
  - `getRank(hand)`: 获取牌型的排名
  - `compareHands(hand1, hand2)`: 比较两手牌的大小
  - 各种牌型检测方法：
    - `isRoyalFlush(cards)`
    - `isStraightFlush(cards)`
    - `isFourOfAKind(cards)`
    - `isFullHouse(cards)`
    - `isFlush(cards)`
    - `isStraight(cards)`
    - `isThreeOfAKind(cards)`
    - `isTwoPair(cards)`
    - `isOnePair(cards)`
    - `getHighCard(cards)`

#### Combinations.js
- 实现牌型组合计算
- 方法：
  - `getBestFiveCardHand(cards)`: 从多张牌中选出最佳的五张牌
  - `getAllCombinations(cards, k)`: 获取所有k张牌的组合

### 下注系统 (src/betting/)

#### BettingRules.js
- 实现下注规则
- 方法：
  - `isValidBet(player, amount, minBet, maxBet)`: 检查下注是否有效
  - `getMinRaise(currentBet, lastRaise)`: 获取最小加注金额
  - `getMaxBet(player)`: 获取最大下注金额

#### BettingRound.js
- 实现下注轮次管理
- 属性：
  - 当前下注金额(currentBet)
  - 最后加注金额(lastRaise)
  - 当前行动玩家(currentPlayer)
  - 轮次类型(roundType)：翻牌前、翻牌、转牌、河牌
- 方法：
  - `start(firstPlayer)`: 开始下注轮次
  - `processBet(player, action, amount)`: 处理玩家的下注
  - `isRoundComplete()`: 检查轮次是否完成
  - `getNextPlayer()`: 获取下一个行动玩家

#### Pot.js
- 实现奖池管理
- 属性：
  - 主池(mainPot)
  - 边池列表(sidePots)
- 方法：
  - `addBet(player, amount)`: 添加下注到底池
  - `createSidePot(allInPlayer, amount)`: 创建边池
  - `getTotalPot()`: 获取总底池金额
  - `distributePot(winners)`: 分配底池给赢家

### 命令系统 (src/commands/)

#### CommandParser.js
- 实现命令解析器，将用户输入解析为命令对象
- 方法：
  - `parse(input)`: 解析用户输入
  - `validateCommand(command)`: 验证命令是否有效

#### CommandExecutor.js
- 实现命令执行器，执行解析后的命令
- 方法：
  - `execute(command, game)`: 执行命令
  - `registerCommand(name, handler)`: 注册命令处理器

#### BetCommand.js
- 实现下注命令
- 方法：
  - `execute(game, amount)`: 执行下注命令

#### CallCommand.js
- 实现跟注命令
- 方法：
  - `execute(game)`: 执行跟注命令

#### RaiseCommand.js
- 实现加注命令
- 方法：
  - `execute(game, amount)`: 执行加注命令

#### FoldCommand.js
- 实现弃牌命令
- 方法：
  - `execute(game)`: 执行弃牌命令

#### CheckCommand.js
- 实现看牌命令
- 方法：
  - `execute(game)`: 执行看牌命令

### 工具类 (src/utils/)

#### Constants.js
- 定义游戏中使用的常量
- 包括：
  - 牌型排名
  - 玩家状态
  - 游戏状态
  - 命令类型
  - 错误消息

#### Logger.js
- 实现日志工具，用于记录游戏过程
- 方法：
  - `log(message)`: 记录普通日志
  - `error(message)`: 记录错误日志
  - `info(message)`: 记录信息日志
  - `debug(message)`: 记录调试日志

#### Validator.js
- 实现输入验证工具
- 方法：
  - `isValidAmount(amount)`: 检查金额是否有效
  - `isValidPlayerName(name)`: 检查玩家名称是否有效
  - `isValidCommand(command)`: 检查命令是否有效

### 界面相关 (src/interface/)

#### CLI.js
- 实现命令行接口
- 方法：
  - `start()`: 启动命令行界面
  - `readInput()`: 读取用户输入
  - `displayPrompt()`: 显示提示符
  - `displayGameState(game)`: 显示游戏状态
  - `displayPlayerInfo(player)`: 显示玩家信息
  - `displayCommunityCards(cards)`: 显示公共牌
  - `displayWinners(winners)`: 显示赢家信息

#### Display.js
- 实现显示管理器，负责格式化和显示游戏信息
- 方法：
  - `formatCard(card)`: 格式化扑克牌显示
  - `formatHand(hand)`: 格式化手牌显示
  - `formatChips(amount)`: 格式化筹码显示
  - `formatTable(table)`: 格式化牌桌显示
  - `formatGameState(game)`: 格式化游戏状态显示