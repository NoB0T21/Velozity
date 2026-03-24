export const getFiltersFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    status: params.get("status")?.split(",") || [],
    priority: params.get("priority")?.split(",") || [],
  };
};

export const setFiltersToURL = (filters: any) => {
  const params = new URLSearchParams();
  if (filters.status.length)params.set("status", filters.status.join(","));
  if (filters.priority.length)params.set("priority", filters.priority.join(","));
  window.history.pushState({}, "", `?${params.toString()}`);
};