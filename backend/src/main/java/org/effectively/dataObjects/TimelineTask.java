package org.effectively.dataObjects;

/**
 * The specification for a TimelineTask object
 */

class TimelineTask extends Task {
    private String endDate;
    private Project project;

    public TimelineTask(Integer id, String text, Integer state, Integer position, String date, String endDate, String projectname) {
        super(id, text, state, position, date);
        this.endDate = endDate;
        this.project = new Project(projectname, true);
    }

    public String getEndDate() {
        return endDate;
    }

    public String getProjectName() {
        return project.getName();
    }
}
