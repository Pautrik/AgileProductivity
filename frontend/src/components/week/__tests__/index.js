import React from "react";
import { render } from "@testing-library/react";

import fetch from "mockedFetch";

import Week from '../index';


describe("<Week />", () => {
    it("Renders", () => {
        
        const { container } = render(<Week />);
        expect(container).toBeInTheDocument();
    });
});

const mockWeek = [
    {
        "date": "20200416",
        "tasks": [
            {
                "text": "Do this 1.0",
                "state": 1,
                "position": 0
            },
            {
                "text": "Do this 1.1",
                "state": 1,
                "position": 1
            },
            {
                "text": "Do this 1.2",
                "state": 2,
                "position": 2
            }
        ]
    },
    {
        "date": "20200417",
        "tasks": [
            {
                "text": "Do this 2",
                "state": 3,
                "position": 0
            }
        ]
    },
    {
        "date": "20200418",
        "tasks": [
            {
                "text": "Do this 3",
                "state": 2,
                "position": 0
            }
        ]
    },
    {
        "date": "20200419",
        "tasks": [
            {
                "text": "Do this 4",
                "state": 3,
                "position": 0
            }
        ]
    },
    {
        "date": "20200420",
        "tasks": [
            {
                "text": "Do this 5",
                "state": 1,
                "position": 0
            }
        ]
    },
    {
        "date": "20200421",
        "tasks": [
            {
                "text": "Do this 6",
                "state": 1,
                "position": 0
            }
        ]
    },
    {
        "date": "20200422",
        "tasks": [
            {
                "text": "Do this 7",
                "state": 2,
                "position": 0
            }
        ]
    }
];