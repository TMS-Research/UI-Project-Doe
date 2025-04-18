import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StudyBuddyProps {
  className?: string;
}

export function StudyBuddy({ className }: StudyBuddyProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input } as Message;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src="/study-buddy-avatar.png"
              alt="Study Buddy"
            />
            <AvatarFallback>🤖</AvatarFallback>
          </Avatar>
          Study Buddy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn("flex gap-2", message.role === "assistant" && "flex-row-reverse")}
              >
                <Avatar>
                  <AvatarImage
                    src={message.role === "assistant" ? "/study-buddy-avatar.png" : "/user-avatar.png"}
                    alt={message.role === "assistant" ? "Study Buddy" : "User"}
                  />
                  <AvatarFallback>{message.role === "assistant" ? "🤖" : "👤"}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
