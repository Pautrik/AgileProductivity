package org.effectively;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.effectively.dataObjects.Day;
import org.effectively.dataObjects.Task;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class MyHttpHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestParamValue=null;

        if("GET".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handleGetRequest(httpExchange);
        }
        /*else if("POST".equals(httpExchange)) {
            requestParamValue = handlePostRequest(httpExchange);
        }*/

        handleResponse(httpExchange,requestParamValue);
    }

    private String handleGetRequest(HttpExchange httpExchange) {
        Gson gson = new Gson();

        return httpExchange.getRequestURI().toString().split("\\?")[1].split("=")[1];
    }

    private String handlePostRequest(HttpExchange httpExchange) {
        return "";
    }

    private void handleResponse(HttpExchange httpExchange, String requestParamValue) throws IOException {
        OutputStream outputStream = httpExchange.getResponseBody();
        ArrayList<Task> tasks = new ArrayList<>();
        Day day = new Day("20200304", tasks);
        ArrayList<Day> data = new ArrayList<Day>();
        data.add(day);

        Gson gson = new Gson();
        ArrayList<String> jsonArray = new ArrayList<>();
        for (Object object : data){
            String json = gson.toJson(object);
            jsonArray.add(json);
        }

        for(int i = 0; i<jsonArray.size() ; i++){
            outputStream.write(jsonArray.get(i).getBytes());
        }

        //httpExchange.sendResponseHeaders(200, htmlResponse.length());
        //outputStream.write(htmlResponse.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}
