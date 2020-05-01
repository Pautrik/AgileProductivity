package org.effectively;

import com.sun.net.httpserver.HttpExchange;
import org.effectively.dataObjects.DatabaseHandler;

import javax.naming.AuthenticationException;
import java.io.*;
import java.util.stream.Collectors;

public class ServerRequestHandler implements com.sun.net.httpserver.HttpHandler {
    DatabaseHandler handler;

    public ServerRequestHandler(String DBpassword) throws AuthenticationException {
       handler = new DatabaseHandler(DBpassword);
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Pair<String, String> requestParamValue = null;
        if("GET".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handleGetRequest(httpExchange);

        }else if("POST".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handlePostRequest(httpExchange);
        }else if("DELETE".equals(httpExchange.getRequestMethod())){
            requestParamValue = handleDeleteRequest(httpExchange);
        }

        handleResponse(httpExchange,requestParamValue);
    }

    private Pair handleGetRequest(HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");

        return new Pair<>(paramvalue[0]+"Get",paramvalue[1]);
    }
    private Pair handleDeleteRequest(HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");

        return new Pair<>(paramvalue[0]+"Delete",paramvalue[1]);
    }

    private Pair handlePostRequest (HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");
        String body = null;
        try{
            InputStream bodyAsStream= httpExchange.getRequestBody();
            body = new BufferedReader(new InputStreamReader(bodyAsStream))
                    .lines().collect(Collectors.joining("\n"));
            bodyAsStream.close();
        }
        catch (IOException i){
            i.printStackTrace();
        }
        return new Pair<>(paramvalue[0]+"Post",body);
    }

    private void handleResponse(HttpExchange httpExchange, Pair requestParamValue)  throws  IOException {
        OutputStream outputStream = httpExchange.getResponseBody();

        //Request the wanted data from DatabaseHandler
        String jsonResponse = handler.requestData(requestParamValue);

        httpExchange.sendResponseHeaders(200, jsonResponse.length());
        outputStream.write(jsonResponse.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}

