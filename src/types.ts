export type Point = {
  x: number;
  y: number;
};

export type DragState = {
  isDragging: boolean;
  activePointerId: number | null;
  startPointerX: number;
  startPointerY: number;
  startLeft: number;
  startTop: number;
};
