import { auth } from "@/auth"
import { Chat } from "@/components/Chat"
import { UserDropdown } from "@/components/UserDropdown"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <main className="container mx-auto h-screen p-4 flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AI Chat (DeepSeek)</h1>
        {session?.user ? (
          <UserDropdown user={session.user} />
        ) : (
          <Button asChild>
            <a href="/api/auth/signin">Sign In</a>
          </Button>
        )}
      </header>

      {session?.user ? (
        <Chat />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">
            Please sign in to start chatting
          </p>
        </div>
      )}
    </main>
  )
}
