package org.effectively;

import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;

public class ServerRequestHandler implements com.sun.net.httpserver.HttpHandler {
    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String requestParamValue = null;
        if("GET".equals(httpExchange.getRequestMethod())) {
/*
            requestParamValue = handleGetRequest(httpExchange); //uncomment when starting to work on custom requests
*/
        }/*else if("POST".equals(httpExchange)) { //uncomment when starting to work on adding items to database
            requestParamValue = handlePostRequest(httpExchange);
        }*/
        handleResponse(httpExchange,requestParamValue);
    }
    private String handleGetRequest(HttpExchange httpExchange) {
        return httpExchange.
        getRequestURI()
                .toString()
                .split("\\?")[1]
                .split("=")[1];
    }
    private void handleResponse(HttpExchange httpExchange, String requestParamValue)  throws  IOException {
        OutputStream outputStream = httpExchange.getResponseBody();

        //Request the wanted data from DatabaseHandler
        String jsonResponse = DatabaseHandler.requestData();

        httpExchange.sendResponseHeaders(200, jsonResponse.length());
        outputStream.write(jsonResponse.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}

