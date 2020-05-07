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
    private String context;

    public DatabaseHandler(String DBpassword, String context) throws AuthenticationException{
        connectToDatabase(DBpassword);
        this.context= context;
    }


    /**
     *
     * @param param, a Pair of key (requesttype) and value
     * @return If GET-request a reply in the form of an JSONarray of objects
     *         If POST-request an empty array
     *         If DELETE-request and empty array
     */
    public String requestData(Pair<String, String> param){ //TODO send error reply if request could not be handled?

        List <Object> reply = new ArrayList<>();

        if(param.getFirst().equals("Get")) {
            if (context.equals("week")){
                reply = getWeekByNumber(param.getSecond());
            }
            else if (context.equals("timeline")){
                String [] valueParameters = param.getSecond().split("&");

                if (valueParameters.length >= 3){
                    String [] projectnames = Arrays.copyOfRange(valueParameters, 0, valueParameters.length - 2);
                    reply = getTimeLine(projectnames, valueParameters[valueParameters.length-2], valueParameters[valueParameters.length-1]);
                }
            }
            else if (context.equals("note")){
                reply = getNotes();
            }
        }
        else if(param.getFirst().equals("Post")){
            addObject(param.getSecond(), context);
        }
        else if(param.getFirst().equals("Delete")){
            removeObject(param.getSecond(), context);
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
     * @return an Object list of all the Notes in the database
     */
    private List<Object> getNotes(){
        PreparedStatement stmt;
        List<Note> notes = new ArrayList<>();

        try{
            stmt = conn.prepareStatement("SELECT * FROM Notes");

            ResultSet note = stmt.executeQuery();
            while(note.next()){
                Note newNote = new Note(note.getInt(1), note.getInt(2), note.getString(3));
                notes.add(newNote);
            }
        } catch (SQLException s) {
            s.printStackTrace();
        }

        return asObjectArray(notes);
    }



    /**
     *
     * @param object, the JSON of either a Week, Timeline or Note
     * @param viewname, the name of the view from which the task is to be removed
     */

    private void addObject(String object, String viewname) {
        PreparedStatement stmt;

        try{
            if (viewname.equals("week")) {
                Task newTask = gson.fromJson(object, Task.class);
                stmt = conn.prepareStatement("INSERT INTO Tasks VALUES(DEFAULT,?,?,?,?)");
                stmt.setInt(1, newTask.getPosition());
                stmt.setString(2, newTask.getText());
                stmt.setString(3, newTask.getDate());
                stmt.setInt(4, newTask.getState());

                stmt.executeUpdate();
            }
            else if (viewname.equals("timeline")){
                TimelineTask newTask = gson.fromJson(object,TimelineTask.class);
                stmt = conn.prepareStatement("INSERT INTO TimelineTasks VALUES(DEFAULT,?,?,?,?,?,?)");
                stmt.setInt(1,newTask.getPosition());
                stmt.setString(2,newTask.getText());
                stmt.setString(3,newTask.getDate());
                stmt.setString(4,newTask.getEndDate());
                stmt.setInt(5, newTask.getState());
                stmt.setString(6, newTask.getProjectName());

                stmt.executeUpdate();
            }
            else if(viewname.equals("note")){
                Note newNote = gson.fromJson(object, Note.class);
                stmt = conn.prepareStatement("INSERT INTO Notes VALUES(DEFAULT,?,?)");
                stmt.setInt(1, newNote.getPosition());
                stmt.setString(2, newNote.getDescription());

                stmt.executeUpdate();
            }
        } catch (SQLException s) {
                s.printStackTrace();
                //TODO handle cases where task is already in database
        }

    }

    /**
     *
     * @param object, the JSON of either a Week, Timeline or Note
     * @param viewname, the name of the view from which the task is to be removed
     */

    private void removeObject(String object, String viewname){
        PreparedStatement stmt;

        try {
            if (viewname.equals("week")){
                stmt = conn.prepareStatement("DELETE FROM Tasks WHERE ID=?");
                stmt.setInt(1,Integer.parseInt(object));

                stmt.executeUpdate();
            }
            else if (viewname.equals("timeline")){
                stmt = conn.prepareStatement("DELETE FROM TimelineTasks WHERE ID=?");
                stmt.setInt(1,Integer.parseInt(object));

                stmt.executeUpdate();
            }
            else if (viewname.equals("note")){
                stmt = conn.prepareStatement("DELETE FROM Notes WHERE ID=?");
                stmt.setInt(1,Integer.parseInt(object));

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
