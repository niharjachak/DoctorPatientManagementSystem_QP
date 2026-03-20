package com.questpro.doctor_patient_system.exceptions;

public class AlreadyLoggedOutException extends RuntimeException {
    public AlreadyLoggedOutException(String message) {
        super(message);
    }
}
