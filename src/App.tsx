import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { INode } from 'markmap-common';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import './App.css';

const transformer = new Transformer();
const initValue = `# Title

- one
- two
- third item
  - fourth item
    second line
  - five
    - six

`;


function Mindmap({ value }: { value: string }) {
  const svgElementRef = useRef<SVGSVGElement | null>(null);
  const markMapRef = useRef<Markmap | null>(null);

  useEffect(() => {
    if (markMapRef.current) return;
    if (!svgElementRef.current) return;

    markMapRef.current = Markmap.create(svgElementRef.current, {
      duration: 0,
      color: (
        (colorFn) =>
          (node: INode): string =>
            colorFn(node.d!.toString())
      )(d3.scaleOrdinal(["#4c28cf", "#0e52ec", "#ea13b1", "#2ec9c2", "#0fd991", "#d90f32", "#f2c317", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"])),
      nodeMinHeight: 20,
      spacingVertical: 8,
      spacingHorizontal: 24,
      paddingX: 8,
      nodeFont: `500 10px/12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
    });
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
