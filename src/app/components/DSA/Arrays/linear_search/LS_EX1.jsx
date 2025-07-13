import React, { useRef, useEffect, useState } from 'react';
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';
import p5 from 'p5';

const LS_EX1 = () => {
  const canvasRef = useRef();
  const [target, setTarget] = useState(25);
  const [status, setStatus] = useState('Step: Ready to search');
  const [controlsDisabled, setControlsDisabled] = useState(false);
  const [stepList, setStepList] = useState([]);
  const toastRef = useRef();


  const stateRef = useRef({
    arr: [1, 5, 8, 12, 15, 22, 25, 30, 35, 40],
    index: 0,
    visited: new Set(),
    found: false,
    searching: false,
    paused: false,
    stepInfo: ''
  });
  
  const legendStyle = (bg) => ({
    color: '#000',
    background: bg,
    padding: '4px 10px',
    borderRadius: '6px',
    marginRight: '10px',
    display: 'inline-block'
  });
  

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 300);
        canvas.parent(canvasRef.current);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
      };

      p.draw = () => {
        p.background(255);
        drawArray(p);
        if (stateRef.current.searching && !stateRef.current.paused && !stateRef.current.found) {
          performStep();
        }
      };

      const drawArray = (p) => {
        const { arr, index, found } = stateRef.current;
        const barWidth = p.width / arr.length;
      
        for (let i = 0; i < arr.length; i++) {
            if (i === index && found && stateRef.current.arr[i] === target) {
                p.fill('#228B22'); // ✅ Found – highest priority
              } else if (i === index && !found) {
                p.fill('#ffcc00'); // 🔶 Current
              } else if (stateRef.current.visited.has(i)) {
                p.fill('#64b5f6'); // 🔵 Visited
              } else {
                p.fill('#e0e0e0'); // ⚪ Not visited
              }
              
            
      
          p.stroke(180);
          p.strokeWeight(1);
          p.rect(i * barWidth + 5, p.height / 2 - 60, barWidth - 10, 100, 8);
          p.noStroke();
          p.fill(0);
          p.text(arr[i], i * barWidth + barWidth / 2, p.height / 2 - 10);
          p.textSize(14);
          p.text("Index " + i, i * barWidth + barWidth / 2, p.height / 2 + 55);
        }
      };
      

      const performStep = () => {
        const playStepSound = () => new Audio(stepSoundFile).play();
        const playSuccessSound = () => new Audio(successSoundFile).play();
        const playFailSound = () => new Audio(failSoundFile).play();
      
        let { arr, index } = stateRef.current;
      
        if (index >= arr.length) {
          stateRef.current.stepInfo = `❌ ${target} not found in the array`;
          playFailSound();
          stateRef.current.found = true;
          stateRef.current.searching = false;
          setControlsDisabled(true);
        } else {
            stateRef.current.visited.add(index);

          if (arr[index] === target) {
            stateRef.current.stepInfo = `✅ Found ${target} at index ${index}`;
            playSuccessSound();
            stateRef.current.found = true;
            stateRef.current.searching = false;
            setControlsDisabled(true);
          } else {
            stateRef.current.stepInfo = `🔎 Checking index ${index} → ${arr[index]}`;
            playStepSound();
            stateRef.current.index++;
          }
        }
      
        setStatus(`Step: ${stateRef.current.stepInfo}`);
        setStepList(prev => [...prev, stateRef.current.stepInfo]);
      };
      

      canvasRef.current.step = () => {
        if (controlsDisabled) return;
        if (!stateRef.current.searching) {
          resetState();
          stateRef.current.searching = true;
          stateRef.current.paused = true;
        }
        if (!stateRef.current.found) performStep();
      };

      canvasRef.current.run = () => {
        if (controlsDisabled) return;
        if (!stateRef.current.searching) {
          resetState();
          stateRef.current.searching = true;
        }
        stateRef.current.paused = false;
      };

      canvasRef.current.pause = () => {
        stateRef.current.paused = true;
      };

      canvasRef.current.reset = () => {
        resetState();
        setStepList([]);
      };

      canvasRef.current.setTarget = (newTarget) => {
        setTarget(newTarget);
        resetState();
      };

      const resetState = () => {
        const arr = [...stateRef.current.arr];
        stateRef.current = {
          arr,
          index: 0,
          visited: new Set(),
          found: false,
          searching: false,
          paused: false,
          stepInfo: 'Ready to search'
        };
        setStatus('Step: Ready to search');
        setControlsDisabled(false);
      };
      
    };

    const instance = new p5(sketch);
    return () => instance.remove();
  }, [target]);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Segoe UI' }}>
      
      <div style={{ margin: '20px' }}>
        <button onClick={() => canvasRef.current.reset()}>Reset</button>
        <button onClick={() => canvasRef.current.step()} disabled={controlsDisabled}>Next Step</button>
        <button onClick={() => canvasRef.current.run()} disabled={controlsDisabled}>Run</button>
        <button onClick={() => canvasRef.current.pause()}>Pause</button>
      </div>

      <div>
        <label>Search for: </label>
        <input
          type="number"
          value={target}
          onChange={(e) => canvasRef.current.setTarget(parseInt(e.target.value))}
        />
        <button onClick={() => canvasRef.current.setTarget(target)}>Set Target</button>
      </div>

      <div id="legend" style={{ marginTop: 10, fontSize: '16px' }}>
  <span style={legendStyle('#ffcc00')}>🟡 Current</span>
  <span style={legendStyle('#64b5f6')}>🔵 Visited</span>
  <span style={legendStyle('#7eff8f')}>🟢 Found</span>
  <span style={legendStyle('#e0e0e0')}>⚪ Not Visited</span>
</div>


      <div style={{ fontSize: 18, fontWeight: 500, marginTop: 20 }}>{status}</div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: 20 }}>
  <div ref={canvasRef}></div>
  <div style={{ width: 300 }}>
    <h3>Search Steps</h3>
    <textarea
      value={stepList.join('\n')}
      readOnly
      rows="12"
      style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
    ></textarea>
    <button onClick={async () => {
      try {
        await navigator.clipboard.writeText(stepList.join('\n'));
        const toast = toastRef.current;
        if (toast) {
          toast.innerText = '✅ Steps copied to clipboard!';
          toast.style.visibility = 'visible';
          toast.style.opacity = 1;
          setTimeout(() => {
            toast.style.opacity = 0;
            toast.style.visibility = 'hidden';
          }, 2000);
        }
      } catch {
        alert('Failed to copy steps.');
      }
    }} style={{ marginTop: 10, padding: '6px 12px', fontSize: 14 }}>📋 Copy Steps to Clipboard</button>
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

export default LS_EX1;
