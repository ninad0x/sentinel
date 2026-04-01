"use client";
import { useEffect } from "react";

export default function Warmup() {
  useEffect(() => {
    fetch("/api/health");
  }, []);
  return null;
}