package org.effectively.dataObjects;

import java.util.List;

class Day {
    private String date;
    private List<Task> tasks;

    public Day(String date, List<org.effectively.dataObjects.Task> tasks) {
        this.date = date;
        this.tasks = tasks;
    }

    public String getDate() {
        return date;
    }

    public void addTask(Task task) {
        tasks.add(task);
    }

    public List<Task> getTasks() {
        return tasks;
    }
}
