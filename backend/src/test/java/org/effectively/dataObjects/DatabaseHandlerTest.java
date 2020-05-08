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
            DatabaseHandler weekhandler = new DatabaseHandler(System.getenv("EV1"),"week");

            //GET REQUEST
            Pair<String,String> inputParameters = new Pair("Get","175403");
            String reply = weekhandler.requestData(inputParameters);
            Day [] week = gson.fromJson(reply, Day[].class);
            assertEquals(week.length, 7);
            assertEquals(week[0].getDate(), "17540114");
            assertEquals(week[6].getDate(), "17540120");

            //POST REQUEST
            Pair<String,String> postinputParameters = new Pair("Post", "{\"text\":\"automatedtest\",\"state\":3,\"position\":1,\"date\":\"17540121\"}");

            String idreply = weekhandler.requestData(postinputParameters);
            Integer [] id = gson.fromJson(idreply, Integer[].class);

            reply = weekhandler.requestData(new Pair<>("Get","175404"));
            week = gson.fromJson(reply, Day[].class);


            boolean containsID = false;
            for (Task t : week[0].getTasks()){
                if (t.getId() == id[0]){
                    containsID = true;
                }
            }
            assertTrue(containsID);

            //DELETE REQUEST
            Pair deleteinputParameters = new Pair("Delete", Integer.toString(id[0]));
            weekhandler.requestData(deleteinputParameters);

            reply = weekhandler.requestData(new Pair<>("Get","175404"));
            week = gson.fromJson(reply, Day[].class);

            boolean removedID = true;
            for (Task t : week[0].getTasks()){
                if (t.getId() == id[0]){
                    removedID = false;
                }
            }
            assertTrue(removedID);


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