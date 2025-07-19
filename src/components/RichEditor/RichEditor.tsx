import { useEditor, EditorContent } from "@tiptap/react";
import { TextStyle } from "@tiptap/extension-text-style";
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
import "./RichEditor.css";

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
        paragraph: {
          HTMLAttributes: {
            class: "text-left",
          },
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
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 bg-white text-black rounded border border-gray-300",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="editor-wrapper border rounded shadow-sm bg-white text-black">
      {editor && (
        <div className="toolbar flex flex-wrap gap-2 p-2 border-b bg-gray-100">
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
            ⬅️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
          >
            ⬆️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
          >
            ➡️
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("justify").run();
            }}
          >
            📏
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
              if (e.shiftKey) {
                editor.chain().focus().liftListItem("listItem").run(); // outdent
              } else {
                editor.chain().focus().sinkListItem("listItem").run(); // indent
              }
            }
          }
        }}
      />
    </div>
  );
}
