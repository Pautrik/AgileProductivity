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


    //Dummy data
    //private static List<Day> data = new ArrayList<>();

    public static String requestData(Pair<String, String> param){

        //remove last request
        //data.clear();

        List <Object> reply = new ArrayList<>();

        if(param.getFirst().equals("week")) {
            //TODO replace dummy data with call to database

            //date from param.getSecond() needs to be on format yyyyMMdd
            reply = getWeek(param.getSecond());

            /*//initiate dummy data
            List<Task> tasks = new ArrayList<>();
            tasks.add(new Task("do that", 1));
            Day day = new Day("20200304", tasks);
            data.add(day);

            List<Task> tasks2 = new ArrayList<>();
            tasks2.add(new Task("do this", 2));
            Day day2 = new Day("20200305", tasks2);
            data.add(day2);
            //*/
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

    private static List<Object> getWeek(String date){
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
                Task newTask = new Task(task.getInt(1),task.getString(3),task.getInt(5), task.getInt(2));//using position right now
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
    }

    private static String getNote(String note){

        try{

            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM Notes");

        }
        catch(SQLException e){
            e.printStackTrace();
        }
        return "";
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
