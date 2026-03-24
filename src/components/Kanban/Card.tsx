import type { Task } from "../../utils/type";
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { memo } from "react";


const Card = memo(({ task }: { task: Task }) => {
  const { onPointerDown, onPointerMove, onPointerUp } = useDragAndDrop();
  const due = new Date(task.dueDate);
  const today = new Date();

  const isOverdue = due < today;
  const isToday = due.toDateString() === today.toDateString();
  return (
    <div 
      onPointerDown={(e) => onPointerDown(e, task.id, task.status)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="cursor-grab active:cursor-grabbing bg-card w-full p-3 rounded-md shadow-sm hover:shadow-md transition touch-none"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{task.title}</span>

        <span
          className={`text-xs px-2 py-1 rounded-full
            ${
              task.priority === "critical"
                ? "bg-red-100 text-red-600"
                : task.priority === "high"
                ? "bg-orange-100 text-orange-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="px-1 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-xs">
            {task.assignee}
          </div>
        </div>

        <span
          className={`text-xs ${
            isOverdue
              ? "text-destructive"
              : isToday
              ? "text-warning"
              : "text-muted-foreground"
          }`}
        >
          {due.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  )
})

export default Card;