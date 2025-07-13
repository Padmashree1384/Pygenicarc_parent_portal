import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

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

const DLSLab = () => {
  const canvasRef = useRef();
  const statusRef = useRef();
  const inputRef = useRef();
  const depthLimitInputRef = useRef();
  const textareaRef = useRef();
  const toastRef = useRef();
  const stepSound = useRef();
  const successSound = useRef();
  const failSound = useRef();

  const p5Instance = useRef(null);
  const nodes = useRef([]);
  const history = useRef([]);
  const visitCounter = useRef(1);
  const stepNumber = useRef(1);
  const stack = useRef([]);
  const running = useRef(false);
  const paused = useRef(false);
  const searchComplete = useRef(false);
  const current = useRef(null);
  const target = useRef("F");
  const depthLimit = useRef(2);
  const [layoutMode, setLayoutMode] = useState('manual');
  const root = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !canvasRef.current.hasChildNodes()) {
      stepSound.current = new Audio('/step.mp3');
      successSound.current = new Audio('/success.mp3');
      failSound.current = new Audio('/fail.mp3');

      const sketch = (p) => {
        p.setup = () => {
          const cnv = p.createCanvas(800, 500);
          cnv.parent(canvasRef.current);
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
                  done(`❌ ${target.current} not found.`);
                } else {
                  done(`⚠️ Cutoff Failure: ${target.current} not found within depth limit ${depthLimit.current}.`);
                }
              }
              playSound(failSound);
            }
          }
        };
      };

      p5Instance.current = new p5(sketch, canvasRef.current);
    }

    return () => {
      if (p5Instance.current) { 
        p5Instance.current.remove(); 
        p5Instance.current = null;
      }
    };
  }, []);

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

  const createTree = (count, values, edges) => {
    const nodeList = Array.from({ length: count }, (_, i) => ({
      value: values[i] || `N${i}`,
      x: 0, y: 0,
      children: [],
      visited: false,
      found: false,
      visitOrder: null,
      depth: 0
    }));

    edges.forEach(([p, c]) => {
      if (nodeList[p] && nodeList[c]) {
        nodeList[p].children.push(nodeList[c]);
      }
    });

    const rootNode = nodeList[0];
    const levels = {};
    const assignLevels = (node, depth) => {
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      node.depth = depth;
      node.children.forEach(child => assignLevels(child, depth + 1));
    };
    assignLevels(rootNode, 0);

    Object.entries(levels).forEach(([level, levelNodes]) => {
      const spacing = 600 / (levelNodes.length + 1);
      levelNodes.forEach((node, i) => {
        node.x = 100 + spacing * (i + 1);
        node.y = 100 + parseInt(level) * 100;
      });
    });

    nodes.current = nodeList;
    root.current = rootNode;
    resetTraversal();
    statusRef.current.innerText = "✅ Tree built. Ready to search!";
  };

  const resetTraversal = () => {
    if (root.current) {
      stack.current = [root.current];
    } else {
      stack.current = [];
    }
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
    textareaRef.current.value = '';
    statusRef.current.innerText = 'Status: Ready';
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
      stepText: textareaRef.current.value
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
        if (!child.visited && (child.depth + 1) <= depthLimit.current) {
          stack.current.push(child);
        } else if (!child.visited && (child.depth + 1) > depthLimit.current) {
          logStep(`Not adding ${child.value} (Depth ${child.depth + 1}) to stack: Exceeds limit ${depthLimit.current}`);
        }
      }
    }
  };

  const done = (msg) => {
    statusRef.current.innerText = msg;
    logStep(msg);
    current.current = null;
    searchComplete.current = true;
    running.current = false;
  };

  const logStep = (text) => {
    textareaRef.current.value += `Step ${stepNumber.current++}: ${text}\n`;
  };

  const playSound = (ref) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play();
    }
  };

  const handleCreate = () => {
    nodes.current = [];
    root.current = null;
    
    if (p5Instance.current) {
      p5Instance.current.clear(); 
      p5Instance.current.background(255); 
    }

    const count = parseInt(document.getElementById("nodeCount").value);
    const values = Array.from({ length: count }, (_, i) =>
      document.getElementById(`nodeVal${i}`).value.toUpperCase() || `N${i}`
    );
  
    if (layoutMode === 'manual') { 
      const edges = [];
      for (let i = 0; i < count - 1; i++) {
        const p = parseInt(document.getElementById(`parent${i}`).value);
        const c = parseInt(document.getElementById(`child${i}`).value);
        if (!isNaN(p) && !isNaN(c)) edges.push([p, c]);
      }
      createTree(count, values, edges);
    } else {
      const nodeList = values.map(v => ({
        value: v, x: 0, y: 0,
        children: [], visited: false, found: false, visitOrder: null, depth: 0
      }));
      for (let i = 0; i < count; i++) {
        if (2 * i + 1 < count) nodeList[i].children.push(nodeList[2 * i + 1]);
        if (2 * i + 2 < count) nodeList[i].children.push(nodeList[2 * i + 2]);
      }
      createTreeFromNodes(nodeList);
    }

    const buildButton = document.getElementById('buildTreeBtn');
    if (buildButton) {
      buildButton.style.display = 'none';
    }
  };

  const handleGenerate = () => {
    const count = parseInt(document.getElementById("nodeCount").value);
    const container = document.getElementById("nodeInputs");
    container.innerHTML = '';

    container.innerHTML += `<h4>Enter Node Values</h4>`;
    for (let i = 0; i < count; i++) {
      container.innerHTML += `Node ${i}: <input type="text" id="nodeVal${i}" /><br>`;
    }

    if (layoutMode === 'manual') { 
      container.innerHTML += `<h4>Enter Edges (Parent Index → Child Index)</h4>`;
      for (let i = 0; i < count - 1; i++) {
        container.innerHTML += `Edge ${i}: 
          <input type="number" id="parent${i}" /> →
          <input type="number" id="child${i}" /><br>`;
      }
    }
    
    const buildButton = document.getElementById('buildTreeBtn');
    if (buildButton) {
      buildButton.style.display = 'inline-block';
    }
  };

  const createTreeFromNodes = (nodeList) => {
    nodes.current = nodeList;
    root.current = nodeList[0];
  
    const levels = {};
    const assignLevels = (node, depth) => {
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      node.depth = depth;
      node.children.forEach(c => assignLevels(c, depth + 1));
    };
  
    assignLevels(root.current, 0);
  
    Object.entries(levels).forEach(([level, levelNodes]) => {
      const spacing = 600 / (levelNodes.length + 1);
      levelNodes.forEach((node, i) => {
        node.x = 100 + spacing * (i + 1);
        node.y = 100 + parseInt(level) * 100;
      });
    });
  
    resetTraversal();
    statusRef.current.innerText = "✅ Auto tree built!";
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
    <div style={{ 
      textAlign: 'center', 
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <h1>DLS Search Simulator</h1>

      <div style={{ 
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{ marginBottom: 10 }}>
          <label>Layout Mode: </label>
          <select onChange={(e) => setLayoutMode(e.target.value)} value={layoutMode}>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>

          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Number of Nodes: <input id="nodeCount" type="number" defaultValue="7" /></label>
          <button onClick={handleGenerate}>Next</button>
        </div>
        
        <div id="nodeInputs" style={{ width: '100%' }} />
        <button id="buildTreeBtn" onClick={handleCreate} style={{ display: 'none', marginTop: '10px' }}>Build Tree</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        Search for: <input ref={inputRef} defaultValue="F" />
        <button onClick={() => {
          target.current = inputRef.current.value.toUpperCase();
          resetTraversal();
        }}>Set Target</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        Depth Limit: <input ref={depthLimitInputRef} type="number" defaultValue="2" min="0" />
        <button onClick={() => {
          depthLimit.current = parseInt(depthLimitInputRef.current.value);
          resetTraversal();
        }}>Set Limit</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button onClick={resetTraversal}>Reset</button>
        <button onClick={() => {
          if (searchComplete.current) return;
          running.current = true;
          paused.current = true;
          dlsStep();
        }}>Next Step</button>
        <button onClick={() => { running.current = true; paused.current = false; }}>Run</button>
        <button onClick={() => { paused.current = true; }}>Pause</button>
      </div>

      <div ref={statusRef} style={{ fontSize: 18, marginBottom: 20 }}>Status: Ready</div>

      <div style={{ 
        align:'right',
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        gap: 40,
        flexWrap: 'wrap'
      }}>
        <div ref={canvasRef}></div>
        <div style={{ minWidth: 300 }}>
          <h3>Search Steps</h3>
          <textarea 
            ref={textareaRef} 
            rows={12} 
            style={{ width: '90%' }} 
            readOnly 
          />
          <br />
          <button onClick={() => {
            navigator.clipboard.writeText(textareaRef.current.value);
            showToast('✅ Steps copied to clipboard!');
          }}>📋 Copy Steps</button>
        </div>
      </div>

      <button onClick={() => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (canvas) {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/jpeg');
          link.download = 'dls_tree.jpg';
          link.click();
        }
      }}>
        🖼️ Download Tree Image (JPG)
      </button>

      <div ref={toastRef} style={{ 
        visibility: 'hidden', 
        opacity: 0, 
        position: 'fixed', 
        bottom: 30, 
        right: 30, 
        backgroundColor: '#333', 
        color: '#fff', 
        padding: '10px 16px', 
        borderRadius: 8 
      }}>
        ✅ Steps copied to clipboard!
      </div>
    </div>
  );
};

export default DLSLab;