declare module "react-markdown" {
  interface ReactMarkdownProps {
    children: string;
    components?: Record<
      string,
      React.ComponentType<{ node?: { type: string; properties?: Record<string, unknown> }; children?: React.ReactNode }>
    >;
    className?: string;
  }

  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
}
