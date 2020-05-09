package org.effectively.dataObjects;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

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


    public Task(Integer id, String text, Integer state, Integer position, String date) {
        this.id = id;
        this.text = text;
        this.state = state;
        this.position = position;
        this.date = date;
    }

    public Integer getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Integer getState() {
        return state;
    }

    public Integer getPosition() {
        return position;
    }
    public String getDate() {
        return date;
    }
}
