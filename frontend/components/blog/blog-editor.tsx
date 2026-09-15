"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";

// Dynamically import Editor to disable SSR
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-slate-400">
        <LoaderCircle className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-medium text-slate-500">Loading Rich Text Editor...</p>
      </div>
    ),
  }
);

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onUploadImage: (file: File) => Promise<string>;
}

export function BlogEditor({
  value,
  onChange,
  placeholder = "Write your blog post content here with full formatting, tables, media, images, and styles...",
  disabled = false,
  onUploadImage,
}: BlogEditorProps) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-slate-400">
        <LoaderCircle className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-medium text-slate-500">Initializing editor...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-teal-600/20 focus-within:border-teal-600 transition-all">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        value={value}
        disabled={disabled}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 480,
          menubar: "file edit view insert format tools table help",
          placeholder,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "emoticons",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | " +
            "bold italic underline strikethrough | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "table link image media emoticons | " +
            "code fullscreen preview | removeformat | help",
          toolbar_mode: "sliding",
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 15px;
              line-height: 1.65;
              color: #1e293b;
              padding: 16px;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1rem 0;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 12px;
            }
            th {
              background-color: #f1f5f9;
            }
            blockquote {
              border-left: 4px solid #0d9488;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #475569;
              font-style: italic;
            }
            pre {
              background: #0f172a;
              color: #f8fafc;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
            }
          `,
          branding: false,
          promotion: false,
          image_advtab: true,
          image_caption: true,
          file_picker_types: "image",
          automatic_uploads: true,
          images_upload_handler: async (blobInfo: any) =>
            onUploadImage(blobInfo.blob()),
          file_picker_callback: (cb: (value: string, meta?: Record<string, any>) => void) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = function () {
              const file = (input.files && input.files[0]) || null;
              if (!file) return;

              onUploadImage(file)
                .then((url) => cb(url, { title: file.name }))
                .catch(() => undefined);
            };

            input.click();
          },
        }}
      />
    </div>
  );
}
