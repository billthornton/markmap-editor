import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { INode } from 'markmap-common';
import { Transformer } from 'markmap-lib';
import { CustomMarkmap } from './custom-markmap';
import { downloadAsPng, downloadAsSvg } from './export';

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

function Control({ children, onClick, title }: { children: React.ReactChild | React.ReactChild[], onClick: any, title?: string }) {
  return <button title={title} onClick={onClick} className="controls__button">{children}</button>
}

function Controls({ markMapRef, svgElementRef }: { markMapRef: React.MutableRefObject<CustomMarkmap | null>, svgElementRef: React.MutableRefObject<SVGSVGElement | null> }) {

  const onZoom = (multiplier: number) => () => {
    if (markMapRef.current) {
      markMapRef.current.rescale(1 * multiplier)
    }
  }

  const onCollapse = async () => {
    if (markMapRef.current) {
      markMapRef.current.collapseTree();
      await markMapRef.current.fit();
    }
  }
  const onExpand = async () => {
    if (markMapRef.current) {
      markMapRef.current.expandTree();
      await markMapRef.current.fit();
    }
  }

  return <ul className="controls">
    <li><Control title="Zoom in" onClick={onZoom(1.2)}>+</Control></li>
    <li><Control title="Zoom out" onClick={onZoom(0.8)}>-</Control></li>
    <li><Control title="Collapse nodes" onClick={onCollapse}>&#60;</Control></li>
    <li><Control title="Expand nodes" onClick={onExpand}>&#62;</Control></li>
    <li><Control onClick={downloadAsSvg}>Export SVG</Control></li>
    <li><Control onClick={downloadAsPng()}>Export PNG</Control></li>
  </ul>
}

function Mindmap({ value, markMapRef, svgElementRef }: { value: string, markMapRef: React.MutableRefObject<CustomMarkmap | null>, svgElementRef: React.MutableRefObject<SVGSVGElement | null> }) {
  useEffect(() => {
    if (markMapRef.current) return;
    if (!svgElementRef.current) return;

    markMapRef.current = new CustomMarkmap(svgElementRef.current, {
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
      nodeFont: `400 10px/12px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
    });
  }, [markMapRef, svgElementRef]);

  useEffect(() => {
    const markMap = markMapRef.current;
    if (markMap) {
      const { root } = transformer.transform(value);
      markMap.setData(root);
      markMap.fit();
    }

  }, [markMapRef, value]);

  return (
    <div className='mindmap-wrapper'>
      <svg className="mindmap" ref={svgElementRef} />
    </div>
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
  const valueFromParams = new URLSearchParams(document.location.search).get('input');
  const decodedValueFromParams = valueFromParams && atob(valueFromParams);
  const [value, setValue] = useState(decodedValueFromParams || initValue);


  const markMapRef = useRef<CustomMarkmap | null>(null);
  const svgElementRef = useRef<SVGSVGElement | null>(null);

  const updateWithNewValue = (newValue: string) => {
    const searchParams = new URLSearchParams(document.location.search);
    searchParams.set("input", btoa(newValue));
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    window.history.pushState(null, '', newRelativePathQuery);
    setValue(newValue);
  }

  return (<>
    <Sidebar value={value} onChange={updateWithNewValue} />
    <Mindmap value={value} markMapRef={markMapRef} svgElementRef={svgElementRef} />
    <Controls markMapRef={markMapRef} svgElementRef={svgElementRef} />
  </>)
}

export default App;
