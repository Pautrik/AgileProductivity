package org.effectively.dataObjects;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * The specification for a Task object
 */

class Task {
    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("text")
    @Expose
    private String text;
    @SerializedName("state")
    @Expose
    private Integer state;
    @SerializedName("position")
    @Expose
    private Integer position;
    @SerializedName("date")
    @Expose
    private String date;


    Task(Integer id, String text, Integer state, Integer position, String date) {
        this.id = id;
        this.text = text;
        this.state = state;
        this.position = position;
        this.date = date;
    }

    Integer getId() {
        return id;
    }

    String getText() {
        return text;
    }

    Integer getState() {
        return state;
    }

    Integer getPosition() {
        return position;
    }

    String getDate() {
        return date;
    }
}
