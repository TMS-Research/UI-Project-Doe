import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypingEffect } from "@/components/ui/typing-effect";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  studentResources?: string[];
}

export const ChatMessage = ({ role, content, isTyping, studentResources }: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full bg-background")}>
      <div className={cn("container flex gap-4 py-4 px-4", role === "assistant" && isTyping && "animate-typing-pulse")}>
        <div className="flex-1">
          {role === "assistant" && isTyping ? (
            <div className="prose dark:prose-invert max-w-none px-2">
              {content === "Thinking..." ? (
                <div className="flex items-center gap-2 text-primary/80">
                  <span className="text-lg font-medium">Thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_infinite]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.3s_infinite]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.5s_infinite]" />
                  </div>
                </div>
              ) : (
                <TypingEffect
                  text={content}
                  className="prose dark:prose-invert max-w-none"
                  speed={10}
                />
              )}
            </div>
          ) : role === "assistant" ? (
            <div className="prose dark:prose-invert max-w-none px-2">
              <Markdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                  code: ({ children }) => {
                    const codeString = String(children).replace(/\n$/, "");

                    return <CodeComponent>{codeString}</CodeComponent>;
                  },
                }}
              >
                {content}
              </Markdown>
            </div>
          ) : (
            <Card className="p-4 border border-primary/50 bg-primary/10">
              {studentResources && studentResources.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {studentResources.map((resource, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                  <hr className="border-muted-foreground/20 mt-3 mb-2" />
                </>
              )}
              <div className="prose dark:prose-invert max-w-none">{content}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeComponent = ({ className, children, inline, ...props }: CodeProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopyCode = async () => {
    toast.success("Code copied to clipboard");
    await navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group border rounded-md">
      <div className="flex items-center justify-between px-4 py-2 bg-background text-white rounded-t-md">
        <span className="text-sm font-mono">{lang || "javascript"}</span>
        <Button
          variant="ghost"
          size="icon"
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            isCopied ? "bg-green-500/20 text-green-500" : ""
          }`}
          onClick={handleCopyCode}
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="sr-only">{isCopied ? "Copied!" : "Copy code"}</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={lang || "javascript"}
        style={nightOwl as { [key: string]: React.CSSProperties }}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
