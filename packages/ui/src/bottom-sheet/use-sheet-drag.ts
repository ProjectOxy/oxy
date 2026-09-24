import { isMotionEnabled } from "@oxy/motion";
import { animateSpring } from "@oxy/motion/gestures";
import { useRef, type MouseEvent, type PointerEvent } from "react";

const dragOffsetVar = "--oxy-bottom-sheet-drag-offset";

const dismissFraction = 0.3;
const dismissVelocity = 0.5;

interface Drag {
  pointerId: number;
  startY: number;
  offset: number;
  time: number;
  velocity: number;
}

export function useSheetDrag(close: () => void) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const hasMoved = useRef(false);
  const settle = useRef<{ stop(): void } | null>(null);

  const setOffset = (offset: number) =>
    sheetRef.current?.style.setProperty(dragOffsetVar, String(offset));

  const release = (event: PointerEvent<HTMLElement>, canDismiss: boolean) => {
    const current = drag.current;
    const sheet = sheetRef.current;
    if (!current || current.pointerId !== event.pointerId || !sheet) return;
    drag.current = null;
    if (
      canDismiss &&
      (current.offset > sheet.offsetHeight * dismissFraction || current.velocity > dismissVelocity)
    ) {
      close();
      return;
    }
    if (isMotionEnabled(sheet)) {
      settle.current = animateSpring(sheet, { [dragOffsetVar]: [current.offset, 0] });
    } else {
      setOffset(0);
    }
  };

  const handleProps = {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return;
      settle.current?.stop();
      event.currentTarget.setPointerCapture(event.pointerId);
      const offset = Number(sheetRef.current?.style.getPropertyValue(dragOffsetVar) || 0);
      hasMoved.current = false;
      drag.current = {
        pointerId: event.pointerId,
        startY: event.clientY - offset,
        offset,
        time: event.timeStamp,
        velocity: 0,
      };
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const current = drag.current;
      if (!current || current.pointerId !== event.pointerId) return;
      const offset = Math.max(0, event.clientY - current.startY);
      const elapsed = Math.max(1, event.timeStamp - current.time);
      current.velocity = (offset - current.offset) / elapsed;
      current.offset = offset;
      current.time = event.timeStamp;
      if (offset > 3) hasMoved.current = true;
      setOffset(offset);
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => release(event, true),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => release(event, false),
    onClick(event: MouseEvent<HTMLElement>) {
      if (hasMoved.current) {
        event.preventDefault();
        hasMoved.current = false;
        return;
      }
      close();
    },
  };

  return { sheetRef, handleProps };
}
