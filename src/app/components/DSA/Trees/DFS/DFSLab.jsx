import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const DFSLab = () => {
  const canvasRef = useRef();
  const statusRef = useRef();
  const inputRef = useRef();
  const textareaRef = useRef();
  const toastRef = useRef();
  const stepSound = useRef();
  const successSound = useRef();
  const failSound = useRef();

  const p5Instance = useRef();
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
  const root = useRef(null);
  const layoutMode = useRef('manual');

  useEffect(() => {
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
            dfsStep();
          } else {
            done(`❌ ${target.current} not found.`);
            playSound(failSound);
          }
        }
      };
    };

    p5Instance.current = new p5(sketch);

    return () => {
      p5Instance.current.remove();
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
    });
  };

  const createTree = (count, values, edges) => {
    const nodeList = Array.from({ length: count }, (_, i) => ({
      value: values[i] || `N${i}`,
      x: 0, y: 0,
      children: [],
      visited: false,
      found: false,
      visitOrder: null
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
      node.children.forEach(child => assignLevels(child, depth + 1));
    };
    assignLevels(rootNode, 0);

    Object.entries(levels).forEach(([level, levelNodes]) => {
      const spacing = 1000 / (levelNodes.length + 1);
      levelNodes.forEach((node, i) => {
        node.x = spacing * (i + 1);
        node.y = 100 + level * 100;
      });
    });

    nodes.current = nodeList;
    root.current = rootNode;
    resetTraversal();
    statusRef.current.innerText = "✅ Tree built. Ready to search!";
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
    textareaRef.current.value = '';
    statusRef.current.innerText = 'Status: Ready';
  };

  const dfsStep = () => {
    if (stack.current.length === 0) {
      done(`❌ ${target.current} not found.`);
      playSound(failSound);
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
    if (!current.current.visited) {
      current.current.visited = true;
      current.current.visitOrder = visitCounter.current++;
      if (current.current.value === target.current) {
        current.current.found = true;
        done(`✅ Found: ${target.current}`);
        playSound(successSound);
        return;
      }
      logStep(`Visiting ${current.current.value}`);
      playSound(stepSound);
      for (let i = current.current.children.length - 1; i >= 0; i--) {
        if (!current.current.children[i].visited) {
          stack.current.push(current.current.children[i]);
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
    const count = parseInt(document.getElementById("nodeCount").value);
    const values = Array.from({ length: count }, (_, i) =>
      document.getElementById(`nodeVal${i}`).value.toUpperCase() || `N${i}`
    );
  
    if (layoutMode.current === 'manual') {
      const edges = [];
      for (let i = 0; i < count - 1; i++) {
        const p = parseInt(document.getElementById(`parent${i}`).value);
        const c = parseInt(document.getElementById(`child${i}`).value);
        if (!isNaN(p) && !isNaN(c)) edges.push([p, c]);
      }
      createTree(count, values, edges);
    } else {
      // Auto build binary tree
      const nodeList = values.map(v => ({
        value: v, x: 0, y: 0,
        children: [], visited: false, found: false, visitOrder: null
      }));
      for (let i = 0; i < count; i++) {
        if (2 * i + 1 < count) nodeList[i].children.push(nodeList[2 * i + 1]);
        if (2 * i + 2 < count) nodeList[i].children.push(nodeList[2 * i + 2]);
      }
      createTreeFromNodes(nodeList);
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
  
    if (layoutMode.current === 'manual') {
      container.innerHTML += `<h4>Enter Edges (Parent Index → Child Index)</h4>`;
      for (let i = 0; i < count - 1; i++) {
        container.innerHTML += `Edge ${i}: 
          <input type="number" id="parent${i}" /> →
          <input type="number" id="child${i}" /><br>`;
      }
    }
  
    container.innerHTML += `<br><button onclick="document.getElementById('buildTreeBtn').click()">Build Tree</button>`;
  };


  const createTreeFromNodes = (nodeList) => {
    nodes.current = nodeList;
    root.current = nodeList[0];
  
    const levels = {};
    const assignLevels = (node, depth) => {
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      node.children.forEach(c => assignLevels(c, depth + 1));
    };
  
    assignLevels(root.current, 0);
  
    Object.entries(levels).forEach(([level, levelNodes]) => {
      const spacing = 1000 / (levelNodes.length + 1);
      levelNodes.forEach((node, i) => {
        node.x = spacing * (i + 1);
        node.y = 100 + level * 100;
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
    <div style={{ textAlign: 'center', paddingBottom: 20 }}>
      <h1>DFS Search Simulator</h1>
      <div style={{ marginBottom: 10 }}>
  <label>Layout Mode: </label>
  <select onChange={(e) => layoutMode.current = e.target.value} defaultValue="manual">
    <option value="manual">Manual</option>
    <option value="auto">Auto</option>
  </select>
</div>

      <div style={{ marginBottom: 20 }}>
        <label>Number of Nodes: <input id="nodeCount" type="number" /></label>
        <button onClick={handleGenerate}>Next</button>
        <div id="nodeInputs" />
        <button id="buildTreeBtn" onClick={handleCreate} style={{ display: 'none' }}>Build Tree</button>
      </div>


      <div>
        Search for: <input ref={inputRef} defaultValue="F" />
        <button onClick={() => {
          target.current = inputRef.current.value.toUpperCase();
          resetTraversal();
        }}>Set Target</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={resetTraversal}>Reset</button>
        <button onClick={() => {if (searchComplete.current) return; // ⛔ Don't step if search is done
                                running.current = true;
                                paused.current = true;
                                dfsStep();}}>Next</button>

        <button onClick={() => { running.current = true; paused.current = false; }}>Run</button>
        <button onClick={() => { paused.current = true; }}>Pause</button>
      </div>

      <div ref={statusRef} style={{ fontSize: 18, marginTop: 10 }}>Status: Ready</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <div ref={canvasRef}></div>
        <div style={{ marginLeft: 40 }}>
          <h3>Search Steps</h3>
          <textarea ref={textareaRef} rows={12} style={{ width: 300 }} readOnly />
          <br />
          <button onClick={() => {
            navigator.clipboard.writeText(textareaRef.current.value);
            toastRef.current.style.visibility = 'visible';
            toastRef.current.style.opacity = '1';
            setTimeout(() => {
              toastRef.current.style.opacity = '0';
              toastRef.current.style.visibility = 'hidden';
            }, 1500);
          }}>📋 Copy Steps</button>
        </div>
      </div>

      <button onClick={() => {
  const canvas = canvasRef.current?.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = 'Dfs_tree.jpg';
    link.click();
  }
}}>
  🖼️ Download Tree Image (JPG)
</button>


      <div ref={toastRef} style={{ visibility: 'hidden', opacity: 0, position: 'fixed', bottom: 30, right: 30, backgroundColor: '#333', color: '#fff', padding: '10px 16px', borderRadius: 8 }}>
        ✅ Steps copied to clipboard!
      </div>
      
      <audio ref={stepSound} src="/step.mp3" preload="auto" />
      <audio ref={successSound} src="/success.mp3" preload="auto" />
      <audio ref={failSound} src="/fail.mp3" preload="auto" />
    </div>
  );
};

export default DFSLab;
