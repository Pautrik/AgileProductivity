package org.effectively;

import com.google.gson.Gson;
import org.effectively.dataObjects.Day;
import org.effectively.dataObjects.Task;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DatabaseHandler {
    private static final String url = "url: pautrik.ddns.net";
    private static final String user = "pi";
    private static final String password = "effectively";
    private static Gson gson = new Gson();
    //Dummy data
    private static List<Day> data = new ArrayList<>();

    public static String requestData(Pair<String, String> param){

        //remove last request
        data.clear();

        if(param.getFirst().equals("week")) {

            //initiate dummy data (replace with call to database)
            List<Task> tasks = new ArrayList<>();
            tasks.add(new Task("do that", 1));
            Day day = new Day("20200304", tasks);
            data.add(day);

            List<Task> tasks2 = new ArrayList<>();
            tasks2.add(new Task("do this", 2));
            Day day2 = new Day("20200305", tasks2);
            data.add(day2);
            //
        }

        List<String> jsonArray = new ArrayList<>();
        for (Object object : data){
            String json = gson.toJson(object);
            jsonArray.add(json);
        }
        return jsonArray.toString();
    }

    public static Connection connect(){
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the PostgreSQL server successfully");
        } catch (SQLException e){
            System.out.println(e.getMessage());
        }

        return conn;
    }
}
