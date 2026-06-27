import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

let md: MarkdownIt

export function useMarkdown() {
  if (!md) {
    md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      highlight(str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="language-${lang}"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
          } catch { /* fallthrough */ }
        }
        return `<pre class="language-${lang || 'none'}"><code>${md!.utils.escapeHtml(str)}</code></pre>`
      },
    })
  }

  function render(content: string): string {
    return md.render(content)
  }

  function extractExcerpt(content: string, maxLen = 200): string {
    const plain = md.render(content).replace(/<[^>]+>/g, '')
    return plain.length > maxLen ? plain.slice(0, maxLen).replace(/\s+\S*$/, '') + '…' : plain
  }

  function estimateReadingTime(content: string): number {
    const text = content.replace(/[#*`\[\]()>|~_\-]/g, ' ')
    const wpm = 200
    return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / wpm))
  }

  return { render, extractExcerpt, estimateReadingTime }
}
