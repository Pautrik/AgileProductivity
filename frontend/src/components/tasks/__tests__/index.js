import React from "react";
import { render } from "@testing-library/react";

import Task from "../";

const taskText = "TestTestTest";

const renderTask = (status = 1) => render(<Task status={status} taskText={taskText}></Task>);

describe("<Task/>", () => {
    it("Renders taskText", () => {
        const { getByText } = renderTask();
        expect(getByText(taskText)).toBeInTheDocument();
    });

    it("Renders X button", () => {
        const { getByText } = renderTask();
        expect(getByText("X", { exact: false })).toBeInTheDocument();
    });

    it("Renders 'Start' button", () => {
        const { getByText } = renderTask(1);
        expect(getByText("Start", { exact: false })).toBeInTheDocument();
    });

    it("Renders 'Done' button", () => {
        const { getByText } = renderTask(2);
        expect(getByText("Done", { exact: false })).toBeInTheDocument();
    });

    it("Renders 'Archive' button", () => {
        const { getByText } = renderTask(3);
        expect(getByText("Archive", { exact: false })).toBeInTheDocument();
    });
});