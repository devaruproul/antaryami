"use client";
import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span style={{ color: "var(--amber)" }}>{time}</span>;
}
