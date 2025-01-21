import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import "highlight.js/styles/github-dark.css"
import { type Components } from "react-markdown"

type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
  node?: unknown
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "")

  return !inline && match ? (
    <code className={`${className} block rounded-md`} {...props}>
      {children}
    </code>
  ) : (
    <code className="bg-muted px-1.5 py-0.5 rounded-sm" {...props}>
      {children}
    </code>
  )
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      // className="prose dark:prose-invert max-w-none prose-p:my-0 prose-ul:my-0.5 prose-ol:my-0.5 prose-headings:my-1 prose-blockquote:my-0.5 prose-pre:my-0.5 prose-table:my-0.5 prose-hr:my-1"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeHighlight,
        [
          rehypeSanitize,
          {
            attributes: {
              "*": ["className", "style"],
              code: ["className"],
              span: ["className"],
            },
          },
        ],
      ]}
      components={
        {
          code: CodeBlock,
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="w-full" />
            </div>
          ),
        } as Components
      }
    >
      {content}
    </ReactMarkdown>
  )
}
