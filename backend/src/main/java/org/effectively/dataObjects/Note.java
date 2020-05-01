package org.effectively.dataObjects;

import java.util.ArrayList;
import java.util.List;

class Note{
    List<Task> Task = new ArrayList<>();

    public Note(List<org.effectively.dataObjects.Task> task) {
        Task = task;
    }
}
