import Card from "./Card";
import type { Task } from "../../utils/type";

const columns = ["todo", "inprogress", "review", "done"];

export default function Kanban({ tasks }: { tasks: Task[] }) {

  const grouped = columns.map((col) => ({
    col,
    items: tasks.filter((t) => t.status === col),
  }));

  return (
    <div className="h-[calc(100vh-120px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-3">
      {grouped.map(({ col, items }) => (
        <div
          key={col}
          data-column={col}
          className="flex flex-col bg-[hsl(var(--glass-bg)/0.6)] backdrop-blur-xl border border-border rounded-xl overflow-hidden transition-colors"
        >
          <div className="p-3 border-b border-border flex justify-between items-center bg-background/40 backdrop-blur">
            <h2 className="capitalize text-sm text-muted-foreground font-semibold">
              {col}
            </h2>
            <span className="text-xs text-muted-foreground">
              count: {items.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {items.length > 0 ? (
              items.map((task) => (
                <Card key={task.id} task={task} />
              ))
            ) : (
              <div className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}