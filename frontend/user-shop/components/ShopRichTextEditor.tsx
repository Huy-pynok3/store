'use client'

import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface ShopRichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = ['bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image']

export default function ShopRichTextEditor({ value, onChange }: ShopRichTextEditorProps) {
  return (
    <div className="shop-quill">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
    </div>
  )
}
