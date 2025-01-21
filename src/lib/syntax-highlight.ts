import Prism from "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-python"
import "prismjs/components/prism-json"
import "prismjs/components/prism-bash"

// Add more languages as needed
export const highlightCode = (code: string, language: string) => {
  const validLanguage = Prism.languages[language] ? language : "plaintext"
  return Prism.highlight(code, Prism.languages[validLanguage], validLanguage)
}
