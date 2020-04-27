package org.effectively.dataObjects;

public class Task {
    Integer id;
    String text;
    Integer state;
    Integer position;

    public Task(Integer id, String text, Integer state, Integer position) {
        this.id = id;
        this.text = text;
        this.state = state;
        this.position = position;
    }
}
