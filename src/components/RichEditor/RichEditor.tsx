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
      StarterKit,
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
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="editor-wrapper">
      {editor && (
        <div className="toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            B
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            U
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            S
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button onClick={() => editor.chain().focus().setHighlight().run()}>
            ✱
          </button>
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            title="Text Color"
          />
          <select
            onChange={(e) =>
              editor.chain().focus().setFontFamily(e.target.value).run()
            }
          >
            <option value="">Font</option>
            {fontOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <button onClick={() => editor.chain().focus().toggleLink().run()}>
            🔗 Link
          </button>
          <button
            onClick={() => {
              const url = prompt("Image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            🖼️
          </button>
        </div>
      )}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
