import React, { useState, useRef, useEffect } from 'react';
import p5 from 'p5';
import stepSoundFile from '/step.mp3';
import successSoundFile from '/success.mp3';
import failSoundFile from '/fail.mp3';

const precedence = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const isOperator = (char) => ['+', '-', '*', '/', '^'].includes(char);
const isOperand = (char) => /^[a-zA-Z0-9]$/.test(char);

const INPO_EX2 = () => {
  const canvasRef = useRef();
  const toastRef = useRef();
  const [expression] = useState('A+(B-C)*D/E^F'); // Editable
  const [tokens, setTokens] = useState([]);
  const [index, setIndex] = useState(0);
  const [stack, setStack] = useState([]);
  const [output, setOutput] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [history, setHistory] = useState([]);

  const stepSound = useRef(new Audio(stepSoundFile));
  const successSound = useRef(new Audio(successSoundFile));
  const failSound = useRef(new Audio(failSoundFile));

  useEffect(() => {
    setTokens(expression.split(''));
    const sketch = new p5((p) => {
      p.setup = () => {
        const canvas = p.createCanvas(900, 360);
        canvas.parent(canvasRef.current);
      };

      p.draw = () => {
        p.background(255);
        drawStackBucket(p);
        drawOutput(p);
      };

      const drawStackBucket = (p) => {
        const boxW = 60;
        const boxH = 40;
        const bucketX = 110;
        const bucketYBottom = 320;
        const bucketHeight = 240;
        const bucketWidth = boxW + 20;

        // 🪣 Bucket structure
        p.stroke(150);
        p.strokeWeight(3);
        p.noFill();
        p.beginShape();
        p.vertex(bucketX, bucketYBottom - bucketHeight); // top-left
        p.vertex(bucketX, bucketYBottom); // bottom-left
        p.vertex(bucketX + bucketWidth, bucketYBottom); // bottom-right
        p.vertex(bucketX + bucketWidth, bucketYBottom - bucketHeight); // top-right
        p.endShape();

        // 🧱 Stack content
        p.fill(0);
        p.textSize(20);
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.text('Operator Stack',150, 30);

        for (let i = 0; i < stack.length; i++) {
          const y = bucketYBottom - (i + 1) * (boxH + 10);
          p.fill('#64b5f6');
          p.stroke(0);
          p.rect(bucketX + 10, y, boxW, boxH, 6);
          p.noStroke();
          p.fill(0);
          p.text(stack[i], bucketX + 10 + boxW / 2, y + boxH / 2);
        }

        if (stack.length === 0) {
          p.fill('#aaa');
          p.noStroke();
          p.text('Empty', bucketX + bucketWidth / 2, bucketYBottom - bucketHeight + 40);
        }
      };

      const drawOutput = (p) => {
        p.fill(0);
        p.textSize(20);
        p.textAlign(p.LEFT, p.CENTER);
        p.text('Postfix Output:', 460, 30);

        const spacing = 45;
        const y = 80;
        const startX = 370;

        for (let i = 0; i < output.length; i++) {
          p.fill('#a5d6a7');
          p.stroke(0);
          p.rect(startX + i * spacing, y, 40, 40, 6);
          p.fill(0);
          p.noStroke();
          p.text(output[i], startX + i * spacing + 15, y + 20);
        }

        if (output.length === 0) {
          p.fill('#aaa');
          p.text('Empty', startX, y + 60);
        }
      };
    });

    return () => sketch.remove();
  }, [stack, output]);

  const showToast = (msg) => {
    const toast = toastRef.current;
    if (!toast) return;
    toast.innerText = msg;
    toast.style.visibility = 'visible';
    toast.style.opacity = 1;
    setTimeout(() => {
      toast.style.opacity = 0;
      toast.style.visibility = 'hidden';
    }, 2000);
  };

  const performStep = () => {
    if (index >= tokens.length) {
      if (stack.length > 0) {
        const newStack = [...stack];
        const newOutput = [...output];
        const newStepList = [...stepList];
        const newHistory = [...history];
  
        while (newStack.length) {
          const op = newStack.pop();
          newOutput.push(op);
          newStepList.push(`📤 Popped '${op}' from stack to output (final flush).`);
        }
  
        setHistory([...newHistory, { stack, output, index }]);
        setStack([]);
        setOutput(newOutput);
        setStepList(newStepList);
        successSound.current.play();
        showToast('✅ Conversion Complete');
      } else {
        successSound.current.play();
        showToast('✅ Conversion Complete');
      }
      return;
    }
  
    const token = tokens[index];
    const newStack = [...stack];
    const newOutput = [...output];
    const newStepList = [...stepList];
  
    // 🎵 Play step sound here, only for real steps
    stepSound.current.currentTime = 0;
    stepSound.current.play();
  
    if (isOperand(token)) {
      newOutput.push(token);
      newStepList.push(`✅ Added operand '${token}' to output`);
    } else if (token === '(') {
      newStack.push(token);
      newStepList.push(`🟦 Pushed '(' onto stack`);
    } else if (token === ')') {
      while (newStack.length && newStack[newStack.length - 1] !== '(') {
        const op = newStack.pop();
        newOutput.push(op);
        newStepList.push(`📤 Popped '${op}' to output until '('`);
      }
      newStack.pop(); // remove '('
      newStepList.push(`🧹 Discarded matching '('`);
    } else if (isOperator(token)) {
      while (
        newStack.length &&
        precedence[newStack[newStack.length - 1]] >= precedence[token]
      ) {
        const op = newStack.pop();
        newOutput.push(op);
        newStepList.push(`⬇️ Popped '${op}' to output (precedence)`);
      }
      newStack.push(token);
      newStepList.push(`⬆️ Pushed operator '${token}' to stack`);
    }
  
    setHistory([...history, { stack, output, index }]);
    setStack(newStack);
    setOutput(newOutput);
    setStepList(newStepList);
    setIndex(index + 1);
  };  

  const undoStep = () => {
    if (history.length === 0) {
      failSound.current.play();
      showToast('⛔ No previous steps');
      return;
    }

    const last = history[history.length - 1];
    setStack(last.stack);
    setOutput(last.output);
    setIndex(last.index);
    setStepList((prev) => prev.slice(0, -1));
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setStack([]);
    setOutput([]);
    setStepList([]);
    setIndex(0);
    setHistory([]);
    showToast('🔁 Reset Done');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI', textAlign: 'center', padding: 20 }}>
      <h1>Infix to Postfix Visualizer</h1>
      <p style={{ fontSize: 18 }}>
        <b>Expression:</b> {expression}
      </p>

      <div style={{ margin: '20px' }}>
      <button onClick={performStep} style={btnStyle}>Next Step</button>
        <button onClick={undoStep} style={btnStyle}>Previous Step</button>
        <button onClick={handleReset} style={btnStyle}>Reset</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <div ref={canvasRef}></div>

        <div style={{ width: 320 }}>
          <h3>📋 Conversion Steps</h3>
          <textarea
            readOnly
            rows="15"
            value={stepList.join('\n')}
            style={{
              width: '100%',
              padding: 10,
              fontSize: 15,
              borderRadius: 6,
              border: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
            }}
          />
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(stepList.join('\n'));
              showToast('✅ Steps copied to clipboard!');
            }}
            style={{marginTop: 8 }}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>

      <div ref={toastRef} style={toastStyle}></div>
    </div>
  );
};

const btnStyle = {
  padding: '10px 16px',
  fontSize: '16px',
  marginRight: '10px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#007BFF',
  color: 'white',
  cursor: 'pointer',
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
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  opacity: 0,
  transition: 'visibility 0s, opacity 0.3s ease-in-out',
};

export default INPO_EX2;
