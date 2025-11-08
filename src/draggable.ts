const container = document.getElementById("app")!;
const dragElement = document.getElementById("drag-element")!;
const resetButton = document.getElementById("reset-button")!;

let leftPosition: string | number = "50%";
let topPosition: string | number = "50%";
let hasMoved = false;

// drag state
type DragState = {
  isDragging: boolean;
  activePointerId: number | null;
  startPointerX: number;
  startPointerY: number;
  startLeft: number;
  startTop: number;
};

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
