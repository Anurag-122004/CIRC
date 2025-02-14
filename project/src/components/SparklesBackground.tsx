import { useEffect, useRef } from "react";
import { useMousePosition } from "../hooks/useMousePosition";

interface SparklesBackgroundProps {
  particleColor?: string;
  particleCount?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

export function SparklesBackground({
  particleColor = "#FFFFFF",
  particleCount = 100,
  minSize = 0.6,
  maxSize = 1.4,
  speed = 0.5,
  className = "h-full w-full",
}: SparklesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      originalAlpha: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        this.originalAlpha = Math.random() * 0.5 + 0.5;
        this.alpha = this.originalAlpha;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (canvas) {
          if (this.x > canvas.width) this.x = 0;
          if (this.x < 0) this.x = canvas.width;
          if (this.y > canvas.height) this.y = 0;
          if (this.y < 0) this.y = canvas.height;
        }

        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
          this.alpha = Math.min(this.originalAlpha * 1.5, 1);
        } else {
          this.alpha = this.originalAlpha;
        }

        // Add subtle twinkling effect
        this.alpha *= 0.99;
        if (this.alpha < this.originalAlpha * 0.8) {
          this.alpha = this.originalAlpha;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${Math.floor(this.alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      }
    }

    // Create particles
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, particleCount, minSize, maxSize, speed, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}