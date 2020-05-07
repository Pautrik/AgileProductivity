package org.effectively.dataObjects;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

class Note{
    @SerializedName("id")
    @Expose
    Integer id;
    @SerializedName("position")
    @Expose
    Integer position;
    @SerializedName("description")
    @Expose
    String description;


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
