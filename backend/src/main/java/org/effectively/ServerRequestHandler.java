package org.effectively;

import com.sun.net.httpserver.HttpExchange;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.io.OutputStream;

public class ServerRequestHandler implements com.sun.net.httpserver.HttpHandler {

    public ServerRequestHandler() throws AuthenticationException {
        DatabaseHandler.connectToDatabase();
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Pair<String, String> requestParamValue = null;
        if("GET".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handleGetRequest(httpExchange);

        }/*else if("POST".equals(httpExchange)) { //TODO implement adding new items to database
            requestParamValue = handlePostRequest(httpExchange);
        }*/

        handleResponse(httpExchange,requestParamValue);
    }
    private Pair handleGetRequest(HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");

        return new Pair<>(paramvalue[0],paramvalue[1]);
    }
    private void handleResponse(HttpExchange httpExchange, Pair requestParamValue)  throws  IOException {
        OutputStream outputStream = httpExchange.getResponseBody();

        //Request the wanted data from DatabaseHandler
        String jsonResponse = DatabaseHandler.requestData(requestParamValue);

        httpExchange.sendResponseHeaders(200, jsonResponse.length());
        outputStream.write(jsonResponse.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}

