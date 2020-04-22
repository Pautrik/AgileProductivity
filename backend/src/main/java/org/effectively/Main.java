package org.effectively;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.logging.Logger;

public class Main {
    public static void main(String[] args) throws IOException {

        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress("localhost", port), 0);
        ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
        Logger logger = Logger.getLogger(Main.class.getName());

        server.createContext("/", new ServerRequestHandler());
        server.setExecutor(threadPoolExecutor);
        server.start();
        logger.info("Server started on port " + port);
        while(true);
    }
}
