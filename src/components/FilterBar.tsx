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
  const filters: TodoFilter[] = ["active", "completed", "all"];
  const formatFilterLabel = (filterOption: TodoFilter): string => {
    return filterOption.charAt(0).toUpperCase() + filterOption.slice(1);
  };

  return (
    <div className="segmented" role="group" aria-label="Filter todos">
      {filters.map(
        (filterOption: TodoFilter): JSX.Element => (
          <button
            key={filterOption}
            className={buttonClass(filter === filterOption)}
            onClick={(): void => onFilterChange(filterOption)}
          >
            {formatFilterLabel(filterOption)}
          </button>
        ),
      )}
    </div>
  );
};
