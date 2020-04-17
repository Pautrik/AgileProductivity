package org.effectively.dataObjects;

import java.util.ArrayList;

public class Day {
    String date;
    ArrayList<Task> tasks;

    public Day(String date, ArrayList<org.effectively.dataObjects.Task> tasks) {
        this.date = date;
        this.tasks = tasks;
    }
}
