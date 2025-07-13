import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const DLS_EX2 = () => {
  const sketchRef = useRef();
  const [stepList, setStepList] = useState([]);
  const [statusText, setStatusText] = useState('Status: Ready');
  const toastRef = useRef();
  const DEFAULT_TARGET = 'J';
  const DEFAULT_DEPTH_LIMIT = 3;

  const visitCounter = useRef(1);
  const stepNumber = useRef(1);
  const nodes = useRef([]);
  const root = useRef(null);
  const stack = useRef([]);
  const current = useRef(null);
  const running = useRef(false);
  const paused = useRef(false);
  const searchComplete = useRef(false);
  const history = useRef([]);
  const target = useRef(DEFAULT_TARGET);
  const depthLimit = useRef(DEFAULT_DEPTH_LIMIT);

  const stepSound = useRef(null);
  const successSound = useRef(null);
  const failSound = useRef(null);
  const p5Instance = useRef(null);

  class Node {
    constructor(value, x, y) {
      this.value = value;
      this.x = x;
      this.y = y;
      this.children = [];
      this.visited = false;
      this.found = false;
      this.visitOrder = null;
      this.depth = 0;
    }
  }

  useEffect(() => {
    // Only initialize once
    if (!p5Instance.current) {
      stepSound.current = new Audio('/step.mp3');
      successSound.current = new Audio('/success.mp3');
      failSound.current = new Audio('/fail.mp3');

      const sketch = (p) => {
        p.setup = () => {
          const cnv = p.createCanvas(800, 500);
          cnv.parent(sketchRef.current);
          setupTree();
        };

        p.draw = () => {
          p.background(255);
          drawEdges(p);
          drawNodes(p);
          if (running.current && !paused.current && !searchComplete.current) {
            if (stack.current.length > 0) {
              dlsStep();
            } else {
              if (!searchComplete.current) {
                const targetNode = nodes.current.find(n => n.value === target.current);
                if (targetNode && targetNode.depth <= depthLimit.current) {
                    setStatusText(`❌ ${target.current} not found.`);
                } else {
                    setStatusText(`⚠️ Cutoff Failure: ${target.current} not found within depth limit ${depthLimit.current}.`);
                }
              }
              playSound(failSound);
              searchComplete.current = true;
              running.current = false;
            }
          }
        };
      };

      p5Instance.current = new p5(sketch, sketchRef.current);
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  const setupTree = () => {
    const A = new Node('A', 400, 40);
    const B = new Node('B', 240, 120);
    const C = new Node('C', 560, 120);
    const D = new Node('D', 160, 200);
    const E = new Node('E', 320, 200);
    const F = new Node('F', 480, 200);
    const G = new Node('G', 640, 200);
    const H = new Node('H', 100, 280);
    const I = new Node('I', 200, 280);
    const J = new Node('J', 280, 280);
    const K = new Node('K', 360, 280);
    const L = new Node('L', 440, 280);
    const M = new Node('M', 520, 280);
    const N = new Node('N', 600, 280);
    const O = new Node('O', 700, 280);

    A.children.push(B, C);
    B.children.push(D, E);
    C.children.push(F, G);
    D.children.push(H, I);
    E.children.push(J, K);
    F.children.push(L, M);
    G.children.push(N, O);

    nodes.current = [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O];
    root.current = A;

    const assignDepths = (node, depth) => {
      node.depth = depth;
      node.children.forEach(child => assignDepths(child, depth + 1));
    };
    assignDepths(root.current, 0);

    resetTraversal();
    setStatusText("✅ Tree built. Ready to search!");
  };

  const resetTraversal = () => {
    stack.current = [root.current];
    current.current = null;
    visitCounter.current = 1;
    stepNumber.current = 1;
    running.current = false;
    paused.current = false;
    searchComplete.current = false;
    history.current = [];
    nodes.current.forEach(n => {
      n.visited = false;
      n.found = false;
      n.visitOrder = null;
    });
    setStepList([]);
    setStatusText('Status: Ready');
  };

  const dlsStep = () => {
    if (stack.current.length === 0) {
      return;
    }

    history.current.push({
      nodes: nodes.current.map(n => ({ ...n })),
      stack: [...stack.current],
      current: current.current,
      visitCounter: visitCounter.current,
      stepNumber: stepNumber.current,
      stepList: [...stepList]
    });

    current.current = stack.current.pop();

    if (current.current.depth > depthLimit.current) {
        logStep(`Skipping ${current.current.value} (Depth ${current.current.depth} > Limit ${depthLimit.current})`);
        playSound(stepSound);
        current.current = null;
        return;
    }

    if (!current.current.visited) {
      current.current.visited = true;
      current.current.visitOrder = visitCounter.current++;

      if (current.current.value === target.current) {
        current.current.found = true;
        done(`✅ Found: ${target.current} at depth ${current.current.depth}`);
        playSound(successSound);
        return;
      }

      logStep(`Visiting ${current.current.value} (Depth: ${current.current.depth})`);
      playSound(stepSound);

      for (let i = current.current.children.length - 1; i >= 0; i--) {
        const child = current.current.children[i];
        if (!child.visited && (current.current.depth + 1) <= depthLimit.current) {
            stack.current.push(child);
        } else if (!child.visited && (current.current.depth + 1) > depthLimit.current) {
            logStep(`Not adding ${child.value} (Depth ${current.current.depth + 1}) to stack: Exceeds limit ${depthLimit.current}`);
        }
      }
    }
  };

  const done = (msg) => {
    setStatusText(msg);
    logStep(msg);
    current.current = null;
    searchComplete.current = true;
    running.current = false;
  };

  const logStep = (text) => {
    setStepList(prev => [...prev, `Step ${stepNumber.current++}: ${text}`]);
  };

  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const copySteps = () => {
    navigator.clipboard.writeText(stepList.join('\n'));
    showToast('✅ Steps copied to clipboard!');
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

  const drawEdges = (p) => {
    p.stroke(150);
    p.strokeWeight(2);
    nodes.current.forEach(node => {
      node.children.forEach(child => {
        p.line(node.x, node.y, child.x, child.y);
      });
    });
  };

  const drawNodes = (p) => {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    
    // Draw each node only once
    nodes.current.forEach(node => {
      if (node.found) p.fill(0, 255, 0);
      else if (node === current.current) p.fill(255, 204, 0);
      else if (node.visited) p.fill(100, 200, 255);
      else p.fill(230);

      p.stroke(0);
      p.ellipse(node.x, node.y, 50, 50);
      p.fill(0);
      p.noStroke();
      const text = node.visitOrder !== null ? `${node.value} (${node.visitOrder})` : node.value;
      p.text(text, node.x, node.y);

      p.textSize(10);
      p.fill(100);
      p.text(`D: ${node.depth}`, node.x, node.y + 30);
      p.textSize(14);
    });
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>DLS Example 2</h1>

      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label>Search for:</label>
          <input 
            defaultValue={DEFAULT_TARGET} 
            onChange={(e) => target.current = e.target.value.toUpperCase()}
            style={{ padding: '5px' }}
          />
          <button 
            onClick={() => resetTraversal()}
            style={{ padding: '5px 10px' }}
          >
            Set Target & Reset
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label>Depth Limit:</label>
          <input 
            type="number" 
            defaultValue={DEFAULT_DEPTH_LIMIT} 
            min="0" 
            onChange={(e) => depthLimit.current = parseInt(e.target.value)}
            style={{ padding: '5px', width: '60px' }}
          />
          <button 
            onClick={() => resetTraversal()}
            style={{ padding: '5px 10px' }}
          >
            Set Limit & Reset
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button 
          onClick={resetTraversal}
          style={{ padding: '5px 10px' }}
        >
          Reset
        </button>
        <button 
          onClick={() => { running.current = true; paused.current = true; dlsStep(); }}
          style={{ padding: '5px 10px' }}
        >
          Next Step
        </button>
        <button 
          onClick={() => { running.current = true; paused.current = false; }}
          style={{ padding: '5px 10px' }}
        >
          Run
        </button>
        <button 
          onClick={() => { paused.current = true; }}
          style={{ padding: '5px 10px' }}
        >
          Pause
        </button>
      </div>

      <div style={{ 
        fontSize: 18, 
        marginBottom: '20px',
        minHeight: '24px'
      }}>
        {statusText}
      </div>

      <div style={{ 
        margin: '20px 0', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '18px', 
            height: '18px', 
            borderRadius: '50%', 
            backgroundColor: 'rgb(255, 204, 0)', 
            marginRight: '5px', 
            border: '1px solid black' 
          }}></span>
          Current
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '18px', 
            height: '18px', 
            borderRadius: '50%', 
            backgroundColor: 'rgb(100, 200, 255)', 
            marginRight: '5px', 
            border: '1px solid black' 
          }}></span>
          Visited
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '18px', 
            height: '18px', 
            borderRadius: '50%', 
            backgroundColor: 'rgb(0, 255, 0)', 
            marginRight: '5px', 
            border: '1px solid black' 
          }}></span>
          Found
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '18px', 
            height: '18px', 
            borderRadius: '50%', 
            backgroundColor: 'rgb(230, 230, 230)', 
            marginRight: '5px', 
            border: '1px solid black' 
          }}></span>
          Not Visited
        </span>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px',
        width: '100%',
        flexWrap: 'wrap'
      }}>
        <div ref={sketchRef} style={{ width: 800 }}></div>
        <div style={{ width: 300 }}>
          <h3>Search Algorithm Steps</h3>
          <textarea
            rows="10"
            style={{ 
              width: '100%', 
              padding: 10, 
              fontSize: 16, 
              borderRadius: 6, 
              border: '1px solid #ccc',
              minHeight: '300px'
            }}
            value={stepList.join('\n')}
            readOnly
          ></textarea>
          <button 
            onClick={copySteps} 
            style={{ 
              marginTop: 10, 
              padding: '6px 12px', 
              fontSize: 14,
              width: '100%'
            }}
          >
            📋 Copy Steps to Clipboard
          </button>
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
        opacity: 0,
        transition: 'opacity 0.3s, visibility 0.3s'
      }}>
        ✅ Steps copied to clipboard!
      </div>
    </div>
  );
};

export default DLS_EX2;