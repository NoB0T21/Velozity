import { useTaskStore } from "../../store/useTaskStore";

const DAY_WIDTH = 28;
const ROW_HEIGHT = 44;

export default function Timeline() {
  const tasks = useTaskStore((s) => s.tasks);
  const today = new Date();
  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const getDayIndex = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const m = new Date(monthStart);
    m.setHours(0, 0, 0, 0);

    return Math.floor(
      (d.getTime() - m.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col bg-background text-foreground border border-border rounded-2xl overflow-hidden">
      <div className="flex sticky top-0 z-20 bg-[hsl(var(--glass-bg)/0.7)] backdrop-blur-xl border-b border-border">
        <div className="w-48 shrink-0 p-3 font-semibold text-sm border-r border-border">
          Task
        </div>

        <div className="flex">
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div
              key={i}
              style={{ width: DAY_WIDTH }}
              className="text-xs text-center border-l border-border text-muted-foreground py-2"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background">
        <div className="flex">
          <div className="w-48 shrink-0" />

          <div
            style={{ width: daysInMonth * DAY_WIDTH }}
            className="relative"
          >
            {/* GRID LINES */}
            {Array.from({ length: daysInMonth }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-border/40"
                style={{ left: i * DAY_WIDTH }}
              />
            ))}

            {/* TODAY LINE */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-primary z-20 shadow-[0_0_10px_hsl(var(--primary))]"
              style={{
                left:
                  Math.max(0, getDayIndex(today)) * DAY_WIDTH,
              }}
            />

            {/* TASK ROWS */}
            {tasks.map((task) => {
              const startDate = new Date(
                task.startDate || task.dueDate
              );
              const endDate = new Date(task.dueDate);

              const startIndex = Math.max(
                0,
                getDayIndex(startDate)
              );
              const endIndex = Math.min(
                daysInMonth - 1,
                getDayIndex(endDate)
              );

              const left = startIndex * DAY_WIDTH;

              const width = Math.max(
                DAY_WIDTH,
                (endIndex - startIndex + 1) * DAY_WIDTH
              );

              const color =
                task.priority === "critical"
                  ? "bg-destructive"
                  : task.priority === "high"
                  ? "bg-warning"
                  : task.priority === "medium"
                  ? "bg-accent"
                  : "bg-success";

              return (
                <div
                  key={task.id}
                  className="flex items-center border-b border-border hover:bg-muted/40 transition"
                  style={{ height: ROW_HEIGHT }}
                >
                  <div className="w-48 px-3 text-sm truncate text-muted-foreground">
                    {task.title}
                  </div>

                  <div className="relative flex-1">
                    <div
                      className={`absolute h-6 rounded-lg ${color} text-xs text-white px-2 flex items-center shadow-md hover:scale-[1.03] transition-all cursor-pointer`}
                      style={{
                        left,
                        width,
                      }}
                      title={`${task.title} | Due: ${task.dueDate}`}
                    >
                      {task.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}