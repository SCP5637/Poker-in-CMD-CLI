import { Card, SUITS, RANKS } from './core/Card.js';
import { Deck } from './core/Deck.js';

/**
 * 测试Card和Deck类的基本功能
 */
function testCardAndDeck() {
    console.log('===== 测试Card和Deck类 =====');
    
    // 测试Card类
    console.log('\n--- 测试Card类 ---');
    const aceOfSpades = new Card(RANKS.ACE, SUITS.SPADES);
    const kingOfHearts = new Card(RANKS.KING, SUITS.HEARTS);
    
    console.log(`创建了两张牌: ${aceOfSpades.toString()} 和 ${kingOfHearts.toString()}`);
    console.log(`${aceOfSpades.toString()}的点数值: ${aceOfSpades.getValue()}`);
    console.log(`${kingOfHearts.toString()}的花色: ${kingOfHearts.getSuit()}`);
    
    // 测试Deck类
    console.log('\n--- 测试Deck类 ---');
    const deck = new Deck();
    console.log(`新牌组中有 ${deck.remainingCards()} 张牌`);
    
    // 洗牌
    deck.shuffle();
    console.log('洗牌后的前5张牌:');
    const firstFiveCards = deck.getCards().slice(0, 5);
    firstFiveCards.forEach(card => console.log(`- ${card.toString()}`));
    
    // 发牌
    console.log('\n发3张牌:');
    const dealtCards = deck.deal(3);
    dealtCards.forEach(card => console.log(`- ${card.toString()}`));
    console.log(`牌组中还剩 ${deck.remainingCards()} 张牌`);
    
    // 重置牌组
    deck.reset();
    console.log(`\n重置后，牌组中有 ${deck.remainingCards()} 张牌`);
    
    // 测试发一张牌
    const oneCard = deck.dealOne();
    console.log(`\n发了一张牌: ${oneCard.toString()}`);
    console.log(`牌组中还剩 ${deck.remainingCards()} 张牌`);
    
    // 测试将牌放回牌组
    deck.returnToDeck(oneCard);
    console.log(`\n将牌放回牌组后，牌组中有 ${deck.remainingCards()} 张牌`);
}

// 运行测试
testCardAndDeck();