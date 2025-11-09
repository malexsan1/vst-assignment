import { INCREASE_STEP, MIN_SIZE } from "./constants";
import { getBounds, moveElement, getDistance } from "./helpers";
import { type DragState } from "./types";

const container = document.getElementById("app")!;
const dragElement = document.getElementById("drag-element")!;
const resetButton = document.getElementById("reset-button")!;

let hasMoved = false;
const quarterInitialWidth: number = dragElement.clientWidth / 4;
const quarterInitialHeight: number = dragElement.clientHeight / 4;

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

  dragElement.style.left = `${
    (containerRect.width - dragElementRect.width) / 2
  }px`;
  dragElement.style.top = `${
    (containerRect.height - dragElementRect.height) / 2
  }px`;
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
  } else {
    moveElement({ dragElement, container });
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
  ) {
    return;
  }

  moveElement({
    dragElement,
    container,
    left:
      currentDragState.startLeft +
      event.clientX -
      currentDragState.startPointerX,
    top:
      currentDragState.startTop +
      event.clientY -
      currentDragState.startPointerY,
  });
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
        const { maxHeight, maxWidth } = getBounds(container, dragElement);

        const newWidth = Math.min(maxWidth, currentWidth + INCREASE_STEP);
        const newHeight = Math.min(maxHeight, currentHeight + INCREASE_STEP);

        dragElement.style.width = `${newWidth}px`;
        dragElement.style.height = `${newHeight}px`;
        dragElement.innerHTML = `${newWidth}x${newHeight}`;
      } else if (distance < previousDistance) {
        const newWidth = Math.max(
          currentWidth - INCREASE_STEP,
          MIN_SIZE,
          quarterInitialWidth
        );
        const newHeight = Math.max(
          currentHeight - INCREASE_STEP,
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

document.defaultView!.addEventListener("resize", handleWindowResize);

resetButton.addEventListener("click", handleReset);

dragElement.addEventListener("pointermove", onMove);
dragElement.addEventListener("pointerup", onDragEnd);
dragElement.addEventListener("pointercancel", onDragEnd);

dragElement.addEventListener("pointerdown", onDragStart);
dragElement.addEventListener("touchstart", onTouchStart);
dragElement.addEventListener("touchmove", onTouchMove);
