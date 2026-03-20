package com.questpro.doctor_patient_system.exceptions;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ApiResponse<?>  - Return a response which passes a wildcard. (ApiResponse of some type)
    // we are not sure what is the response being passed so we are passing some type of generic
    // can be String, List, Object which can be classified into ? no need to specify what type
    // just pass it  for respnse message

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
        return  ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(InvalidSlotTimeException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidSlotTimeException(InvalidSlotTimeException ex){
        return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorizedException(UnauthorizedException ex){
        return  ResponseEntity.status(HttpStatus.FORBIDDEN)
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

    @ExceptionHandler(InactiveUserException.class)
    public ResponseEntity<ApiResponse<?>> handleInactiveUserException(InactiveUserException ex){
        return  ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse<>(false,ex.getMessage(),null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error -> errors.put(
                        error.getField(),
                        error.getDefaultMessage()
                ));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }

}
