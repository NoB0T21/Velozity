import { create } from "zustand";
import type { Task } from "../utils/type";
import { setFiltersToURL } from "../utils/urlFilters";

interface FilterState {
  status: string[];
  priority: string[];
}

interface SortState {
  field: "title" | "priority" | "dueDate" | null;
  order: "asc" | "desc";
}

interface Store {
  tasks: Task[];
  filters: FilterState;
  sort: SortState;

  setTasks: (tasks: Task[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSort: (field: SortState["field"]) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
}

export const useTaskStore = create<Store>((set) => ({
  tasks: [],
  filters: { status: [], priority: [] },
  sort: { field: null, order: "asc" },
  setTasks: (tasks) => set({ tasks }),
  setFilters: (newFilters) =>
    set((state) => {
      const updated = { ...state.filters, ...newFilters };
      setFiltersToURL(updated);
      return { filters: updated };
    }),
  setSort: (field) =>
    set((state) => {
      let order: "asc" | "desc" = "asc";
      if (state.sort.field === field) order = state.sort.order === "asc" ? "desc" : "asc";
      return {
        sort: { field, order },
      };
    }),

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    })),
}));