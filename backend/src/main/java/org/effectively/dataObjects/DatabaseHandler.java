package org.effectively.dataObjects;

import com.google.gson.Gson;
import org.effectively.Pair;
import org.effectively.dataObjects.Day;
import org.effectively.dataObjects.Task;

import javax.naming.AuthenticationException;
import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.Date;

public class DatabaseHandler {
    private final String url = "jdbc:postgresql://pautrik.ddns.net/kangaroo";
    private final String user = "pi";
    private final Gson gson = new Gson();
    private Connection conn;

    public DatabaseHandler(String DBpassword) throws AuthenticationException{
        connectToDatabase(DBpassword);
    }


    /**
     *
     * @param param, a Pair of key and value
     * @return If GET-request a reply in the form of an JSONarray of objects
     *         If POST-request an empty array
     *         If DELETE-request and empty array
     */
    public String requestData(Pair<String, String> param){ //TODO send error reply if request could not be handled?

        List <Object> reply = new ArrayList<>();

        if(param.getFirst().equals("weekGet")) {
            reply = getWeekByNumber(param.getSecond());
        }
        else if(param.getFirst().equals("weekPost")){
            addTask(param.getSecond(), "week");
        }
        else if(param.getFirst().equals("weekDelete")){
            removeTask(param.getSecond(),"week");
        }
        else if(param.getFirst().equals("timelineGet")) {

            String [] valueParameters = param.getSecond().split("&");

            if (valueParameters.length >= 3){
                String [] projectnames = Arrays.copyOfRange(valueParameters, 0, valueParameters.length - 2);
                reply = getTimeLine(projectnames, valueParameters[valueParameters.length-2], valueParameters[valueParameters.length-1]);
            }

        }
        else if(param.getFirst().equals("timelinePost")) {
            addTask(param.getSecond(),"timeline");
        }
        else if(param.getFirst().equals("timelineDelete")) {
            removeTask(param.getSecond(),"timeline");
        }


        else if(param.getFirst().equals("notes")) {

        }


        List<String> jsonArray = new ArrayList<>();
        for (Object object : reply){
            String json = gson.toJson(object);
            jsonArray.add(json);
        }
        return jsonArray.toString();
    }

    /**
     *
     * @param YearAndWeek, the year and week on format yyyyww
     * @return A list of 7 Day objects in the given year and week
     */
    private List<Object> getWeekByNumber(String YearAndWeek){
        List<Day> week = new ArrayList<>();
        try {
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.valueOf(YearAndWeek.substring(0,4)));
            c.set(Calendar.WEEK_OF_YEAR, Integer.valueOf(YearAndWeek.substring(4)));
            c.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd", Locale.UK);
            for (int i = 0; i<7; i++){
                week.add(new Day(sdf.format(c.getTime()), new ArrayList<>()));
                c.add(Calendar.DATE, 1);
            }

            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM Tasks WHERE assignedDate BETWEEN ? and ?");
            stmt.setString(1, week.get(0).getDate());
            stmt.setString(2, week.get(6).getDate());
            ResultSet task = stmt.executeQuery();

            while(task.next()){
                Task newTask = new Task(task.getInt(1),task.getString(3),task.getInt(5), task.getInt(2),task.getString(4));//using position right now
                for (int i = 0; i<7; i++){
                    Day thisDay = week.get(i);
                    if (thisDay.getDate().equals(task.getString(4))){
                        thisDay.addTask(newTask);
                    }
                }
            }
        }
        catch(SQLException s){
            s.printStackTrace();
        }

        return asObjectArray(week);
    }

    /*private List<Object> getWeekByDate(String date){ //TODO use later when needed or for timeline
        List<Day> week = new ArrayList<>();

        try{
            String startDate = date;

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd", Locale.ENGLISH);
            Calendar c = Calendar.getInstance();
            c.setTime(sdf.parse(startDate));

            for (int i = 0; i<7; i++){
                week.add(new Day(sdf.format(c.getTime()), new ArrayList<>()));
                c.add(Calendar.DATE, 1);  // number of days to add
            }

            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM Tasks WHERE assignedDate BETWEEN ? and ?");
            stmt.setString(1, week.get(0).getDate());
            stmt.setString(2, week.get(6).getDate());
            ResultSet task = stmt.executeQuery();

            while(task.next()){
                Task newTask = new Task(task.getInt(1),task.getString(3),task.getInt(5), task.getInt(2),task.getString(4));//using position right now
                for (int i = 0; i<7; i++){
                    Day thisDay = week.get(i);
                    if (thisDay.getDate().equals(task.getString(4))){
                        thisDay.addTask(newTask);
                    }
                }
            }
        }
        catch(SQLException | ParseException s){
            s.printStackTrace();
        }

        List<Object> returnData = new ArrayList<>();
        Collections.addAll(returnData,week);

        return returnData;
    }*/

    /**
     *
     * @param task, the JSON of a Task
     * @param viewname, the name of the view from which the task is to be removed
     */

    private void addTask(String task, String viewname) {
        PreparedStatement stmt;

        try{
            if (viewname.equals("week")) {
                Task newTask = gson.fromJson(task, Task.class);
                stmt = conn.prepareStatement("INSERT INTO Tasks VALUES(DEFAULT,?,?,?,?)");
                stmt.setInt(1, newTask.getPosition());
                stmt.setString(2, newTask.getText());
                stmt.setString(3, newTask.getDate());
                stmt.setInt(4, newTask.getState());

                stmt.executeUpdate();
            }
            else if (viewname.equals("timeline")){
                TimelineTask newTask = gson.fromJson(task,TimelineTask.class);
                stmt = conn.prepareStatement("INSERT INTO TimelineTasks VALUES(DEFAULT,?,?,?,?,?,?)");
                stmt.setInt(1,newTask.getPosition());
                stmt.setString(2,newTask.getText());
                stmt.setString(3,newTask.getDate());
                stmt.setString(4,newTask.getEndDate());
                stmt.setInt(5, newTask.getState());
                stmt.setString(6, newTask.getProjectName());

                stmt.executeUpdate();
            }
        } catch (SQLException s) {
                s.printStackTrace();
                //TODO handle cases where task is already in database
        }

    }

    /**
     *
     * @param task, the id of task to be removed
     * @param viewname, the name of the view from which the task is to be removed
     */

    private void removeTask(String task, String viewname){
        PreparedStatement stmt;

        try {
            if (viewname.equals("week")){
                stmt = conn.prepareStatement("DELETE FROM Tasks WHERE ID=?");
                stmt.setInt(1,Integer.parseInt(task));

                stmt.executeUpdate();
            }
            else if (viewname.equals("timeline")){
                stmt = conn.prepareStatement("DELETE FROM TimelineTasks WHERE ID=?");
                stmt.setInt(1,Integer.parseInt(task));

                stmt.executeUpdate();
            }
        } catch (SQLException s) {
            s.printStackTrace();
        }
    }


    /**
     *
     * @param projectnames, TimelineTasks needs to be in these projects to be returned
     * @param startDate, earliest start date of returned TimelineTask
     * @param endDate, latest end date of returned TimelineTask
     * @return An Object list of TimelineTasks included in projectnames in the span startdate-enddate
     */
    private List<Object> getTimeLine(String [] projectnames, String startDate, String endDate){ //TODO allow to query by active or inactive
        PreparedStatement stmt;
        List<TimelineTask> timeline = new ArrayList<>();
        int startDateValue = Integer.valueOf(startDate);
        int endDateValue = Integer.valueOf(endDate);

        try{
            for (String projectname : projectnames){
                stmt = conn.prepareStatement("SELECT * FROM TimelineTasks WHERE (CAST(startDate AS INT) BETWEEN ? AND ?) AND (CAST(endDate AS INT) BETWEEN ? AND ?) AND (project = ?)");

                stmt.setInt(1, startDateValue);
                stmt.setInt(2, endDateValue);
                stmt.setInt(3, startDateValue);
                stmt.setInt(4, endDateValue);
                stmt.setString(5, projectname);
                ResultSet task = stmt.executeQuery();

                while(task.next()){
                    TimelineTask newTask = new TimelineTask(task.getInt(1),task.getString(3),task.getInt(6), task.getInt(2),task.getString(4),task.getString(5),task.getString(7));
                    timeline.add(newTask);
                }
            }

        }
        catch(SQLException s){
            s.printStackTrace();
        }

        return asObjectArray(timeline);
    }

    private List<Object> asObjectArray(Collection<?> collection){
        return new ArrayList<>(collection);
    }

    /**
     *
     * @param DBpassword, the password to the database
     * @throws AuthenticationException, if password is incorrect
     */
    private void connectToDatabase(String DBpassword) throws AuthenticationException{
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", DBpassword);
        try {
            conn = DriverManager.getConnection(url, props);
        } catch (SQLException e){
            throw new AuthenticationException();
        }
    }
}
