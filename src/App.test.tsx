import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.tsx";

describe("App integration", (): void => {
  it("runs full todo lifecycle through UI", async (): Promise<void> => {
    localStorage.clear();
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByText("No todos to show")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "Investigate weird edge case{enter}");

    expect(screen.getByText("Investigate weird edge case")).toBeInTheDocument();
    expect(screen.getByText("Items left: 1")).toBeInTheDocument();

    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    if (!firstCheckbox) {
      throw new Error("Expected at least one checkbox");
    }
    await user.click(firstCheckbox);

    // Default filter is active, so completed item disappears from current view.
    expect(screen.getByText("No todos to show")).toBeInTheDocument();
    expect(screen.getByText("Items left: 0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getByText("Investigate weird edge case")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    const editInput = screen.getByDisplayValue("Investigate weird edge case");
    await user.clear(editInput);
    await user.type(editInput, "Edited todo text");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Edited todo text")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("No todos to show")).toBeInTheDocument();
  });

  it("clears only completed todos in one action", async (): Promise<void> => {
    localStorage.clear();
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "todo one{enter}");
    await user.type(input, "todo two{enter}");
    await user.type(input, "todo three{enter}");

    const checkboxes = screen.getAllByRole("checkbox");
    const first = checkboxes[0];
    const second = checkboxes[1];
    if (!first || !second) {
      throw new Error("Expected at least two checkboxes");
    }
    await user.click(first);
    await user.click(second);

    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    await user.click(screen.getByRole("button", { name: "All" }));

    expect(screen.queryByText("todo one")).not.toBeInTheDocument();
    expect(screen.queryByText("todo two")).not.toBeInTheDocument();
    expect(screen.getByText("todo three")).toBeInTheDocument();
    expect(screen.getByText("Items left: 1")).toBeInTheDocument();
  });

  it("shows inline validation for empty todo submit", async (): Promise<void> => {
    localStorage.clear();
    const user = userEvent.setup();

    render(<App />);
    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "   {enter}");

    expect(screen.getByText("Todo text cannot be empty")).toBeInTheDocument();
    expect(screen.getByText("No todos to show")).toBeInTheDocument();
  });
});
