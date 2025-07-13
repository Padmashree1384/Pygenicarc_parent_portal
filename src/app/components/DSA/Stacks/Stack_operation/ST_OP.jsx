import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import pushSoundFile from '/step.mp3';     // push sound
import popSoundFile from '/success.mp3';   // pop sound
import failSoundFile from '/fail.mp3';     // fail sound

const ST_OP = () => {
  const canvasRef = useRef();
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const toastRef = useRef();
  const MAX_STACK_SIZE = 8;
  const [stepList, setStepList] = useState([]);

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(400, 450);
        canvas.parent(canvasRef.current);
      };

      p.draw = () => {
        p.background(255);
        p.fill(0);
        p.textSize(18);
        p.textAlign(p.CENTER, p.CENTER);
      
        const boxHeight = 40;
        const boxWidth = 120;
        const bucketHeight = 8 * (boxHeight + 10); // fixed height
        const stackX = p.width / 2 - boxWidth / 2;
        const bucketBottomY = p.height - 40;
      
        // 🪣 Draw bucket open at top, closed at bottom
        p.stroke(150);
        p.strokeWeight(3);
        p.noFill();
        p.beginShape();
        p.vertex(stackX - 10, bucketBottomY - bucketHeight); // top-left
        p.vertex(stackX - 10, bucketBottomY);                // bottom-left
        p.vertex(stackX + boxWidth + 10, bucketBottomY);     // bottom-right
        p.vertex(stackX + boxWidth + 10, bucketBottomY - bucketHeight); // top-right
        p.endShape();
      
        // 📦 Draw stack from bottom to top (bottom element at bottom of bucket)
        for (let i = 0; i < stack.length; i++) {
          const value = stack[i];
          const y = bucketBottomY - (i + 1) * (boxHeight + 10);
      
          p.fill('#64b5f6');
          p.stroke(0);
          p.rect(stackX, y, boxWidth, boxHeight, 6);
          p.noStroke();
          p.fill(0);
          p.text(value, p.width / 2, y + boxHeight / 2);
        }
      
        if (stack.length === 0) {
          p.fill('#999');
          p.text("Stack is Empty", p.width / 2, bucketBottomY - bucketHeight - 20);
        }
      };      
      
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, [stack]);

  const playSound = (type) => {
    const audio =
      type === 'push' ? new Audio(pushSoundFile) :
      type === 'pop' ? new Audio(popSoundFile) :
      new Audio(failSoundFile);
    audio.play();
  };

  const handlePush = () => {
    if (inputValue.trim() === '') return;
  
    if (stack.length >= MAX_STACK_SIZE) {
      playSound('fail');
      showToast("Stack Overflow: Maximum size reached!");
      return;
    }
  
    const value = inputValue.trim();
    const newStack = [...stack, value];
    setStack(newStack);
    setInputValue('');
    playSound('push');
    setStepList(prev => [...prev, `Pushed ${value}`]);
  };
    

  const handlePop = () => {
    if (stack.length === 0) {
      playSound('fail');
      showToast("Stack is already empty.");
      return;
    }
  
    const popped = stack[stack.length - 1];
    const newStack = [...stack.slice(0, -1)];
    setStack(newStack);
    playSound('pop');
    setStepList(prev => [...prev, `Popped ${popped}`]);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      playSound('fail');
      showToast('Stack is empty.');
      return;
    }
    const top = stack[stack.length - 1];
    setStepList(prev => [...prev, `Peeked: ${top}`]);
    showToast(` Top element is: ${top}`);
  };
  
  const handleIsEmpty = () => {
    const empty = stack.length === 0;
    setStepList(prev => [...prev, `Stack is ${empty ? 'Empty' : 'Not Empty'}`]);
    showToast(empty ? ' Stack is Empty' : ' Stack is Not Empty');
  };
  
  const handleSize = () => {
    const size = stack.length;
    setStepList(prev => [...prev, `Size of Stack: ${size}`]);
    showToast(` Size: ${size}`);
  };  
  
  const handleReset = () => {
    setStack([]);
    setStepList([]);
    setInputValue('');
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
    <div style={{ textAlign: 'center', fontFamily: 'Segoe UI' }}>
      
      <div style={{ margin: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          style={{ padding: '8px', fontSize: '16px', width: '150px', marginRight: '10px' }}
        />
        <button onClick={handlePush} style={buttonStyle}>Push</button>
      </div>
        <button onClick={handlePop} style={buttonStyle}>Pop</button>
        <button onClick={handlePeek} style={buttonStyle}>Peek</button>
        <button onClick={handleIsEmpty} style={buttonStyle}>IsEmpty</button>
        <button onClick={handleSize} style={buttonStyle}>Size</button>
        <button onClick={handleReset} style={buttonStyle}>Reset</button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
  <div style={{marginTop: '40px'}} ref={canvasRef}></div>

  <div style={{ width: 300 }}>
    <h3>Stack Steps</h3>
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

export default ST_OP;
