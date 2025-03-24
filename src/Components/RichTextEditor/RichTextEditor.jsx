import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = forwardRef(({ value, onChange }, ref) => {
  const quillRef = useRef(null);

  // Expose the Quill instance to the parent component
  useImperativeHandle(ref, () => ({
    getEditor: () => quillRef.current?.getEditor(),
  }));

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // ✅ Disabling the old mutation observer behavior
      if (editor?.root) {
        editor.root.mutationObserver?.disconnect?.();
      }
    }
  }, []);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="mb-3">
      <label>
        BODY <span className="star">*</span>
      </label>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        className="tech-textarea"
        style={{ height: "250px" }}
        modules={modules}
      />
    </div>
  );
});

export default RichTextEditor;
