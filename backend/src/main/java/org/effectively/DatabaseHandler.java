package org.effectively;

import com.google.gson.Gson;
import org.effectively.dataObjects.Day;
import org.effectively.dataObjects.Task;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHandler {
    private static Gson gson = new Gson();
    //Dummy data
    private static List<Day> data = new ArrayList<>();

    public static String requestData(){

        //remove last request
        data.clear();

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

        List<String> jsonArray = new ArrayList<>();
        for (Object object : data){
            String json = gson.toJson(object);
            jsonArray.add(json);
        }
        return jsonArray.toString();
    }
}
