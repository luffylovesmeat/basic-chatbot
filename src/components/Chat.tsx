"use client"
import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { MarkdownRenderer } from "./MarkdownRenderer"

type Message = {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export function Chat() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { role: "user", content: input }
    setMessages((prev) => [
      ...prev,
      newMessage,
      { role: "assistant", content: "", isStreaming: true },
    ])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n\n").filter((line) => line.trim())

          for (const line of lines) {
            const message = line.replace(/^data: /, "")
            if (message === "[DONE]") {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.isStreaming ? { ...msg, isStreaming: false } : msg
                )
              )
              return
            }

            try {
              const parsed = JSON.parse(message)
              assistantMessage += parsed
              setMessages((prev) =>
                prev.map((msg, index) =>
                  index === prev.length - 1
                    ? {
                        ...msg,
                        content: assistantMessage,
                      }
                    : msg
                )
              )
            } catch (error) {
              console.error("Error parsing message:", error)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      })
      setMessages((prev) => prev.filter((msg) => !msg.isStreaming))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto chat-height mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 items-start",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src="/deepseek-logo.png" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-lg p-4 whitespace-pre-wrap relative",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                message.isStreaming ? "pr-8" : ""
              )}
            >
              {message.role === "assistant" ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                message.content
              )}
              {message.isStreaming && (
                <span className="absolute right-2 bottom-2">
                  <span className="animate-pulse">...</span>
                </span>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </Card>
  )
}
