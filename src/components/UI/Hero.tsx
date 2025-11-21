"use client";
import { useEffect, useState } from "react";
import MultiBallBounce from "../Hero/MultiBalls";

type Ball = {
  color: string;
  xSpeed: number;
  ySpeed: number;
  startX: number;
  startY: number;
  r: number;
};

export const orangeShades = [
  "#FFA500",
  "#FF8C00",
  "#FF7F50",
  "#FF6347",
  "#FF4500",
  "#FFD700",
  "#FFB347",
  "#E67E22",
  "#D35400",
  "#F39C12",
  "#E74C3C",
  "#FFA07A",
  "#FDBCB4",
  "#FF8C42",
  "#FF6B35",
  "#FF9F80",
  "#FF7F2A",
  "#FF944D",
  "#FFAD73",
  "#FF8533",
];

export default function Hero() {

  const [balls, setBalls] = useState<Ball[]>([]);

  useEffect(() => {
    const HowMuchBalls = Math.floor(Math.random() * 11) + 15;
    console.log(HowMuchBalls)
    const newBalls = [];

    for (let i: number = 0; i < HowMuchBalls; i++) {
      const startX = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
      const startY = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
      const r = parseFloat((Math.random() * 0.04 + 0.03).toFixed(2));
      const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
      const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
      const xSpeed =
        parseFloat((Math.random() * 0.0004 + 0.0001).toFixed(5)) *
        randomDirectionX;
      const ySpeed =
        parseFloat((Math.random() * 0.0003 + 0.00008).toFixed(5)) *
        randomDirectionY;
      const color = Math.floor(Math.random() * 20);
      let Ball = {
        color: orangeShades[color],
        xSpeed: xSpeed,
        ySpeed: ySpeed,
        startX: startX,
        startY: startY,
        r: r,
      };
      newBalls.push(Ball);
    }

    setBalls(newBalls);
  }, []);

  if (balls.length === 0) {
    return <div className="fixed inset-0 -z-10 opacity-50" />; // Loading state
  }
  return (
    <div className="fixed inset-0 -z-10 opacity-50">
      <MultiBallBounce balls={balls} />
    </div>
  );
}
