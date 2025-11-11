// src/app/views/dashboard/CanvasAnimation.jsx

import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';

const CanvasAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let nodes = [];
    const maxNodes = 250;
    let frameCount = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      init();
    };

    class Node {
      constructor(x, y, parent = null, level = 0) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.level = level;
        this.radius = Math.max(2, 6 - level * 0.7);
        // CORRECTED: Used template literal (backticks ``) to correctly create the HSLA color string.
        this.color = `hsla(${190 + level * 25}, 70%, 75%, 0.9)`;
        this.children = [];
        
        // NEW: Properties for extra features
        this.linkAlpha = 0; // For fading in the branch line
        this.pulseOffset = Math.random() * Math.PI; // For unique node pulsing
      }

      update() {
        // NEW: Animate the link alpha for a smooth fade-in
        if (this.linkAlpha < 1) {
          this.linkAlpha += 0.05;
        }
      }

      draw() {
        // NEW: Add a subtle pulsing effect to the node's size
        const pulse = Math.sin(frameCount * 0.03 + this.pulseOffset) * 0.5;
        const currentRadius = this.radius + pulse;

        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function tryGrow() {
      const growableNodes = nodes.filter(p => p.children.length < 2);
      if (growableNodes.length === 0) return;

      const parentNode = growableNodes[Math.floor(Math.random() * growableNodes.length)];
      if (!parentNode) return;

      const angleOffset = parentNode.children.length === 0 ? -1 : 1;
      const angle = (Math.PI / 3.5 + (Math.random() * 0.3 - 0.15)) * angleOffset;
      const branchLength = (canvas.height / 7) * Math.max(0.5, 1 - parentNode.level * 0.1);

      const newX = parentNode.x + Math.sin(angle) * branchLength;
      const newY = parentNode.y + Math.cos(angle) * branchLength;

      if (newX < 0 || newX > canvas.width) return;

      const childNode = new Node(newX, newY, parentNode, parentNode.level + 1);
      parentNode.children.push(childNode);
      nodes.push(childNode);
    }

    function init() {
      nodes = [];
      frameCount = 0;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // MODIFIED: Slower root spawning for a less crowded feel
      if (frameCount % 20 === 0 && nodes.length < maxNodes) {
        const x = Math.random() * canvas.width;
        const y = -20;
        const root = new Node(x, y, null, 0);
        nodes.push(root);
      }

      nodes = nodes.filter(node => node.y < canvas.height + 50);
      while (nodes.length > maxNodes) {
        nodes.shift();
      }

      // Draw all the edges
      ctx.lineWidth = 1.5;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (node.parent) {
          // CORRECTED: Used template literal (backticks ``) to correctly create the RGBA color string.
          ctx.strokeStyle = `rgba(190, 220, 230, ${0.4 * node.linkAlpha})`;
          ctx.beginPath();
          ctx.moveTo(node.parent.x, node.parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }
      
      // Update and draw all the nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(); // Update node properties
        nodes[i].draw();   // Then draw the node
      }

      // MODIFIED: Throttled growth for a slower, more graceful animation
      if (frameCount % 2 === 0) {
        tryGrow();
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 75%)',
      }}
    />
  );
};

export default CanvasAnimation;