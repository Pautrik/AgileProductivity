package org.effectively.dataObjects;

/**
 * The specification for a Project object
 */

class Project {
    private String name;
    private boolean active;

    Project(String name, boolean active){
        this.name = name;
        this.active = active;
    }

    String getName() {
        return name;
    }

    boolean isActive() {
        return active;
    }
}
