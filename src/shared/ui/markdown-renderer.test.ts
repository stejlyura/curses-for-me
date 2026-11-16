import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownRenderer } from './MarkdownRenderer';

test('MarkdownRenderer converts headings, lists, code, blockquotes, and GFM tables into semantic HTML', () => {
  const sample = `### Заголовок раздела

Обычный **жирный** и *курсив* с \`inlineCode\`.

#### Подраздел

1. Первый пункт
2. Второй пункт

> Цитата с вопросом

\`\`\`
LTV = ARPU / Churn
\`\`\`

| Параметр | Значение |
| :--- | :--- |
| CAC | $50 |`;

  const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: sample }));

  assert.match(html, /<h3[^>]*>Заголовок раздела<\/h3>/);
  assert.match(html, /<h4[^>]*>Подраздел<\/h4>/);
  assert.match(html, /<strong[^>]*>жирный<\/strong>/);
  assert.match(html, /<em[^>]*>курсив<\/em>/);
  assert.match(html, /<code[^>]*>inlineCode<\/code>/);
  assert.match(html, /<ol[^>]*>[\s\S]*?<li[^>]*>Первый пункт<\/li>[\s\S]*?<\/ol>/);
  assert.match(html, /<blockquote[^>]*>[\s\S]*?Цитата с вопросом[\s\S]*?<\/blockquote>/);
  assert.match(html, /<pre[^>]*><code[^>]*>LTV = ARPU \/ Churn/);
  assert.match(html, /<table[^>]*>[\s\S]*?<th[^>]*>Параметр<\/th>[\s\S]*?<td[^>]*>\$50<\/td>[\s\S]*?<\/table>/);
  assert.doesNotMatch(html, /###|####|\*\*жирный\*\*/);
});

test('MarkdownRenderer formats display math $$...$$ into clean readable formula blocks', () => {
  const mathSample =
    '$$\n\\text{LTV}(t) = \\frac{\\sum_{i=0}^{t} (\\text{Revenue}_i - \\text{COGS}_i)}{\\text{Initial Cohort Size}}\n$$';
  const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: mathSample }));

  assert.match(html, /<pre[^>]*><code[^>]*>LTV\(t\) = ∑\(i=0\.\.t\) \(Revenue_i - COGS_i\) \/ Initial Cohort Size/);
  assert.doesNotMatch(html, /\$\$|\\text|\\frac|\\sum/);

  const inlineSample = 'За $LTV_{30}$ и $\\alpha$, при цене $100 и $200.';
  const inlineHtml = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: inlineSample }));
  assert.match(inlineHtml, /<code[^>]*>LTV_30<\/code>/);
  assert.match(inlineHtml, /<code[^>]*>α<\/code>/);
  assert.match(inlineHtml, /\$100 и \$200/);
});
