package org.effectively.dataObjects;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

/**
 * The specification for a Note object
 */

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


    Note(Integer id, Integer position, String text) {
        this.id = id;
        this.position = position;
        this.text = text;//rename to text
    }

    Integer getId() {
        return id;
    }

    Integer getPosition() {
        return position;
    }

    String getText() {
        return text;
    }
}
