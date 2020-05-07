package org.effectively.dataObjects;

import com.google.gson.Gson;
import org.effectively.Pair;
import org.junit.Assert;
import org.junit.Test;

import javax.naming.AuthenticationException;

import java.util.List;

import static org.junit.Assert.*;

public class DatabaseHandlerTest {

    @Test
    public void requestData() {
        Gson gson = new Gson();

        try{
            //week

            Pair inputParameters = new Pair("Get","175403");
            DatabaseHandler weekhandler = new DatabaseHandler(System.getenv("EV1"),"week");
            String reply = weekhandler.requestData(inputParameters);
            Day [] week = gson.fromJson(reply, Day[].class);
            assertEquals(week.length, 7);
            assertEquals(week[0].getDate(), "17540114");
            assertEquals(week[6].getDate(), "17540120");


            /*inputParameters = new Pair("Post", "{\"text\":\"automated test\",\"state\":3,\"position\":1,\"date\":\"00010501\"}");
            weekhandler.requestData(inputParameters);*/

            //TODO String id should be set to return value of POST request;

            /*handler.requestData("Delete", id);*/

            //timeline //TODO need return value for id on addObject to finish

            /*inputParameters = new Pair("Get","testproject1&testproject2&20200410&20200501");
            DatabaseHandler timelinehandler = new DatabaseHandler(System.getenv("EV1"),"timeline");
            reply = timelinehandler.requestData(inputParameters);
            TimelineTask [] timelinetasks = gson.fromJson(reply, TimelineTask[].class);*/

            //projects //TODO need return value for id on addObject to finish

            //note //TODO need return value for id on addObject to finish


        } catch (AuthenticationException e) {
            e.printStackTrace();
        }

    }
}