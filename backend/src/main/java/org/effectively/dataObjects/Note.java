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
    @SerializedName("description")
    @Expose
    private String description;


    public Note(Integer id, Integer position, String description) {
        this.id = id;
        this.position = position;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public Integer getPosition() {
        return position;
    }

    public String getDescription() {
        return description;
    }
}
