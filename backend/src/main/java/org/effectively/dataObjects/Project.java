package org.effectively.dataObjects;

/**
 * The specification for a Project object
 */

class Project {
    private String name;
    private boolean active;

    public Project(String name, boolean active){
        this.name = name;
        this.active = active;
    }

    public String getName() {
        return name;
    }

    public boolean isActive() {
        return active;
    }
}
