package com.project.EventManagementPortal.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.project.EventManagementPortal.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorResponse>
            handleEventNotFound(
                    EventNotFoundException ex) {

        return error(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse>
            handleUserNotFound(
                    UserNotFoundException ex) {

        return error(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RegistrationNotFoundException.class)
    public ResponseEntity<ErrorResponse>
            handleRegistrationNotFound(
                    RegistrationNotFoundException ex) {

        return error(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler({
            DuplicateUserException.class,
            DuplicateRegistrationException.class,
            NoSeatsAvailableException.class,
            InvalidOrganizerException.class,
            InvalidUserRoleException.class,
            EventHasRegistrationsException.class,
            UserHasRegistrationsException.class,
            EventNotOpenForRegistrationException.class
    })
    public ResponseEntity<ErrorResponse>
            handleBadRequest(RuntimeException ex) {

        return error(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse>
            handleValidationErrors(
                    MethodArgumentNotValidException ex) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        String message = errors.entrySet()
                .stream()
                .map(entry ->
                        entry.getKey()
                                + ": "
                                + entry.getValue()
                )
                .findFirst()
                .orElse("Invalid request");

        return error(
                HttpStatus.BAD_REQUEST,
                message
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse>
            handleGeneralException(
                    Exception ex) {

        return error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong"
        );
    }

    private ResponseEntity<ErrorResponse> error(
            HttpStatus status,
            String message) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        status.value(),
                        message
                );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}