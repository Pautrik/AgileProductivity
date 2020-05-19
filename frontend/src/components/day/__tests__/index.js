import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Day from "../index";

const testDayName = "TestTest Test";

// Autofills missing object parameters
const renderDay = ({
    dayName = testDayName,
    tasks = [],
    addTask = (() => null),
    deleteTask = (() => null) } = {}) => render(
        <Day
            dayName={dayName}
            tasks={tasks}
            addTask={addTask}
            deleteTask={deleteTask}
        />
    );

describe("<Day />", () => {
    it("Renders dayName", () => {
        const { getByText } = renderDay({ dayName: testDayName });
        expect(getByText(testDayName)).toBeInTheDocument();
    });

    describe("Addition of task:", () => {
        it("Renders add task button", () => {
            const { getByText } = renderDay();
            expect(getByText("+")).toBeInTheDocument();
        })

        it("Renders input area on plus click", () => {
            const { getByText, getByPlaceholderText } = renderDay();
            fireEvent.click(getByText("+"));
            expect(getByText("Submit", { exact: false })).toBeInTheDocument();
            expect(getByPlaceholderText("Enter task text")).toBeInTheDocument();
            expect(getByText("Cancel", { exact: false })).toBeInTheDocument();
        });

        it("Invokes add function on submit", () => {
            const addTaskCallback = jest.fn();
            const { getByText } = renderDay({ addTask: addTaskCallback });
            fireEvent.click(getByText("+"));
            fireEvent.click(getByText("Submit", { exact: false }));
            expect(addTaskCallback).toHaveBeenCalledTimes(1);
        });

        it("Cancel works correctly", () => {
            const { getByText } = renderDay();
            fireEvent.click(getByText("+"));
            fireEvent.click(getByText("Cancel", { exact: false }));
            expect(getByText("+")).toBeInTheDocument();
        });
    });
});