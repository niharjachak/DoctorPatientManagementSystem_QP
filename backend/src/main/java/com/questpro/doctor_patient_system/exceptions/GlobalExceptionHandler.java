package com.questpro.doctor_patient_system.exceptions;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidLoginCredentialsException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidLoginCredentialsException(InvalidLoginCredentialsException ex){
        return  ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFoundException(UserNotFoundException ex){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<?>> handleUserAlreadyExistsException(UserAlreadyExistsException ex){
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(InvalidSlotTimeException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidSlotTimeException(InvalidSlotTimeException ex){
        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorizedException(UnauthorizedException ex){
        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(DoctorImageNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleDoctorImageNotFoundException(DoctorImageNotFoundException ex){
        return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }


    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleAppointmentNotFoundException(AppointmentNotFoundException ex){
        return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

}
