import { useTaskStore } from "../store/useTaskStore";

interface Props {
  onViewChange: (view: string) => void;
  view: string;
  search: string;
  setSearch: (val: string) => void;
}

export default function Header({
  onViewChange,
  view,
  search,
  setSearch,
}: Props) {
  const { filters, setFilters } = useTaskStore();

  const toggle = (type: "status" | "priority", value: string) => {
    const current = filters[type];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilters({ [type]: updated });
  };

  const clearFilters = () => {
    setFilters({ status: [], priority: [] });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 p-3 sticky top-0 z-20 bg-[hsl(var(--glass-bg)/0.7)] backdrop-blur-xl border-b border-border">
      <div className="flex gap-2">
        {["kanban", "list", "timeline"].map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-3 py-1 rounded-lg text-sm transition ${view === v ? "bg-primary text-primary-foreground": "bg-secondary text-foreground hover:bg-muted"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="px-3 py-1.5 rounded-lg bg-secondary border border-border outline-none text-sm w-full md:w-60"
        />

        <div className="flex flex-wrap gap-1">
          {["todo", "inprogress", "review", "done"].map((s) => (
            <button
              key={s}
              onClick={() => toggle("status", s)}
              className={`px-2 py-1 rounded text-xs border transition
                ${
                  filters.status.includes(s)
                    ? "bg-primary text-white"
                    : "bg-secondary"
                }`}
            >
              {s}
            </button>
          ))}

          {["low", "medium", "high", "critical"].map((p) => (
            <button
              key={p}
              onClick={() => toggle("priority", p)}
              className={`px-2 py-1 rounded text-xs border transition
                ${
                  filters.priority.includes(p)
                    ? "bg-primary text-white"
                    : "bg-secondary"
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        {(filters.status.length > 0 ||
          filters.priority.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-xs text-destructive underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}