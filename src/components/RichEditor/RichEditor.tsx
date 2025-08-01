import { Table } from "@tiptap/extension-table";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import "./RichEditor.scss";

const fontOptions = [
  "Arial",
  "Georgia",
  "Courier New",
  "Times New Roman",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Raleway",
  "Roboto",
];

export default function RichEditor({ content, onChange }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-left",
          },
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "custom-table",
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      Underline,
      Strike,
      Highlight,
      Link,
      Image,
      BulletList,
      OrderedList,
      TableRow,
      TableHeader,
      TableCell,
      ListItem.extend({
        addKeyboardShortcuts() {
          return {
            Tab: () => this.editor.commands.sinkListItem("listItem"),
            "Shift-Tab": () => this.editor.commands.liftListItem("listItem"),
          };
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      transformPastedHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        doc.querySelectorAll("*").forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.color = "";
            el.style.backgroundColor = "";
          }
        });

        const paragraphs = Array.from(doc.querySelectorAll("p"));

        const isBulletSymbol = (text: string) =>
          /^([·•Ø\-*])(\s|&nbsp;)*$/.test(text.trim());

        paragraphs.forEach((p) => {
          const firstSpan = p.querySelector("span");
          const spans = Array.from(p.childNodes);

          const rawText = p.textContent?.trim() || "";
          const bulletMatch = rawText.match(/^([·•Ø\-*])(\s|&nbsp;)*/);

          if (bulletMatch) {
            // Create <ul><li> and preserve styled content
            const ul = document.createElement("ul");
            const li = document.createElement("li");

            // Build new content fragment excluding bullet symbols
            const fragment = document.createDocumentFragment();

            spans.forEach((node) => {
              if (
                node.nodeType === Node.TEXT_NODE &&
                isBulletSymbol(node.textContent || "")
              ) {
                return; // skip bullet-like text
              }

              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node instanceof HTMLElement &&
                isBulletSymbol(node.textContent || "")
              ) {
                return; // skip bullet-like spans
              }

              fragment.appendChild(node.cloneNode(true));
            });

            li.appendChild(fragment);
            ul.appendChild(li);
            p.replaceWith(ul);
          }
        });

        return doc.body.innerHTML;
      },
    },
  });

  return (
    <div className="editor-wrapper border rounded shadow-sm bg-white text-black">
      {editor && (
        <div className="toolbar flex flex-wrap gap-2 p-2 border-b bg-gray-100">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as Level })
                  .run();
              }}
            >
              H{level}
            </button>
          ))}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
          >
            B
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
          >
            I
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
          >
            U
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
          >
            S
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
          >
            • List
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setHighlight().run();
            }}
          >
            ✱
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("left").run();
            }}
          >
            <img
              src="/icons/left.svg"
              alt="justify"
              width="20px"
              height="20px"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
          >
            <img
              src="/icons/center.svg"
              alt="justify"
              width="20px"
              height="20px"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
          >
            <img
              src="/icons/right.svg"
              alt="justify"
              width="20px"
              height="20px"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("justify").run();
            }}
          >
            <img
              src="/icons/justify.svg"
              alt="justify"
              width="20px"
              height="20px"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
            }}
          >
            📊 Table
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().addColumnBefore().run();
            }}
          >
            ➕ Col
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().addRowBefore().run();
            }}
          >
            ➕ Row
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().deleteTable().run();
            }}
          >
            🗑️ Del Table
          </button>

          <input
            type="color"
            onChange={(e) => {
              e.preventDefault();
              editor.chain().focus().setColor(e.target.value).run();
            }}
            title="Text Color"
          />
          <select
            onChange={(e) => {
              e.preventDefault();
              editor.chain().focus().setFontFamily(e.target.value).run();
            }}
          >
            <option value="">Font</option>
            {fontOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleLink().run();
            }}
          >
            🔗 Link
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const url = prompt("Image URL");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
          >
            🖼️
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="editor-content"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();

            if (editor?.isActive("listItem")) {
              // Keep default list item indent/outdent behavior
              if (e.shiftKey) {
                editor.chain().focus().liftListItem("listItem").run(); // outdent
              } else {
                editor.chain().focus().sinkListItem("listItem").run(); // indent
              }
            } else {
              // Insert 2 or 4 spaces when not inside a list
              editor.chain().focus().insertContent("\t").run();
            }
          }
        }}
      />
    </div>
  );
}
