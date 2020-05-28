package org.effectively.dataObjects;

/**
 * The specification for a TimelineTask object
 */

class TimelineTask extends Task {
    private String endDate;
    private Project project;

    TimelineTask(Integer id, String text, Integer state, Integer position, String date, String endDate, String projectname) {
        super(id, text, state, position, date);
        this.endDate = endDate;
        this.project = new Project(projectname, true);
    }

    String getEndDate() {
        return endDate;
    }

    String getProjectName() {
        return project.getName();
    }
}
