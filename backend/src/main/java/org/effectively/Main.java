package org.effectively;

import com.sun.net.httpserver.HttpServer;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Scanner;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.logging.Logger;

public class Main {
    public static void main(String[] args) {
        boolean connected = false;
        Logger logger = Logger.getLogger(Main.class.getName());
        HttpServer server = null;
        int port = 8000;

        //set up server
        try {
            server = HttpServer.create(new InetSocketAddress("localhost", port), 0);
            ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
            server.setExecutor(threadPoolExecutor);
        }catch(IOException i){
            logger.info("Could not create httpserver");
        }

        //try to authenticate to server if server was created
        while(!connected && server != null){
            try{
                logger.info("Enter database password: ");
                Scanner scanner = new Scanner(System. in);
                String inputString = scanner. nextLine();
                DatabaseHandler.setPassword(inputString);
                server.createContext("/", new ServerRequestHandler());
                server.start();
                logger.info("Server started on port " + port);
                connected = true;
            }
            catch(AuthenticationException a){
                logger.info("Incorrect password");
            }

        }

        while(true);
    }
}
