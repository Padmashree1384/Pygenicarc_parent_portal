import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import enqueueSoundFile from '/step.mp3';   // enqueue sound
import dequeueSoundFile from '/success.mp3'; // dequeue sound
import failSoundFile from '/fail.mp3';       // fail sound

const QOP = () => {
  const canvasRef = useRef();
  const toastRef = useRef();
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [stepList, setStepList] = useState([]);
  const MAX_QUEUE_SIZE = 8;

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(700, 200);
        canvas.parent(canvasRef.current);
      };

      p.draw = () => {
        p.background(255);
        p.fill(0);
        p.noStroke();
        p.textSize(18);
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Queue (Front → Rear)", p.width / 2, 30);
      
        const boxW = 60, boxH = 40;
        const startX = 100;
        const y = 80;
      
        // 🪣 Draw open-ended bucket line
        const totalW = MAX_QUEUE_SIZE * (boxW + 10) - 10;
        const bucketY = y - 10;
        const bucketHeight = boxH + 20;
      
        p.stroke(100);
        p.strokeWeight(3);
        p.noFill();
      
        // Bottom line
        p.line(startX, bucketY + bucketHeight, startX + totalW, bucketY + bucketHeight);
      
        // Top line
        p.line(startX, bucketY, startX + totalW, bucketY);
      
        // Left and Right short end lines (open bucket)
        p.line(startX, bucketY, startX, bucketY + 10); // left short
        p.line(startX + totalW, bucketY, startX + totalW, bucketY + 10); // right short
        p.line(startX, bucketY + bucketHeight - 10, startX, bucketY + bucketHeight); // left short
        p.line(startX + totalW, bucketY + bucketHeight - 10, startX + totalW, bucketY + bucketHeight); // right short
      
        // Draw queue blocks
        for (let i = 0; i < queue.length; i++) {
          const x = startX + i * (boxW + 10);
          p.fill('#81d4fa');
          p.stroke(0);
          p.rect(x, y, boxW, boxH, 6);
          p.noStroke();
          p.fill(0);
          p.text(queue[i], x + boxW / 2, y + boxH / 2);
        }
      
        // Draw labels "Front" and "Rear"
        if (queue.length > 0) {
          const frontX = startX + boxW / 2;
          const rearX = startX + (queue.length - 1) * (boxW + 10) + boxW / 2;
          p.fill('#e53935'); // red
          p.textSize(14);
          p.text('Front', frontX, y + boxH + 20);
          p.text('Rear', rearX, y + boxH + 20);
        } else {
          p.fill('#aaa');
          p.noStroke();
          p.text("Queue is Empty", p.width / 2, y + 20);
        }
      };      
    };

    const instance = new p5(sketch);
    return () => instance.remove();
  }, [queue]);

  const playSound = (type) => {
    const audio =
      type === 'enqueue' ? new Audio(enqueueSoundFile) :
      type === 'dequeue' ? new Audio(dequeueSoundFile) :
      new Audio(failSoundFile);
    audio.play();
  };

  const handleEnqueue = () => {
    if (inputValue.trim() === '') return;
    if (queue.length >= MAX_QUEUE_SIZE) {
      playSound('fail');
      showToast("Queue Overflow: Maximum size reached!");
      return;
    }
    const value = inputValue.trim();
    setQueue([...queue, value]);
    setInputValue('');
    playSound('enqueue');
    setStepList(prev => [...prev, `Enqueued ${value}`]);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      playSound('fail');
      showToast("Queue is already empty.");
      return;
    }
    const removed = queue[0];
    setQueue(queue.slice(1));
    playSound('dequeue');
    setStepList(prev => [...prev, `Dequeued ${removed}`]);
  };

  const handlePeek = () => {
    if (queue.length === 0) {
      playSound('fail');
      showToast("Queue is empty.");
      return;
    }
    showToast(`Front: ${queue[0]}`);
    setStepList(prev => [...prev, `Peeked front: ${queue[0]}`]);
  };

  const handleIsEmpty = () => {
    const msg = queue.length === 0 ? "Queue is Empty" : "Queue is Not Empty";
    showToast(msg);
    setStepList(prev => [...prev, msg]);
  };

  const handleSize = () => {
    const msg = `Size of Queue: ${queue.length}`;
    showToast(msg);
    setStepList(prev => [...prev, msg]);
  };

  const handleReset = () => {
    setQueue([]);
    setInputValue('');
    setStepList([]);
  };

  const showToast = (message) => {
    const toast = toastRef.current;
    if (!toast) return;
    toast.innerText = message;
    toast.style.visibility = 'visible';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.visibility = 'hidden';
    }, 2000);
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Segoe UI', marginTop: 15 }}>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{ padding: '8px', fontSize: '16px', width: '150px', marginRight: '10px' }}
        />
        <button onClick={handleEnqueue} style={buttonStyle}>Enqueue</button>
      </div>
      <button onClick={handleDequeue} style={buttonStyle}>Dequeue</button>
        <button onClick={handlePeek} style={buttonStyle}>Peek</button>
        <button onClick={handleIsEmpty} style={buttonStyle}>IsEmpty</button>
        <button onClick={handleSize} style={buttonStyle}>Size</button>
        <button onClick={handleReset} style={buttonStyle}>Reset</button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: 20}}>
        <div style={{marginTop: 40}} ref={canvasRef}></div>

        <div style={{ width: 300 }}>
          <h3>Queue Steps</h3>
          <textarea
            value={stepList.join('\n')}
            readOnly
            rows="12"
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
          ></textarea>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(stepList.join('\n'));
                showToast('✅ Steps copied to clipboard!');
              } catch {
                alert('Failed to copy.');
              }
            }}
            style={{ marginTop: 10, padding: '6px 12px', fontSize: 14 }}
          >
            📋 Copy Steps to Clipboard
          </button>
        </div>
      </div>

      <div ref={toastRef} style={toastStyle}></div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 18px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#007BFF',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '10px'
};

const toastStyle = {
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
  transition: 'visibility 0s, opacity 0.3s ease-in-out'
};

export default QOP;
