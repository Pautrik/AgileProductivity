package org.effectively.dataObjects;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

class Note{
    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("position")
    @Expose
    private Integer position;
    @SerializedName("text")
    @Expose
    private String text;


    public Note(Integer id, Integer position, String text) {
        this.id = id;
        this.position = position;
        this.text = text;//rename to text
    }

    public Integer getId() {
        return id;
    }

    public Integer getPosition() {
        return position;
    }

    public String getText() {
        return text;
    }
}
