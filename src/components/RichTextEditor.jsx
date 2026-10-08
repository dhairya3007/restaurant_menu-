import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Eraser } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter link URL:');
    if (url) exec('createLink', url);
  };

  const handleHeading = (e) => {
    const format = e.target.value;
    if (format === 'P') {
      exec('formatBlock', '<P>');
    } else {
      exec('formatBlock', `<${format}>`);
    }
  };

  const onInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-3 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="d-flex flex-wrap gap-2 p-2 border-bottom bg-light align-items-center">
        <select className="form-select form-select-sm border-0 shadow-none w-auto" onChange={handleHeading} defaultValue="P">
          <option value="P">Normal</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
        </select>
        <div className="vr mx-1"></div>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('bold')} title="Bold"><Bold size={16} /></button>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('italic')} title="Italic"><Italic size={16} /></button>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('underline')} title="Underline"><Underline size={16} /></button>
        <div className="vr mx-1"></div>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={handleLink} title="Link"><LinkIcon size={16} /></button>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered size={16} /></button>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('insertUnorderedList')} title="Bullet List"><List size={16} /></button>
        <div className="vr mx-1"></div>
        <button type="button" className="btn btn-sm btn-light p-1" onClick={() => exec('removeFormat')} title="Clear Formatting"><Eraser size={16} /></button>
      </div>
      {/* Editable Area */}
      <div 
        ref={editorRef}
        contentEditable 
        onInput={onInput}
        onBlur={onInput}
        className="p-3" 
        style={{ minHeight: '150px', outline: 'none' }}
      >
      </div>
    </div>
  );
};

export default RichTextEditor;
