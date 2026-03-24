import type { Task } from "./type";

const statuses = ["todo", "inprogress", "review", "done"] as const;
const priorities = ["low", "medium", "high", "critical"] as const;

export const generateTasks = (count = 500): Task[] => {
  return Array.from({ length: count }).map((_, i) => {
    const start = new Date(
      Date.now() - Math.floor(Math.random() * 10) * 86400000
    );

    const due = new Date(
      start.getTime() +
        Math.floor(Math.random() * 15 + 1) * 86400000
    );

    return {
      id: String(i),
      title: `Task ${i}`,
      assignee: ["Aryan", "Nobot", "Aryannn", "NoB0T", "Goku", "F"][i % 6],
      status: statuses[i % 4],
      priority: priorities[i % 4],
      startDate: Math.random() > 0.2 ? start.toISOString() : undefined,
      dueDate: due.toISOString(),
    };
  });
};