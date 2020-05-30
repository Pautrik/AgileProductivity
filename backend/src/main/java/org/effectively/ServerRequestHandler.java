package org.effectively;

import com.sun.net.httpserver.HttpExchange;
import org.effectively.dataObjects.DatabaseHandler;

import javax.naming.AuthenticationException;
import java.io.*;
import java.util.stream.Collectors;

/**
 * Class that handles incoming httprequests for clients. This class extracts and sends the needed parameters in
 * httprequest to a DatabaseHandler waiting for response before sending to client
 */

public class ServerRequestHandler implements com.sun.net.httpserver.HttpHandler {
    DatabaseHandler handler;

    ServerRequestHandler(String DBpassword, String context) throws AuthenticationException {
       handler = new DatabaseHandler(DBpassword, context);
    }

    /**
     * Sets the request parameters depending on request type and calls handleResponse()
     *
     * @param httpExchange, the httprequest sent from client
     * @throws IOException
     */

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        Pair<String, String> requestParamValue = null;
        if("GET".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handleGetRequest(httpExchange);
        }else if("POST".equals(httpExchange.getRequestMethod())) {
            requestParamValue = handlePostRequest(httpExchange);
        }else if("DELETE".equals(httpExchange.getRequestMethod())){
            requestParamValue = handleDeleteRequest(httpExchange);
        }else if("PATCH".equals(httpExchange.getRequestMethod())){
            requestParamValue = handlePatchRequest(httpExchange);
        }

        handleResponse(httpExchange,requestParamValue);
    }

    /**
     *
     * @param httpExchange, the httprequest sent from client
     * @return the request parameters as Pair <String,String> for a GET request
     */

    private Pair handleGetRequest(HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");

        return new Pair<>("Get",paramvalue[1]);
    }

    /**
     *
     * @param httpExchange, the httprequest sent from client
     * @return the request parameters as Pair <String,String> for a DELETE request
     */

    private Pair handleDeleteRequest(HttpExchange httpExchange) {

        //TODO make sure there are no "=" in key or value before splitting
        String [] paramvalue = httpExchange.getRequestURI().getQuery().split("=");

        return new Pair<>("Delete",paramvalue[1]);
    }

    /**
     *
     * @param httpExchange, the httprequest sent from client
     * @return the request parameters as Pair <String,String> for a POST request
     */

    private Pair handlePostRequest (HttpExchange httpExchange) {
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
        return new Pair<>("Post",body);
    }

    /**
     *
     * @param httpExchange, the httprequest sent from client
     * @return the request parameters as Pair <String,String> for a PATCH request
     */

    private Pair handlePatchRequest (HttpExchange httpExchange) {
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
        return new Pair<>("Patch",body);
    }



    /**
     * Asks the handler to fetch the required data and sends the data back to the client as a JSON response
     *
     * @param httpExchange, the httprequest sent from client
     * @param requestParamValue, the parameters of the request as a Pair <String,String>
     * @throws IOException
     */

    private void handleResponse(HttpExchange httpExchange, Pair requestParamValue)  throws IOException {
        OutputStream outputStream = httpExchange.getResponseBody();

        //Request the wanted data from DatabaseHandler
        String jsonResponse = handler.requestData(requestParamValue);

        httpExchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        httpExchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
        outputStream.write(jsonResponse.getBytes());
        outputStream.flush();
        outputStream.close();
    }
}

