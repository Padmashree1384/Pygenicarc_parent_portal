import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';

const BBS_EX1 = () => {
  const canvasRef = useRef();
  const toastRef = useRef();
  const [status, setStatus] = useState('Step: Initialize array');
  const [controlsDisabled, setControlsDisabled] = useState(false);
  const [stepList, setStepList] = useState([]);

  const playStepSound = () => new Audio(stepSoundFile).play();
  const playSuccessSound = () => new Audio(successSoundFile).play();

  const stateRef = useRef({
    arr: [],
    originalArr: [64, 34, 25, 12, 22, 11, 90, 1, 2, 105],
    i: 0,
    j: 0,
    stepCount: 0,
    sorting: false,
    paused: false,
    runMode: false,
    successPlayed: false
  });

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 400);
        canvas.parent(canvasRef.current);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        resetState();
      };

      p.draw = () => {
        const s = stateRef.current;
        p.background(255);
        drawArray(p, s.arr, s.j);

        if (s.sorting && !s.paused && s.runMode) {
          bubbleSortStep(false); // Run mode - no sound
        }
      };

      const drawArray = (p, arr, j) => {
        const barWidth = p.width / arr.length;
        for (let i = 0; i < arr.length; i++) {
          const h = p.map(arr[i], 0, Math.max(...arr), 0, p.height - 50);

          if (i === j || i === j + 1) {
            p.fill(255, 0, 0); // Comparing
          } else {
            p.fill(100, 150, 255); // Default
          }

          p.rect(i * barWidth, p.height - h, barWidth - 5, h);
          p.fill(0);
          p.text(arr[i], i * barWidth + barWidth / 2, p.height - h - 20);
        }
      };

      const bubbleSortStep = (withSound = false) => {
        const s = stateRef.current;
        const arr = s.arr;

        if (s.i < arr.length - 1) {
          if (s.j < arr.length - s.i - 1) {
            const a = arr[s.j];
            const b = arr[s.j + 1];

            let stepMessage;
            if (a > b) {
              [arr[s.j], arr[s.j + 1]] = [b, a];
              s.stepCount++;
              stepMessage = `Step ${s.stepCount}: Swapped ${b} and ${a}`;
            } else {
              s.stepCount++;
              stepMessage = `Step ${s.stepCount}: Compared ${a} and ${b}, no swap`;
            }

            setStatus(stepMessage);
            setStepList(prev => [...prev, stepMessage]);
            if (withSound) playStepSound();
            s.j++;
          } else {
            s.j = 0;
            s.i++;
          }
        } else {
          s.sorting = false;
          s.runMode = false;
          setControlsDisabled(true);
          const message = `✅ Sorting Complete in ${s.stepCount} steps`;
          setStatus(message);
          setStepList(prev => [...prev, message]);
          if (!s.successPlayed) {
            playSuccessSound();
            s.successPlayed = true;
          }
        }
      };

      canvasRef.current.step = () => {
        const s = stateRef.current;
        if (s.sorting && !s.paused) return;
        if (!s.sorting) {
          resetState();
          s.sorting = true;
          s.paused = true;
          s.runMode = false;
        }
        if (s.sorting && !controlsDisabled) {
          bubbleSortStep(true); // Manual step with sound
        }
      };

      canvasRef.current.run = () => {
        const s = stateRef.current;
        if (!s.sorting) {
          resetState();
          s.sorting = true;
        }
        s.paused = false;
        s.runMode = true;
      };

      canvasRef.current.pause = () => {
        stateRef.current.paused = true;
        stateRef.current.runMode = false;
      };

      canvasRef.current.reset = () => {
        resetState();
        setStepList([]);
      };

      const resetState = () => {
        const arr = [...stateRef.current.originalArr];
        stateRef.current.arr = arr;
        stateRef.current.i = 0;
        stateRef.current.j = 0;
        stateRef.current.stepCount = 0;
        stateRef.current.sorting = false;
        stateRef.current.paused = false;
        stateRef.current.runMode = false;
        stateRef.current.successPlayed = false;
        setStatus('Step: Initialize array');
        setControlsDisabled(false);
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, []);

  const copySteps = async () => {
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
      alert('❌ Failed to copy steps.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: 20 }}>
      <h1>Bubble Sort Visualizer</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => canvasRef.current.reset()}>Reset</button>
        <button onClick={() => canvasRef.current.step()} disabled={controlsDisabled}>Next Step</button>
        <button onClick={() => canvasRef.current.run()} disabled={controlsDisabled}>Run</button>
        <button onClick={() => canvasRef.current.pause()}>Pause</button>
      </div>

      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10 }}>{status}</div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <div ref={canvasRef}></div>
        <div style={{ width: 300 }}>
          <h3>Sort Steps</h3>
          <textarea
            rows="12"
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
            value={stepList.join('\n')}
            readOnly
          ></textarea>
          <button onClick={copySteps} style={{ marginTop: 10, padding: '6px 12px', fontSize: 14 }}>
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
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        opacity: 0,
        transition: 'visibility 0s, opacity 0.3s ease-in-out'
      }}></div>
    </div>
  );
};

export default BBS_EX1;
