package org.effectively;

import com.google.gson.Gson;
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
    private static final String url = "jdbc:postgresql://pautrik.ddns.net/kangaroo";
    private static final String user = "pi";
    private static String password = "";
    private static Gson gson = new Gson();
    private static Connection conn;


    public static String requestData(Pair<String, String> param){

        List <Object> reply = new ArrayList<>();

        if(param.getFirst().equals("weekGet")) {
            //TODO replace dummy data with call to database

            //date from param.getSecond() needs to be on format yyyyMMdd
            reply = getWeekByNumber(param.getSecond());
        }
        else if(param.getFirst().equals("weekPost")){

            //date from param.getSecond() needs to be on format yyyyww
            addTask(param.getSecond());
        }
        else if(param.getFirst().equals("timeline")) {
            //TODO add java classes for timeline to dataObjects
            //TODO send dummy reply
        }

        else if(param.getFirst().equals("notes")) {
            //TODO add java classes for timeline to dataObjects
            //TODO send dummy reply
        }


        List<String> jsonArray = new ArrayList<>();
        for (Object object : reply){
            String json = gson.toJson(object);
            jsonArray.add(json);
        }
        return jsonArray.toString();
    }
    private static List<Object> getWeekByNumber(String YearAndWeek){
        List<Day> week = new ArrayList<>();
        try {
            Calendar c = Calendar.getInstance();
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
        List<Object> returnData = new ArrayList<>();
        Collections.addAll(returnData,week);

        return returnData;
    }

    /*private static List<Object> getWeekByDate(String date){ //TODO use later when needed or for timeline
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

    private static  void addTask(String task) {
        Task newTask = gson.fromJson(task,Task.class);

        PreparedStatement stmt = null;
        try {
            stmt = conn.prepareStatement("INSERT INTO Tasks VALUES(DEFAULT,?,?,?,?)");
            stmt.setInt(1,newTask.getPosition());
            stmt.setString(2,newTask.getText());
            stmt.setString(3,newTask.getDate());
            stmt.setInt(4, newTask.getState());

            stmt.executeUpdate();

        } catch (SQLException s) {
            s.printStackTrace();
            //TODO handle cases where task is already in database
        }

    }

    public static Connection connectToDatabase() throws AuthenticationException{
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);
        try {
            conn = DriverManager.getConnection(url, props);
        } catch (SQLException e){
            throw new AuthenticationException();
        }

        return conn;
    }
    //Använd systemvariabler istället
    public static void setPassword(String newPassword){
        password = newPassword;
    }
}
