import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
  cursorColor?: string;
  cursorWidth?: number;
  cursorStyle?: "solid" | "dashed" | "dotted";
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  className,
  speed = 30,
  onComplete,
  cursorColor = "hsl(var(--primary))",
  cursorWidth = 2,
  cursorStyle = "solid",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className={cn("inline-block", className)}>
      <Markdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
          li: ({ children }) => <li className="text-foreground">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          code: CodeComponent,
        }}
      >
        {displayedText}
      </Markdown>
      <div className="flex space-x-1 ml-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_infinite]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.3s_infinite]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.5s_infinite]" />
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
