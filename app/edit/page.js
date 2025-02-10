"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FiCopy } from "react-icons/fi";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Dynamically import MarkdownPreview to avoid SSR issues
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

function EditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [markdown, setMarkdown] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const markdownParam = searchParams.get("markdown");
    if (markdownParam) {
      setMarkdown(decodeURIComponent(markdownParam));
    } else {
      setMarkdown(`# Welcome to Markdown Editor  🚀  
        
      This is a markdown editor where you can write and preview markdown in real-time.
      
      ## Features
      - Real-time Markdown Preview
      - Copy Markdown to Clipboard
      - Download Markdown as a File
      - Insert Markdown Snippets
      - Markdown Syntax Highlighting
      \n>[!WARNING]\n>Use at your own risk! LOL, just kidding. Have fun!
      \n>[!NOTE]\n>Use the Insert Markdown dropdown to insert markdown snippets.`);
    }
  }, [searchParams]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert("Markdown copied to clipboard!");
  };

  const insertMarkdownAtCursor = (markdownSnippet) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const newMarkdown =
      markdown.substring(0, cursorPos) +
      markdownSnippet +
      markdown.substring(cursorPos);

    setMarkdown(newMarkdown);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(".dropdown-menu") === null) {
        setShowDropdown(false);
      }
    };

    const handleBeforeUnload = (event) => {
      const message =
        "Unsaved changes will be lost. Are you sure you want to leave?";
      event.preventDefault();
      event.returnValue = message;
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const downloadAsMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    saveAs(blob, "file.md");
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Navbar with Glass Effect */}
      <div className="bg-black bg-opacity-50 backdrop-blur-lg shadow-white z-10 p-2 flex items-center justify-between top-0 sticky shadow-md transition-all duration-300 ease-in-out">
        <h2
          className="text-lg font-semibold text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          Markdown Editor
        </h2>
        <div className="relative">
          {/* Dropdown button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-1 bg-black text-white border border-white rounded hover:bg-gray-800 transition-colors mr-3"
          >
            Insert Markdown
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 w-96 bg-black text-white border rounded shadow-lg p-4 grid grid-cols-3 gap-4 mt-2 z-10 dropdown-menu">
              <div>
                <h3 className="font-semibold text-sm mb-2">Headings</h3>
                <ul>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("# Heading\n")}
                      className="text-white hover:underline"
                    >
                      H1
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("## Heading\n")}
                      className="text-white hover:underline"
                    >
                      H2
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("### Heading\n")}
                      className="text-white hover:underline"
                    >
                      H3
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("**bold text**")}
                      className="text-white hover:underline"
                    >
                      Bold
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("*italicized text*")
                      }
                      className="text-white hover:underline"
                    >
                      Italic
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("~~strikethrough~~")
                      }
                      className="text-white hover:underline"
                    >
                      Strikethrough
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Lists & Code</h3>
                <ul>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("> blockquote")}
                      className="text-white hover:underline"
                    >
                      Blockquote
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("1. First item\n2. Second item")
                      }
                      className="text-white hover:underline"
                    >
                      Ordered List
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("- First item\n- Second item")
                      }
                      className="text-white hover:underline"
                    >
                      Unordered List
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => insertMarkdownAtCursor("`code`")}
                      className="text-white hover:underline"
                    >
                      Inline Code
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("\n``` \n code block \n ```")
                      }
                      className="text-white hover:underline"
                    >
                      Code Block
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Links & Media</h3>
                <ul>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "[title](https://www.example.com)"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      Link
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("![alt text](image.jpg)")
                      }
                      className="text-white hover:underline"
                    >
                      Image
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "| Syntax | Description |\n| ----------- | ----------- |"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      Table
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "referring to[^1].sample texts\n[^1]:My reference."
                        )
                      }
                      className="text-white hover:underline"
                    >
                      Footnote
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Github Alerts</h3>
                <ul>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "\n\n>[!NOTE] \n > This is a note"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      Note
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor("\n\n>[!TIP] \n > This is a tip")
                      }
                      className="text-white hover:underline"
                    >
                      Tip
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "\n\n>[!WARNING] \n > This is a warning"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      warning
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "\n\n>[!IMPORTANT] \n > This is important"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      important
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        insertMarkdownAtCursor(
                          "\n\n>[!CAUTION] \n > This is risky"
                        )
                      }
                      className="text-white hover:underline"
                    >
                      caution
                    </button>
                  </li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDropdown(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Editor Section */}
      <div className="flex w-full h-screen">
        {/* Editor Section */}
        <div className="w-1/2 p-6 bg-black border-r border-gray-300 flex flex-col relative">
          {/* Copy Button with Icon positioned at top-right */}
          <button
            onClick={copyToClipboard}
            className="absolute top-2 mt-8 right-2 flex items-center text-white hover:text-gray-400 transition-all"
          >
            <FiCopy className="mr-10" />
          </button>

          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full p-2 border rounded resize-none bg-black text-white placeholder-white"
            placeholder="Start typing your markdown..."
          />
        </div>

        {/* Markdown Preview Section */}
        <div className="w-1/2 p-6 bg-black text-white">
          <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
          <div
            className="h-full overflow-auto p-4 bg-black rounded shadow text-white"
            ref={previewRef}
          >
            {isMounted ? (
              <MarkdownPreview
                source={markdown}
                style={{ padding: "20px", color: "white" }}
              />
            ) : (
              <p>Loading preview...</p>
            )}
            {/* Download Button */}
            <div className="mt-4">
              <button
                onClick={downloadAsMarkdown}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-all"
              >
                Download as Markdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPageContent />
    </Suspense>
  );
}
