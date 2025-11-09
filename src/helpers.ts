import { GUTTER_SIZE } from "./constants";
import { type Point } from "./types";

export const getDistance = (p1: Point, p2?: Point) => {
  if (!p2) return 0;

  const x = Math.pow(p1.x - p2.x, 2);
  const y = Math.pow(p1.y - p2.y, 2);

  return Math.sqrt(x + y);
};

export const getBounds = (container: HTMLElement, dragElement: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const maxLeft = containerRect.width - dragElement.clientWidth - GUTTER_SIZE;
  const maxTop = containerRect.height - dragElement.clientHeight - GUTTER_SIZE;
  const maxHeight = containerRect.height - GUTTER_SIZE * 2;
  const maxWidth = containerRect.width - GUTTER_SIZE * 2;

  return {
    maxWidth,
    maxHeight,
    minLeft: GUTTER_SIZE,
    minTop: GUTTER_SIZE,
    maxLeft: Math.max(GUTTER_SIZE, maxLeft),
    maxTop: Math.max(GUTTER_SIZE, maxTop),
  };
};

export const clamp = (
  value: number,
  { min, max }: { min: number; max: number } = {
    min: -Infinity,
    max: Infinity,
  }
): number => {
  return Math.max(min, Math.min(max, value));
};

type MoveElementParams = {
  dragElement: HTMLElement;
  container: HTMLElement;
  left?: number;
  top?: number;
};

export const moveElement = ({
  dragElement,
  container,
  left,
  top,
}: MoveElementParams) => {
  const _left = left ?? parseFloat(dragElement.style.left || "0");
  const _top = top ?? parseFloat(dragElement.style.top || "0");

  const { minLeft, minTop, maxLeft, maxTop } = getBounds(
    container,
    dragElement
  );

  dragElement.style.left = `${clamp(_left, {
    min: minLeft,
    max: maxLeft,
  })}px`;

  dragElement.style.top = `${clamp(_top, {
    min: minTop,
    max: maxTop,
  })}px`;
};
