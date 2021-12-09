import React, { useState, useRef, useEffect } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import logo from './logo.svg';
import './App.css';

const transformer = new Transformer();
const initValue = `# Title

- one
- two

`;


function Mindmap({ value }: { value: string }) {
  const svgElementRef = useRef<SVGSVGElement | null>(null);
  const markMapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (markMapRef.current) return;
    if (!svgElementRef.current) return;

    markMapRef.current = Markmap.create(svgElementRef.current);
  }, [svgElementRef.current]);

  useEffect(() => {
    const markMap = markMapRef.current;
    const { root } = transformer.transform(value);
    markMap?.setData(root);
    markMap?.fit();
  }, [markMapRef.current, value]);



  return (
    <svg className="mindmap" ref={svgElementRef} />
  );
}

function Sidebar({ value, onChange }: { value: string, onChange: any }) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  const handleToggle = (e: any) => {
    if (e.target.open && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  return (
    <details className="sidebar" open onToggle={handleToggle}>
      <textarea
        ref={textAreaRef}
        className=""
        value={value}
        onChange={handleChange}
      />

      <summary><b className="summary-text">&#10095;</b></summary>
    </details>
  )
}


function App() {
  const [value, setValue] = useState(initValue);

  return (<>
    <Sidebar value={value} onChange={setValue} />
    <Mindmap value={value} />
  </>)
}

export default App;
