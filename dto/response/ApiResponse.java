package com.codeboy.mvc.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private HttpStatus status;
    private String message;
    private T data;
    
    
    
//    public ApiResponse(HttpStatus status, String message, T data) {
//		super();
//		this.status = status;
//		this.message = message;
//		this.data = data;
//	}
//
	public static <T> ApiResponse<T> success(HttpStatus status, T data) {
        return new ApiResponse<>(status, null, data);
    }

    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return new ApiResponse<>(status, message, data);
    }

    public static<T>  ApiResponse<T> failure(HttpStatus status, String message) {
        return new ApiResponse<>(status, message, null);
    }
}
