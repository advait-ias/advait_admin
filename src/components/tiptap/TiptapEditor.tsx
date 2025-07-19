"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";

import "./editor.css"; // ⬅️ styling we’ll define below

const TiptapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
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
      HorizontalRule,
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-wrapper">
      {editor && (
        <div className="toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            Strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Ordered List
          </button>
          <button onClick={() => editor.chain().focus().setHighlight().run()}>
            Highlight
          </button>
          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            Left
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            Center
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            Right
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            Justify
          </button>

          <button
            onClick={() =>
              editor.chain().focus().sinkListItem("listItem").run()
            }
          >
            Indent
          </button>
          <button
            onClick={() =>
              editor.chain().focus().liftListItem("listItem").run()
            }
          >
            Outdent
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
            defaultValue=""
            title="Font Family"
          >
            <option value="">Select Font</option>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Segoe UI">Segoe UI</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Poppins">Poppins</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Merriweather">Merriweather</option>
          </select>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="tiptap-editor"
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
};

export default TiptapEditor;
