#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const quotesPath = path.join(__dirname, '..', 'quotes.json');
const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf-8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log(`\nCurrent quotes: ${quotes.length}\n`);

  const text = await ask('Quote text: ');
  const category = await ask('Category (engineering/mindset/ai/dx/infrastructure/distributed/opensource/automation/life): ');

  if (!text.trim()) {
    console.log('Error: Quote text cannot be empty.');
    rl.close();
    process.exit(1);
  }

  quotes.push({
    text: text.trim(),
    category: category.trim() || 'general'
  });

  fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2) + '\n', 'utf-8');
  console.log(`\nAdded quote. Total quotes: ${quotes.length}`);

  rl.close();
}

main();
