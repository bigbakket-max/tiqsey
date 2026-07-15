/**
 * Utility to convert between Markdown and HTML for WYSIWYG editor compatibility.
 */

export function markdownToHtml(md: string): string {
  if (!md) return '';

  let html = md;

  // Escape HTML tags to prevent broken layout except valid markdown-rehype elements
  // But let's keep it simple

  // Replace blockquotes
  html = html.replace(/^\s*>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Replace Headings
  html = html.replace(/^\s*###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^\s*##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^\s*#\s+(.+)$/gm, '<h1>$1</h1>');

  // Link format: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Image format: ![alt](url) -> <img src="$2" alt="$1" />
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Inline formats
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Underline (Markdown doesn't have standard, usually <u>)
  html = html.replace(/<u>([^<]+)<\/u>/g, '<u>$1</u>');
  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Split into lines to parse lists and paragraphs
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        result += `</${listType}>\n`;
        inList = false;
        listType = null;
      }
      continue;
    }

    // Check lists
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
    const isOrdered = /^\d+\.\s+/.test(trimmed);

    if (isBullet || isOrdered) {
      const content = isBullet 
        ? trimmed.replace(/^[\*\-•]\s+/, '') 
        : trimmed.replace(/^\d+\.\s+/, '');

      const targetType = isBullet ? 'ul' : 'ol';

      if (inList && listType !== targetType) {
        result += `</${listType}>\n`;
        inList = false;
      }

      if (!inList) {
        inList = true;
        listType = targetType;
        result += `<${listType}>\n`;
      }

      result += `  <li>${content}</li>\n`;
    } else {
      if (inList) {
        result += `</${listType}>\n`;
        inList = false;
        listType = null;
      }

      // If it already starts with a block tag, don't wrap in <p>
      if (
        trimmed.startsWith('<h1') ||
        trimmed.startsWith('<h2') ||
        trimmed.startsWith('<h3') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<p') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<table') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<li')
      ) {
        result += trimmed + '\n';
      } else {
        result += `<p>${trimmed}</p>\n`;
      }
    }
  }

  if (inList) {
    result += `</${listType}>\n`;
  }

  // Handle tables if any markdown table exists
  // Simple table parsing can be added if needed, but Tiptap handles HTML tables perfectly

  return result;
}

export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let md = html;

  // Headings
  md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');

  // Blockquotes
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');

  // Bullet lists
  md = md.replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, listContent) => {
    return listContent.replace(/<li>(.*?)<\/li>/gi, '* $1\n') + '\n';
  });

  // Numbered lists
  md = md.replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, listContent) => {
    let index = 1;
    return listContent.replace(/<li>(.*?)<\/li>/gi, () => {
      return `${index++}. $1\n`;
    }) + '\n';
  });

  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Bold
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');

  // Italic
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');

  // Underline
  md = md.replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>');

  // Strikethrough
  md = md.replace(/<s>(.*?)<\/s>/gi, '~~$1~~');
  md = md.replace(/<del>(.*?)<\/del>/gi, '~~$1~~');

  // Code block
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  md = md.replace(/<code>(.*?)<\/code>/gi, '`$1`');

  // Paragraphs with inline styles should be preserved to retain layout formatting (fonts, spacing, indents)
  md = md.replace(/<p\s+style="([^"]*)"[^>]*>([\s\S]*?)<\/p>/gi, '<p style="$1">$2</p>\n\n');
  md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');

  // Clean up excessive whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}
