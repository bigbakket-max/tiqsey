/**
 * Safe HTML sanitizer for rich-text previews and AI-generated blog markup.
 * Removes executable tags, inline event handlers, and unsafe URL schemes.
 */
const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'applet',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
  'meta',
  'link',
  'base',
  'noscript',
]);

function isSafeUrlAttribute(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('#') || (trimmed.startsWith('/') && !trimmed.startsWith('//'))) {
    return true;
  }
  return /^(https?:|mailto:|tel:|data:image\/(png|jpeg|jpg|webp|avif|gif);base64,)/i.test(trimmed);
}

export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return dirtyHtml
      .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html)[^"']*\2/gi, '$1="#"');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirtyHtml, 'text/html');

    const sanitizeNode = (node: Element) => {
      const children = Array.from(node.children);
      for (const child of children) {
        const tag = child.tagName.toLowerCase();
        if (BLOCKED_TAGS.has(tag)) {
          child.remove();
          continue;
        }

        const attrs = Array.from(child.attributes);
        for (const attr of attrs) {
          const name = attr.name.toLowerCase();
          if (name.startsWith('on') || name === 'srcdoc' || name === 'formaction') {
            child.removeAttribute(attr.name);
            continue;
          }
          if ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'poster') && !isSafeUrlAttribute(attr.value)) {
            child.removeAttribute(attr.name);
            continue;
          }
          if (name === 'style' && /expression\s*\(|javascript:|url\s*\(\s*['"]?\s*javascript:/i.test(attr.value)) {
            child.removeAttribute(attr.name);
          }
        }

        if (tag === 'a' && child.getAttribute('target') === '_blank') {
          child.setAttribute('rel', 'noopener noreferrer');
        }

        sanitizeNode(child);
      }
    };

    sanitizeNode(doc.body);
    return doc.body.innerHTML;
  } catch {
    return '';
  }
}
