package com.project.EventManagementPortal.exception;

public class EventNotOpenForRegistrationException
        extends RuntimeException {

    public EventNotOpenForRegistrationException(String message) {
        super(message);
    }
}