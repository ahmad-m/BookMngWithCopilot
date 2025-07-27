package com.spring.restful;

public class ObjectWithId {
    private long id;

    public ObjectWithId() {
    }

    public ObjectWithId(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
