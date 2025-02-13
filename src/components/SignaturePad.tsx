import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface SignaturePadProps {
  onChange: (dataUrl: string) => void;
  width?: number;
  height?: number;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onChange,
  width = 400,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas scale for retina displays
    const scale = window.devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // Set initial canvas state
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const getPoint = (event: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const y =
        event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      return {
        x: ((x - rect.left) * (canvas.width / scale)) / rect.width,
        y: ((y - rect.top) * (canvas.height / scale)) / rect.height,
      };
    };

    const drawLine = (
      start: { x: number; y: number },
      end: { x: number; y: number },
    ) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    };

    const handleStart = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      isDrawing.current = true;
      prevPoint.current = getPoint(event);
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (!isDrawing.current || !prevPoint.current) return;

      const currentPoint = getPoint(event);
      drawLine(prevPoint.current, currentPoint);
      prevPoint.current = currentPoint;
    };

    const handleEnd = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        prevPoint.current = null;
        onChange(canvas.toDataURL());
      }
    };

    // Mouse events
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("mouseout", handleEnd);

    // Touch events
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("mouseout", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
    };
  }, [onChange, width, height]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair"
          style={{ width: width + "px", height: height + "px" }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClear}
        className="w-full"
      >
        Hapus Tanda Tangan
      </Button>
    </div>
  );
};

export default SignaturePad;
