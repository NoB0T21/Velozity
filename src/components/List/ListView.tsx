import { useRef, useState, useEffect } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import {ListRow} from "./ListRow";
import type { Task } from "../../utils/type";

const ROW_HEIGHT = 72;
const BUFFER = 5;

export default function ListView({ tasks }: { tasks: Task[] }) {
  const { sort } = useTaskStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const priorityOrder = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sort.field) return 0;

    let result = 0;

    if (sort.field === "title") {
      result = a.title.localeCompare(b.title);
    }

    if (sort.field === "priority") {
      result = priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sort.field === "dueDate") {
      result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    return sort.order === "asc" ? result : -result;
  });

  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
  const start = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER
  );

  const end = Math.min(
    sortedTasks.length,
    start + visibleCount + BUFFER * 2
  );

  const visible = sortedTasks.slice(start, end);

  return (
    <div className="h-[calc(100vh-120px)] w-full px-3">
      <div
        ref={containerRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="h-full w-full overflow-auto 
        bg-background border border-border rounded-xl"
      >
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No tasks found
          </div>
        )}

        <div
          style={{
            height: sortedTasks.length * ROW_HEIGHT,
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translateY(${start * ROW_HEIGHT}px)`,
            }}
            className="w-full px-2 md:px-4 flex flex-col gap-2"
          >
            {visible.map((task) => (
              <div
                key={task.id}
                style={{ height: ROW_HEIGHT }}
              >
                <ListRow task={task} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}