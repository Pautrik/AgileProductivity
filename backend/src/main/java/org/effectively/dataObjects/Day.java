package org.effectively.dataObjects;

import java.util.List;

/**
 * The specification for a Day object
 */

class Day {
    private String date;
    private List<Task> tasks;

    Day(String date, List<org.effectively.dataObjects.Task> tasks) {
        this.date = date;
        this.tasks = tasks;
    }

    String getDate() {
        return date;
    }

    void addTask(Task task) {
        tasks.add(task);
    }

    List<Task> getTasks() {
        return tasks;
    }
}
