const container = document.getElementById("app")!;
const dragElement = document.getElementById("drag-element")!;
const resetButton = document.getElementById("reset-button")!;

let leftPosition: string | number = "50%";
let topPosition: string | number = "50%";
let hasMoved = false;
let quarterInitialWidth: number = dragElement.clientWidth / 4;
let quarterInitialHeight: number = dragElement.clientHeight / 4;
const MIN_SIZE = 4;

// drag state
type DragState = {
  isDragging: boolean;
  activePointerId: number | null;
  startPointerX: number;
  startPointerY: number;
  startLeft: number;
  startTop: number;
};

let previousDistance: number | null = null;

let currentDragState: DragState = {
  activePointerId: null,
  isDragging: false,
  startLeft: 0,
  startTop: 0,
  startPointerX: 0,
  startPointerY: 0,
};

function centerDragElement() {
  const containerRect = container.getBoundingClientRect();
  const dragElementRect = dragElement.getBoundingClientRect();

  leftPosition = (containerRect.width - dragElementRect.width) / 2;
  topPosition = (containerRect.height - dragElementRect.height) / 2;

  dragElement.style.left = `${leftPosition}px`;
  dragElement.style.top = `${topPosition}px`;
}

export function setupDragElement() {
  centerDragElement();
  dragElement.innerHTML = `${dragElement.clientWidth}x${dragElement.clientHeight}`;
}

function handleReset() {
  dragElement.style.transition = "left 0.3s ease, top 0.3s ease";
  centerDragElement();
  hasMoved = false;
  setTimeout(() => {
    dragElement.style.transition = "";
  }, 300);
}

function handleWindowResize() {
  if (!hasMoved) {
    centerDragElement();
  }
}

function onDragStart(event: PointerEvent) {
  if (!event.isPrimary) return;

  const target = event.target as HTMLElement;
  target.setPointerCapture(event.pointerId);

  currentDragState.activePointerId = event.pointerId;
  currentDragState.isDragging = true;
  currentDragState.startPointerX = event.clientX;
  currentDragState.startPointerY = event.clientY;
  currentDragState.startLeft = parseFloat(dragElement.style.left || "0");
  currentDragState.startTop = parseFloat(dragElement.style.top || "0");
  dragElement.style.cursor = "grabbing";
}

function onMove(event: PointerEvent) {
  if (
    !currentDragState.isDragging ||
    event.pointerId !== currentDragState.activePointerId
  )
    return;

  const dx = event.clientX - currentDragState.startPointerX;
  const dy = event.clientY - currentDragState.startPointerY;

  dragElement.style.left = `${currentDragState.startLeft + dx}px`;
  dragElement.style.top = `${currentDragState.startTop + dy}px`;
  hasMoved = true;
}

function onDragEnd() {
  if (currentDragState.activePointerId) {
    dragElement.releasePointerCapture(currentDragState.activePointerId);
  }

  currentDragState = {
    activePointerId: null,
    isDragging: false,
    startLeft: 0,
    startTop: 0,
    startPointerX: 0,
    startPointerY: 0,
  };

  dragElement.style.cursor = "grab";
}

document.defaultView!.addEventListener("resize", handleWindowResize);

dragElement.addEventListener("pointerdown", onDragStart);
resetButton.addEventListener("click", handleReset);

window.addEventListener("pointermove", onMove);
window.addEventListener("pointerup", onDragEnd);
window.addEventListener("pointercancel", onDragEnd);

type Point = {
  x: number;
  y: number;
};

const getDistance = (p1: Point, p2?: Point) => {
  if (!p2) return 0;

  const x = Math.pow(p1.x - p2.x, 2);
  const y = Math.pow(p1.y - p2.y, 2);

  return Math.sqrt(x + y);
};
//  Touch Events
function onTouchStart(event: TouchEvent) {
  const touches = event.touches;
  const firstTouch = touches[0];
  const secondTouch = touches[1];

  previousDistance = getDistance(
    { x: firstTouch.clientX, y: firstTouch.clientY },
    secondTouch ? { x: secondTouch.clientX, y: secondTouch.clientY } : undefined
  );
}

function onTouchMove(event: TouchEvent) {
  const touches = event.targetTouches;

  if (touches.length === 2) {
    const firstTouch = touches[0];
    const secondTouch = touches[1];

    const currentHeight = dragElement.clientHeight;
    const currentWidth = dragElement.clientWidth;

    const distance = getDistance(
      { x: firstTouch.clientX, y: firstTouch.clientY },
      { x: secondTouch.clientX, y: secondTouch.clientY }
    );

    if (previousDistance !== null) {
      if (distance > previousDistance) {
        const newWidth = currentWidth + 1;
        const newHeight = currentHeight + 1;
        dragElement.style.width = `${newWidth}px`;
        dragElement.style.height = `${newHeight}px`;
        dragElement.innerHTML = `${newWidth}x${newHeight}`;
      } else if (distance < previousDistance) {
        const newWidth = Math.max(
          currentWidth - 1,
          MIN_SIZE,
          quarterInitialWidth
        );
        const newHeight = Math.max(
          currentHeight - 1,
          MIN_SIZE,
          quarterInitialHeight
        );

        dragElement.style.width = `${newWidth}px`;
        dragElement.style.height = `${newHeight}px`;
        dragElement.innerHTML = `${newWidth}x${newHeight}`;
      }
    }

    previousDistance = distance;
  }
}

window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchmove", onTouchMove);
