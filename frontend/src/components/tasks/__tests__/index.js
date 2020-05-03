import React from "react";
import { render } from "@testing-library/react";

import Task from "../";

const taskText = "TestTestTest";


describe("<Task/>", () => {
    it("Renders taskText", () => {
        const { getByText } = render(<Task taskText={taskText}></Task>);
        expect(getByText(taskText)).toBeInTheDocument();
    });

    it("Renders done button", () => {
        const { getByText } = render(<Task taskText={taskText}></Task>);
        expect(getByText("Done", { exact: false })).toBeInTheDocument();
    });
});