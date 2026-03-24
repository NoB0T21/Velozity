import { useEffect, useMemo, useState, lazy, Suspense  } from "react";
import { generateTasks } from "./utils/generateTasks";
import { useTaskStore } from "./store/useTaskStore";
import Header from "./components/header";
import { getFiltersFromURL } from "./utils/urlFilters";
const KanbanView  = lazy(() => import('./components/Kanban/Kanban'));
const ListView    = lazy(() => import('./components/List/ListView'));
const TimelineView = lazy(() => import('./components/Timeline/Timeline'));

const INITIAL_TASKS = generateTasks(500);

export default function App() {
  const { setTasks, filters, tasks } = useTaskStore();
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTasks(INITIAL_TASKS);
    const urlFilters = getFiltersFromURL();
    useTaskStore.getState().setFilters(urlFilters);
  }, []);

  const filteredTasks = useMemo(() => {
  return tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}, [tasks, filters, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onViewChange={setView}
      view={view}
      search={search}
      setSearch={setSearch} />

      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted-foreground">Loading...</div>}>
        {view === "kanban" && <KanbanView tasks={filteredTasks} />}
        {view === "list" && <ListView tasks={filteredTasks} />}
        {view === "timeline" && <TimelineView/>}
      </Suspense>
    </div>
  );
}