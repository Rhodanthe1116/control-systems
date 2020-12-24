import remark from 'remark'
import html from 'remark-html'
import htmlKatex from 'remark-html-katex'

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).use(htmlKatex).process(markdown)
  return result.toString()
}
