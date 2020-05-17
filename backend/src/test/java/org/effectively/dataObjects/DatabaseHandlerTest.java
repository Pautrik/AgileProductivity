package org.effectively.dataObjects;

import com.google.gson.Gson;
import org.effectively.Pair;
import org.junit.Test;

import javax.naming.AuthenticationException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class DatabaseHandlerTest {

    @Test
    public void requestData() {
        try {
            weekEndpointTests();
            projectsEndpointTests();
            timelineEndpointTests();
            nodeEndpointTests();
        } catch (AuthenticationException e) {
            e.printStackTrace();
        }
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
        Pair<String, String> postinputParameters = new Pair("Post", "{\"text\":\"automatedtest\",\"state\":3,\"position\":0,\"date\":\"17540121\"}");

        String idreply = weekhandler.requestData(postinputParameters);
        Integer[] id = gson.fromJson(idreply, Integer[].class);

        reply = weekhandler.requestData(new Pair<>("Get", "175404"));
        week = gson.fromJson(reply, Day[].class);

        boolean containsID = false;
        for (Task t : week[0].getTasks()) {
            if (t.getId().equals(id[0])) {
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
            if (t.getId().equals(id[0])) {
                removedID = false;
            }
        }
        assertTrue(removedID); //makes sure the task with id that was added with POST request is removed


    }

    public void projectsEndpointTests() throws AuthenticationException {
        Gson gson = new Gson();


        DatabaseHandler projecthandler = new DatabaseHandler(System.getenv("EV1"), "projects");

        //GET REQUEST for active projects
        Pair<String, String> inputParameters = new Pair("Get", "active");
        String reply = projecthandler.requestData(inputParameters);
        Project[] activeprojects = gson.fromJson(reply, Project[].class);

        for (Project p : activeprojects) {
            assertTrue(p.isActive());
        }

        //GET REQUEST for inactive projects
        inputParameters = new Pair("Get", "inactive");
        reply = projecthandler.requestData(inputParameters);
        Project[] inactiveprojects = gson.fromJson(reply, Project[].class);

        for (Project p : inactiveprojects) {
            assertTrue(!p.isActive());
        }


    }

    public void timelineEndpointTests() throws AuthenticationException {
        Gson gson = new Gson();

        //SETUP DBHANDLER
        DatabaseHandler timelinehandler = new DatabaseHandler(System.getenv("EV1"), "timeline");

        //POST REQUEST
        Pair<String, String> postinputParameters = new Pair("Post", "{\"endDate\":\"17540115\",\"project\":{\"name\":\"automatedtestproject\",\"active\":true},\"text\":\"automated test\",\"state\":1,\"position\":0,\"date\":\"17540114\"}");

        String idreply = timelinehandler.requestData(postinputParameters);
        Integer[] id = gson.fromJson(idreply, Integer[].class);

        postinputParameters = new Pair("Post", "{\"endDate\":\"17540115\",\"project\":{\"name\":\"automatedtestproject2\",\"active\":false},\"text\":\"automated test2\",\"state\":2,\"position\":1,\"date\":\"17540114\"}");

        idreply = timelinehandler.requestData(postinputParameters);
        Integer[] id2 = gson.fromJson(idreply, Integer[].class);

        //GET REQUEST
        String reply = timelinehandler.requestData(new Pair<>("Get", "automatedtestproject&17540114&17540115"));
        TimelineTask [] timelineitems = gson.fromJson(reply, TimelineTask[].class);

        assertEquals(timelineitems.length, 1);
        assertEquals(id[0],timelineitems[0].getId());

        reply = timelinehandler.requestData(new Pair<>("Get", "automatedtestproject&automatedtestproject2&17540114&17540115"));
        timelineitems = gson.fromJson(reply, TimelineTask[].class);

        assertEquals(timelineitems.length, 2);
        for (TimelineTask t : timelineitems){
            assertTrue(t.getId().equals(id[0])|| t.getId().equals(id2[0]));
        }

        //DELETE REQUEST
        Pair deleteinputParameters = new Pair("Delete", Integer.toString(id[0]));
        timelinehandler.requestData(deleteinputParameters);

        deleteinputParameters = new Pair("Delete", Integer.toString(id2[0]));
        timelinehandler.requestData(deleteinputParameters);

        reply = timelinehandler.requestData(new Pair<>("Get", "automatedtestproject&automatedtestproject2&17540114&17540115"));
        timelineitems = gson.fromJson(reply, TimelineTask[].class);

        assertEquals(timelineitems.length,0);


    }
    public void nodeEndpointTests() throws AuthenticationException {
        Gson gson = new Gson();

        //SETUP DBHANDLER
        DatabaseHandler notehandler = new DatabaseHandler(System.getenv("EV1"), "note");

        //POST REQUEST
        Pair<String, String> postinputParameters = new Pair("Post", "{\"text\":\"automated testnote\",\"position\":99999999}");

        String idreply = notehandler.requestData(postinputParameters);
        Integer[] id = gson.fromJson(idreply, Integer[].class);

        String reply = notehandler.requestData(new Pair<>("Get", "DUMMY VARIABLE"));
        Note [] allnotes = gson.fromJson(reply, Note[].class);

        boolean containsID = false;
        for (Note n : allnotes){
            if (n.getId().equals(id[0])){
                containsID = true;
            }
        }
        assertTrue(containsID);

        //DELETE REQUEST

        Pair deleteinputParameters = new Pair("Delete", Integer.toString(id[0]));
        notehandler.requestData(deleteinputParameters);

        reply = notehandler.requestData(new Pair<>("Get", "DUMMY VARIABLE"));
        allnotes = gson.fromJson(reply, Note[].class);

        boolean removedID = true;
        for (Note n : allnotes){
            if (n.getId().equals(id[0])){
                removedID = false;
            }
        }
        assertTrue(removedID);

    }
}