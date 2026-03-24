import { useRef, useCallback } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Status } from '../utils/type';

interface DragState {
  taskId: string | null;
  sourceStatus: Status | null;
  ghostEl: HTMLElement | null;
  placeholderEl: HTMLElement | null;
  originX: number;
  originY: number;
  currentDropZone: string | null;
}

export function useDragAndDrop() {
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const drag = useRef<DragState>({
    taskId: null,
    sourceStatus: null,
    ghostEl: null,
    placeholderEl: null,
    originX: 0,
    originY: 0,
    currentDropZone: null,
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, taskId: string, status: Status) => {
      e.currentTarget.setPointerCapture(e.pointerId);

      const cardEl = e.currentTarget;
      const rect = cardEl.getBoundingClientRect();
      const ghost = cardEl.cloneNode(true) as HTMLElement;
      ghost.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: ${rect.width}px;
        left: ${rect.left}px;
        top: ${rect.top}px;
        opacity: 0.85;
        box-shadow: 0 16px 40px rgba(0,0,0,0.25);
        transform: rotate(2deg) scale(1.02);
        transition: transform 0.1s ease;
      `;
      document.body.appendChild(ghost);

      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        height: ${rect.height}px;
        border: 2px dashed hsl(var(--border));
        border-radius: 8px;
        background: hsl(var(--muted) / 0.3);
        margin: 4px 0;
        pointer-events: none;
      `;

      cardEl.parentNode?.insertBefore(placeholder, cardEl);
      cardEl.style.display = 'none';

      drag.current = {
        taskId,
        sourceStatus: status,
        ghostEl: ghost,
        placeholderEl: placeholder,
        originX: rect.left,
        originY: rect.top,
        currentDropZone: null,
      };
    },
    []
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const { ghostEl } = drag.current;
    if (!ghostEl) return;

    ghostEl.style.left = `${e.clientX - 60}px`;
    ghostEl.style.top = `${e.clientY - 20}px`;

    ghostEl.style.display = 'none';
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    ghostEl.style.display = '';

    const dropZone = elementBelow?.closest('[data-column]') as HTMLElement | null;
    const newZone = dropZone?.dataset.column ?? null;

    if (newZone !== drag.current.currentDropZone) {
      if (drag.current.currentDropZone) {
        document
          .querySelector(`[data-column="${drag.current.currentDropZone}"]`)
          ?.classList.remove('drag-over');
      }
      if (newZone) {
        dropZone?.classList.add('drag-over');
      }
      drag.current.currentDropZone = newZone;
    }
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const { taskId, ghostEl, currentDropZone, originX, originY } = drag.current;
      if (!taskId || !ghostEl) return;

      const validStatuses: Status[] = ['todo', 'inprogress', 'review', 'done'];
      const isValidDrop = currentDropZone && validStatuses.includes(currentDropZone as Status);

      if (isValidDrop) {
        updateTaskStatus(taskId, currentDropZone as Status);
        cleanup(e.currentTarget);
      } else {
        ghostEl.style.transition = 'left 0.3s ease, top 0.3s ease, opacity 0.3s ease';
        ghostEl.style.left = `${originX}px`;
        ghostEl.style.top = `${originY}px`;
        ghostEl.style.opacity = '0';
        ghostEl.addEventListener('transitionend', () => cleanup(e.currentTarget), { once: true });
      }

      if (currentDropZone) {
        document.querySelector(`[data-column="${currentDropZone}"]`)?.classList.remove('drag-over');
      }
    },
    [updateTaskStatus]
  );

  function cleanup(cardEl: HTMLElement) {
    const { ghostEl, placeholderEl } = drag.current;

    ghostEl?.remove();
    placeholderEl?.remove();

    cardEl.style.display = '';

    drag.current = {
      taskId: null,
      sourceStatus: null,
      ghostEl: null,
      placeholderEl: null,
      originX: 0,
      originY: 0,
      currentDropZone: null,
    };
  }

  return { onPointerDown, onPointerMove, onPointerUp };
}