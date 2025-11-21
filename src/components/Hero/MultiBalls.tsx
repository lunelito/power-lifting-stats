"use client";
import { useEffect, useRef } from "react";

type Ball = {
  color: string;
  xSpeed: number;
  ySpeed: number;
  startX: number;
  startY: number;
  r:number
}

type MultiBallBounceProps = {
  balls: Ball[];
}

export default function MultiBalls({ balls }: MultiBallBounceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    function resizeCanvas() {
      const rect = canvas!.getBoundingClientRect();
      canvas!.width = rect.width;
      canvas!.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ballObjects = balls.map(ball => ({
      ...ball,
      x: Math.max(0.05, Math.min(0.95, ball.startX)),
      y: Math.max(0.05, Math.min(0.95, ball.startY)),
      dx: ball.xSpeed,
      dy: ball.ySpeed,
      radius: ball.r
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each ball
      ballObjects.forEach(ball => {
        const r = ball.radius * canvas.width;
        const pixelX = ball.x * canvas.width;
        const pixelY = ball.y * canvas.height;


        ctx.beginPath();
        ctx.arc(pixelX, pixelY, r, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();

        // Update ball position
        if (ball.x + ball.dx > 1 - ball.radius || ball.x + ball.dx < ball.radius) {
          ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy > 1 - ball.radius || ball.y + ball.dy < ball.radius) {
          ball.dy = -ball.dy;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [balls]);

  return <canvas ref={canvasRef} className="h-screen w-screen" />;
}