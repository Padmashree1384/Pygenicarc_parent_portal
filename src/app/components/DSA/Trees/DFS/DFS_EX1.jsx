import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

const DFS_EX1 = () => {
  const sketchRef = useRef();
  const [stepList, setStepList] = useState([]);
  const [statusText, setStatusText] = useState('Status: Ready');
  const toastRef = useRef();
  const DEFAULT_TARGET = 'F';

  useEffect(() => {
    let visitCounter = 1;
    let stepNumber = 1;
    let nodes = [], root;
    let stack = [], current = null;
    let running = false, paused = false;
    let searchComplete = false;
    let history = [];

    class Node {
      constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.children = [];
        this.visited = false;
        this.found = false;
        this.visitOrder = null;
      }
    }

    const setupTree = () => {
      const A = new Node('A', 400, 60);
      const B = new Node('B', 250, 140);
      const C = new Node('C', 550, 140);
      const D = new Node('D', 180, 220);
      const E = new Node('E', 320, 220);
      const F = new Node('F', 480, 220);
      const G = new Node('G', 620, 220);

      A.children.push(B, C);
      B.children.push(D, E);
      C.children.push(F, G);

      nodes = [A, B, C, D, E, F, G];
      root = A;
    };

    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 400);
        canvas.parent(sketchRef.current);
        setupTree();
        stack = [root];
      };

      p.draw = () => {
        p.background(255);
        drawEdges(p);
        drawNodes(p);

        if (running && !paused && !searchComplete) {
          if (stack.length > 0) {
            dfsStep();
          } else {
            setStatusText(`❌ ${DEFAULT_TARGET} not found.`);
            appendStep(`Step ${stepNumber++}: ❌ ${DEFAULT_TARGET} not found.`);
            playFailSound();
            current = null;
            searchComplete = true;
            running = false;
          }
        }
      };
    };

    const drawEdges = (p) => {
      p.stroke(150);
      p.strokeWeight(2);
      for (let node of nodes) {
        for (let child of node.children) {
          p.line(node.x, node.y, child.x, child.y);
        }
      }
    };

    const drawNodes = (p) => {
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      for (let node of nodes) {
        if (node.found) {
          p.fill(0, 255, 0);
        } else if (node === current) {
          p.fill(255, 204, 0);
        } else if (node.visited) {
          p.fill(100, 200, 255);
        } else {
          p.fill(230);
        }
        p.stroke(0);
        p.ellipse(node.x, node.y, 50, 50);
        p.fill(0);
        p.noStroke();
        if (node.visitOrder !== null) {
          p.text(`${node.value} (${node.visitOrder})`, node.x, node.y);
        } else {
          p.text(node.value, node.x, node.y);
        }
      }
    };

    const dfsStep = () => {
      if (stack.length === 0) return;

      history.push({
        nodes: nodes.map(n => ({ ...n })),
        stack: [...stack],
        current,
        visitCounter,
        stepNumber,
      });

      current = stack.pop();

      if (!current.visited) {
        current.visited = true;
        current.visitOrder = visitCounter++;

        if (current.value === DEFAULT_TARGET) {
          current.found = true;
          setStatusText(`✅ Found: ${DEFAULT_TARGET}`);
          setStepList(prev => [...prev, `Step ${stepNumber++}: ✅ Found: ${DEFAULT_TARGET}`]);
          playSuccessSound();
          searchComplete = true;
          return;
        }

        setStatusText(`🔍 Visiting: ${current.value}`);
        setStepList(prev => [...prev, `Step ${stepNumber++}: Visiting ${current.value}`]);
        playStepSound();

        // Add children in reverse to mimic left-to-right DFS
        for (let i = current.children.length - 1; i >= 0; i--) {
          const child = current.children[i];
          if (!child.visited) stack.push(child);
        }
      }
    };

    const playStepSound = () => new Audio(stepSoundFile).play();
    const playSuccessSound = () => new Audio(successSoundFile).play();
    const playFailSound = () => new Audio(failSoundFile).play();

    sketchRef.current.reset = () => {
      visitCounter = 1;
      stepNumber = 1;
      history = [];
      setStepList([]);
      setStatusText('Status: Ready');
      setupTree();
      stack = [root];
      for (let node of nodes) {
        node.visited = false;
        node.found = false;
        node.visitOrder = null;
      }
      current = null;
      running = false;
      paused = false;
      searchComplete = false;
    };

    sketchRef.current.step = () => {
      if (searchComplete) return;
      if (!running && stack.length === 0) stack = [root];
      running = true;
      paused = true;
      dfsStep();
    };

    sketchRef.current.run = () => {
      if (searchComplete) return;
      if (stack.length === 0) stack = [root];
      running = true;
      paused = false;
    };

    sketchRef.current.pause = () => { paused = true; };

    sketchRef.current.prevStep = () => {
      if (history.length === 0) return;
      const prev = history.pop();
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].visited = prev.nodes[i].visited;
        nodes[i].found = prev.nodes[i].found;
        nodes[i].visitOrder = prev.nodes[i].visitOrder;
      }
      stack = [...prev.stack];
      current = prev.current;
      visitCounter = prev.visitCounter;
      stepNumber = prev.stepNumber;
      setStepList(prev => prev.slice(0, -1));
      setStatusText(current ? `🔍 Visiting: ${current.value}` : 'Status: Step Reverted');
      searchComplete = false;
      running = false;
    };

    new p5(sketch);
  }, []);

  const copySteps = async () => {
    try {
      await navigator.clipboard.writeText(stepList.join('\n'));
      showToast('✅ Steps copied to clipboard!');
    } catch {
      showToast('❌ Failed to copy steps.');
    }
  };

  const showToast = (msg) => {
    const toast = toastRef.current;
    if (!toast) return;
    toast.innerText = msg;
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.visibility = 'hidden';
    }, 2000);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI', textAlign: 'center' }}>
      <h2>Search Element is 'F'</h2>

      <div style={{ margin: '20px' }}>
        <button onClick={() => sketchRef.current.reset()}>Reset</button>
        <button onClick={() => sketchRef.current.step()}>Next Step</button>
        <button onClick={() => sketchRef.current.prevStep()}>Prev Step</button>
        <button onClick={() => sketchRef.current.run()}>Run</button>
        <button onClick={() => sketchRef.current.pause()}>Pause</button>
      </div>

      <div style={{ fontSize: '18px', fontWeight: 500 }}>{statusText}</div>

      <div id="legend" style={{ margin: '10px 0 20px', fontSize: '16px' }}>
        <span style={legendStyle('#ffcc00')}>🟡 Current</span>
        <span style={legendStyle('#64b5f6')}>🔵 Visited</span>
        <span style={legendStyle('#7eff8f')}>🟢 Found</span>
        <span style={legendStyle('#e0e0e0')}>⚪ Not Visited</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div ref={sketchRef} style={{ width: 800 }}></div>
        <div style={{ width: 300, marginLeft: 80 }}>
          <h3>Search Algorithm</h3>
          <textarea
            rows="10"
            style={{ width: '100%', padding: 10, fontSize: 20, borderRadius: 6, border: '1px solid #ccc' }}
            value={stepList.join('\n')}
            readOnly
          ></textarea>
          <button onClick={copySteps} style={{ marginTop: 10, padding: '6px 12px', fontSize: 14 }}>📋 Copy Steps to Clipboard</button>
        </div>
      </div>

      <div ref={toastRef} style={{
        visibility: 'hidden',
        minWidth: '200px',
        backgroundColor: '#323232',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '8px',
        padding: '12px 16px',
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999,
        fontSize: '14px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        opacity: 0,
        transition: 'visibility 0s, opacity 0.3s ease-in-out'
      }}></div>
    </div>
  );
};

const legendStyle = (bg) => ({
  color: '#000', background: bg, padding: '3px 6px', borderRadius: 4, marginRight: 10
});

export default DFS_EX1;
