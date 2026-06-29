import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import { useRef } from "react";

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onMount?: OnMount;
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  typescript: "typescript",
};

const MonacoCodeEditor = ({
  value,
  onChange,
  language = "javascript",
  height = "400px",
  readOnly = false,
  onMount,
}: MonacoCodeEditorProps) => {
  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure editor settings
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      lineNumbers: "on",
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 8,
      lineNumbersMinChars: 3,
      renderLineHighlight: "all",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      padding: { top: 12, bottom: 12 },
      wordWrap: "on",
      automaticLayout: true,
      readOnly,
    });

    // Define custom dark theme matching the app
    monaco.editor.defineTheme("techtronia-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
        { token: "operator", foreground: "D4D4D4" },
      ],
      colors: {
        "editor.background": "#0f1117",
        "editor.foreground": "#D4D4D4",
        "editorLineNumber.foreground": "#4a4a5a",
        "editorLineNumber.activeForeground": "#9090AA",
        "editor.lineHighlightBackground": "#1a1a2e",
        "editorCursor.foreground": "#A855F7",
        "editor.selectionBackground": "#3a1e6e",
        "editor.inactiveSelectionBackground": "#2a1a4e",
        "editorIndentGuide.background1": "#2a2a3a",
        "editorIndentGuide.activeBackground1": "#4a4a6a",
        "editor.findMatchBackground": "#623a1e",
        "editor.findMatchHighlightBackground": "#3a2810",
        "scrollbarSlider.background": "#3a3a4a80",
        "scrollbarSlider.hoverBackground": "#5a5a7a80",
        "scrollbarSlider.activeBackground": "#7a7aaa80",
      },
    });

    monaco.editor.setTheme("techtronia-dark");

    if (onMount) {
      onMount(editor, monaco);
    }
  };

  const handleChange: OnChange = (val) => {
    onChange(val ?? "");
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border/50 shadow-lg">
      {/* Editor header bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0f1117] border-b border-border/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-muted-foreground ml-2 font-mono">
          {languageMap[language] || language}
        </span>
      </div>
      <Editor
        height={height}
        language={languageMap[language] || language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-[#0f1117] text-muted-foreground text-sm">
            Loading editor...
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};

export default MonacoCodeEditor;
