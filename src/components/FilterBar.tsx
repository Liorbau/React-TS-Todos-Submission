import type { JSX } from "react";
import type { TodoFilter } from "../types/todo.ts";

type FilterBarProps = {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
};

const buttonClass = (isActive: boolean): string =>
  isActive ? "segmented__button is-active" : "segmented__button";

export const FilterBar = ({
  onFilterChange,
  filter,
}: FilterBarProps): JSX.Element => {
  const isActive = (buttonFilter: TodoFilter): boolean =>
    filter === buttonFilter;
  const handleActiveClick = (): void => {
    onFilterChange("active");
  };
  const handleCompletedClick = (): void => {
    onFilterChange("completed");
  };
  const handleAllClick = (): void => {
    onFilterChange("all");
  };

  return (
    <div className="segmented" role="group" aria-label="Filter todos">
      <button
        className={buttonClass(isActive("active"))}
        onClick={handleActiveClick}
      >
        Active
      </button>
      <button
        className={buttonClass(isActive("completed"))}
        onClick={handleCompletedClick}
      >
        Completed
      </button>
      <button className={buttonClass(isActive("all"))} onClick={handleAllClick}>
        All
      </button>
    </div>
  );
};
