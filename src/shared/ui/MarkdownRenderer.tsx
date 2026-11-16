'use client';

import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/shared/lib/cn';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-8 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-8 mb-3.5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-7 mb-3 first:mt-0 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base sm:text-lg font-semibold text-zinc-100 mt-5 mb-2.5 first:mt-0 leading-snug">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-base sm:text-[17px] text-zinc-300 leading-[1.75] my-3.5 first:mt-0 last:mb-0">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-4 pl-6 list-disc space-y-2 text-base sm:text-[17px] text-zinc-300 leading-[1.7] marker:text-zinc-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 pl-6 list-decimal space-y-2.5 text-base sm:text-[17px] text-zinc-300 leading-[1.7] marker:text-zinc-400 marker:font-mono">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 [&>p]:my-1.5 [&>ul]:my-2 [&>ol]:my-2">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-xl border-l-2 border-brand-400 bg-zinc-900/60 px-4 py-3 text-zinc-200 [&>p]:my-1.5 [&>p]:text-zinc-200">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-7 border-zinc-800/80" />,
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-800/90 bg-zinc-900/80 p-4 text-sm font-mono text-emerald-300 leading-relaxed [&_code]:bg-transparent [&_code]:border-0 [&_code]:p-0 [&_code]:text-inherit [&_code]:text-sm [&_code]:rounded-none [&_code]:whitespace-pre-wrap [&_code]:break-words">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-zinc-800/80 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.88em] text-brand-300 break-words">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-5 w-full overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-900/30">
      <table className="w-full border-collapse text-left text-sm sm:text-[15px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-900/80 border-b border-zinc-800">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3.5 py-2.5 font-semibold text-white whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3.5 py-2.5 text-zinc-300 border-t border-zinc-800/60 align-top leading-relaxed">
      {children}
    </td>
  ),
  a: ({ href, children }) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-brand-400 hover:text-brand-300 underline underline-offset-4 break-words"
      >
        {children}
      </a>
    );
  },
};

const extractBraceGroup = (str: string, startIdx: number): { content: string; nextIdx: number } | null => {
  if (str[startIdx] !== '{') return null;
  let depth = 0;
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return { content: str.slice(startIdx + 1, i), nextIdx: i + 1 };
      }
    }
  }
  return null;
};

const replaceFracExpressions = (input: string): string => {
  let result = input;
  let guard = 0;
  while (result.includes('\\frac{') && guard < 10) {
    guard++;
    const idx = result.indexOf('\\frac{');
    const num = extractBraceGroup(result, idx + 5);
    if (!num) break;
    const den = extractBraceGroup(result, num.nextIdx);
    if (!den) break;
    result = `${result.slice(0, idx)}${num.content} / ${den.content}${result.slice(den.nextIdx)}`;
  }
  return result;
};

const replaceTextWrappers = (input: string): string => {
  let result = input;
  let guard = 0;
  while (result.includes('\\text{') && guard < 20) {
    guard++;
    const idx = result.indexOf('\\text{');
    const grp = extractBraceGroup(result, idx + 5);
    if (!grp) break;
    result = `${result.slice(0, idx)}${grp.content}${result.slice(grp.nextIdx)}`;
  }
  return result;
};

export const formatDisplayMathExpression = (rawExpr: string): string => {
  let expr = rawExpr.trim();
  expr = replaceTextWrappers(expr);
  expr = replaceFracExpressions(expr);
  expr = expr
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑($1..$2)')
    .replace(/_\{([^}]+)\}/g, '_$1')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\ln/g, 'ln')
    .replace(/\\approx/g, '≈')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return expr;
};

const preprocessMarkdown = (rawMarkdown: string): string => {
  const withDisplayMath = rawMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, inner: string) => {
    const formatted = formatDisplayMathExpression(inner);
    return `\n\`\`\`\n${formatted}\n\`\`\`\n`;
  });

  return withDisplayMath.replace(/\$([^$\n]{1,60})\$/g, (full, inner: string) => {
    const trimmed = inner.trim();
    if (!trimmed || /^\d/.test(trimmed)) return full;
    if (!/[\\_{}^]/.test(trimmed)) return full;
    return `\`${formatDisplayMathExpression(trimmed)}\``;
  });
};

export const MarkdownRenderer = ({
  content,
  className,
}: MarkdownRendererProps): React.JSX.Element => {
  const preparedContent = preprocessMarkdown(content);

  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {preparedContent}
      </ReactMarkdown>
    </div>
  );
};
