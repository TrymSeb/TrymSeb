#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const quotesPath = path.join(__dirname, '..', 'quotes.json');
const outputPath = path.join(__dirname, '..', 'assets', 'quote.svg');

const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf-8'));
const quote = quotes[Math.floor(Math.random() * quotes.length)];

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine && currentLine) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = (currentLine + ' ' + word).trim();
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

const maxChars = 50;
const lines = wrapText(quote.text, maxChars);
const lineHeight = 28;
const padding = 40;
const textBlockHeight = lines.length * lineHeight;
const svgHeight = textBlockHeight + padding * 2 + 30;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${svgHeight}" viewBox="0 0 600 ${svgHeight}">
  <defs>
    <linearGradient id="quote-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#161b22;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="${svgHeight}" rx="12" fill="url(#quote-gradient)" />
  <text x="${padding}" y="${padding + 8}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="28" fill="#7ee787" opacity="0.6">\u201C</text>
  ${lines.map((line, i) => `<text x="${padding + 4}" y="${padding + 40 + i * lineHeight}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="18" fill="#e6edf3" font-weight="300">${escapeXml(line)}</text>`).join('\n  ')}
  <text x="${padding + 4}" y="${padding + 40 + lines.length * lineHeight + 8}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="13" fill="#7ee787" opacity="0.8">${escapeXml(quote.category)}</text>
</svg>`;

fs.writeFileSync(outputPath, svg, 'utf-8');
console.log(`Generated quote SVG: "${quote.text}" [${quote.category}]`);
