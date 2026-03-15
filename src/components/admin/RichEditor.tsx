'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
}

const ToolbarBtn = ({ onClick, active, title, children }: {
  onClick: () => void, active?: boolean, title: string, children: React.ReactNode
}) => (
  <button type="button" onClick={onClick} title={title}
    className={`px-2.5 py-1.5 rounded text-sm transition-colors ${
      active ? 'bg-charcoal text-white' : 'text-[#6B6860] hover:bg-[#F1EFE8]'
    }`}>
    {children}
  </button>
)

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Tulis konten berita di sini...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[240px] px-4 py-3 outline-none focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [])

  if (!editor) return null

  return (
    <div className="border border-[#E0DDD6] rounded-lg overflow-hidden focus-within:border-gold transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 px-2 py-2 border-b border-[#E0DDD6] bg-[#FAF8F4]">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} title="Strikethrough">
          <s>S</s>
        </ToolbarBtn>

        <div className="w-px bg-[#E0DDD6] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          H2
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          H3
        </ToolbarBtn>

        <div className="w-px bg-[#E0DDD6] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Bullet List">
          • List
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Ordered List">
          1. List
        </ToolbarBtn>

        <div className="w-px bg-[#E0DDD6] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Blockquote">
          " Quote
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule">
          — HR
        </ToolbarBtn>

        <div className="w-px bg-[#E0DDD6] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          ↩ Undo
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          ↪ Redo
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <div className="bg-white min-h-[240px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}