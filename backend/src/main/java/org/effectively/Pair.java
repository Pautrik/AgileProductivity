package org.effectively;

public class Pair <F,S> {
    F first;
    S second;

    public Pair(F first,S second){
        this.first = first;
        this.second = second;
    }

    public S getSecond() {
        return second;
    }

    public F getFirst() {
        return first;
    }
}
