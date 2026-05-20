export type Todo = {
  id: number;
  text: string;
  completed: boolean; // completed = archived
};

export type TodoFilter = "active" | "all" | "completed";
