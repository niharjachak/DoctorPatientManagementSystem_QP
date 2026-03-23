package com.questpro.doctor_patient_system.exceptions;

import com.questpro.doctor_patient_system.dtos.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidLoginCredentialsException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidLoginCredentials(
            InvalidLoginCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)        // 401
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleUserNotFound(
            UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)           // 404
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<?>> handleUserAlreadyExists(
            UserAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)            // 409
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(InvalidSlotTimeException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidSlotTime(
            InvalidSlotTimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400 ✅ fixed
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(
            UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)           // 403
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(DoctorImageNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleDoctorImageNotFound(
            DoctorImageNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)           // 404
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleAppointmentNotFound(
            AppointmentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)           // 404
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(InactiveUserException.class)
    public ResponseEntity<ApiResponse<?>> handleInactiveUser(
            InactiveUserException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)           // 403
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(AlreadyLoggedOutException.class)
    public ResponseEntity<ApiResponse<?>> handleAlreadyLoggedOut(
            AlreadyLoggedOutException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(AppointmentAlreadyCancelledException.class)
    public ResponseEntity<ApiResponse<?>> handleAppointmentAlreadyCancelled(
            AppointmentAlreadyCancelledException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)            // 409
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(InvalidNameException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidName(
            InvalidNameException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(HospitalNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleHospitalNotFound(
            HospitalNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)           // 404
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(SlotBookedException.class)
    public ResponseEntity<ApiResponse<?>> handleSlotBooked(
            SlotBookedException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)            // 409
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(SlotNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleSlotNotFound(
            SlotNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)           // 404
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<?>> handleExpiredJwt(
            ExpiredJwtException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)        // 401
                .body(new ApiResponse<>(false, "Token has expired. Please login again.", null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }

    // ✅ new — malformed JSON
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleMessageNotReadable(
            HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400
                .body(new ApiResponse<>(false, "Malformed JSON request body", null));
    }

    // ✅ new — wrong type e.g. "abc" for Long
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<?>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)         // 400
                .body(new ApiResponse<>(false,
                        ex.getName() + " should be of type " + ex.getRequiredType().getSimpleName(),
                        null));
    }

    // ✅ new — catch-all, MUST be last
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // 500
                .body(new ApiResponse<>(false, "An unexpected error occurred", null));
    }
}