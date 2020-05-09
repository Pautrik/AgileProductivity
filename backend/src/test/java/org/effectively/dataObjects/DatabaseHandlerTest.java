package org.effectively.dataObjects;

import com.google.gson.Gson;
import org.effectively.Pair;
import org.junit.Test;

import javax.naming.AuthenticationException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class DatabaseHandlerTest {

    @Test
    public void requestData() {
        try {
            weekEndpointTests();
            projectsEndpointTests();
        } catch (AuthenticationException e) {
            e.printStackTrace();
        }


        //timeline //TODO need return value for id on addObject to finish

            /*inputParameters = new Pair("Get","testproject1&testproject2&20200410&20200501");
            DatabaseHandler timelinehandler = new DatabaseHandler(System.getenv("EV1"),"timeline");
            reply = timelinehandler.requestData(inputParameters);
            TimelineTask [] timelinetasks = gson.fromJson(reply, TimelineTask[].class);*/

        //projects //TODO need return value for id on addObject to finish

        //note //TODO need return value for id on addObject to finish


    }

    public void weekEndpointTests() throws AuthenticationException {
        Gson gson = new Gson();

        //SETUP DBHANDLER
        DatabaseHandler weekhandler = new DatabaseHandler(System.getenv("EV1"), "week");

        //GET REQUEST
        Pair<String, String> inputParameters = new Pair("Get", "175403");
        String reply = weekhandler.requestData(inputParameters);
        Day[] week = gson.fromJson(reply, Day[].class);

        //make sure the correct list with 7 Day objects was returned
        assertEquals(week.length, 7);
        assertEquals(week[0].getDate(), "17540114");
        assertEquals(week[6].getDate(), "17540120");

        //POST REQUEST
        Pair<String, String> postinputParameters = new Pair("Post", "{\"text\":\"automatedtest\",\"state\":3,\"position\":1,\"date\":\"17540121\"}");

        String idreply = weekhandler.requestData(postinputParameters);
        Integer[] id = gson.fromJson(idreply, Integer[].class);

        reply = weekhandler.requestData(new Pair<>("Get", "175404"));
        week = gson.fromJson(reply, Day[].class);


        boolean containsID = false;
        for (Task t : week[0].getTasks()) {
            if (t.getId() == id[0]) {
                containsID = true;
            }
        }
        assertTrue(containsID); //makes sure there is a new task with the id returned from POST call

        //DELETE REQUEST
        Pair deleteinputParameters = new Pair("Delete", Integer.toString(id[0]));
        weekhandler.requestData(deleteinputParameters);

        reply = weekhandler.requestData(new Pair<>("Get", "175404"));
        week = gson.fromJson(reply, Day[].class);

        boolean removedID = true;
        for (Task t : week[0].getTasks()) {
            if (t.getId() == id[0]) {
                removedID = false;
            }
        }
        assertTrue(removedID); //makes sure the task with id that was added with POST request is removed


    }

    public void projectsEndpointTests() throws AuthenticationException {
        Gson gson = new Gson();

        try {
            DatabaseHandler projecthandler = new DatabaseHandler(System.getenv("EV1"), "projects");

            //GET REQUEST for active projects
            Pair<String, String> inputParameters = new Pair("Get", "active");
            String reply = projecthandler.requestData(inputParameters);
            Project[] activeprojects = gson.fromJson(reply, Project[].class);

            for (Project p : activeprojects){
                assertTrue(p.isActive());
            }

            //GET REQUEST for inactive projects
            inputParameters = new Pair("Get", "inactive");
            reply = projecthandler.requestData(inputParameters);
            Project[] inactiveprojects = gson.fromJson(reply, Project[].class);

            for (Project p : inactiveprojects){
                assertTrue(!p.isActive());
            }


        } catch (AuthenticationException e) {
            e.printStackTrace();
        }
    }
}