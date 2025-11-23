

// package com.chatbot.controller;

// import com.chatbot.dto.*;
// import com.chatbot.service.AuthService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// @CrossOrigin(origins = "http://localhost:3000")
// @RestController
// @RequestMapping("/api/ai")
// @RequiredArgsConstructor
// public class AuthController {

//     private final AuthService authService;

//     @PostMapping("/login")
//     public ResponseEntity<ApiResponse<UserResponse>> login(@RequestBody LoginRequest request) {
//         try {
//             if (request.getEmail() == null || request.getPassword() == null) {
//                 return ResponseEntity.badRequest()
//                     .body(new ApiResponse<>(false, "Email and Password are required", null));
//             }

//             UserResponse user = authService.login(request);
//             return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", user));
            
//         } catch (RuntimeException e) {
//             if (e.getMessage().equals("User not found")) {
//                 return ResponseEntity.status(404)
//                     .body(new ApiResponse<>(false, e.getMessage(), null));
//             } else if (e.getMessage().equals("Wrong password")) {
//                 return ResponseEntity.status(401)
//                     .body(new ApiResponse<>(false, e.getMessage(), null));
//             }
//             return ResponseEntity.status(500)
//                 .body(new ApiResponse<>(false, "Login failed", null));
//         }
//     }

//     @PostMapping("/signup")
//     public ResponseEntity<ApiResponse<Void>> signup(@RequestBody SignupRequest request) {
//         try {
//             if (request.getUsername() == null || request.getPassword() == null || request.getEmail() == null) {
//                 return ResponseEntity.badRequest()
//                     .body(new ApiResponse<>(false, "All fields are required", null));
//             }

//             authService.signup(request);
//             return ResponseEntity.ok(new ApiResponse<>(true, "Signup successful", null));
            
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(400)
//                 .body(new ApiResponse<>(false, e.getMessage(), null));
//         } catch (Exception e) {
//             return ResponseEntity.status(500)
//                 .body(new ApiResponse<>(false, "Internal Server Error", null));
//         }
//     }
// }








package com.chatbot.controller;

import com.chatbot.dto.*;
import com.chatbot.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(@RequestBody LoginRequest request) {
        try {
            // Validate request
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Email is required", null));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Password is required", null));
            }

            // Attempt login
            UserResponse user = authService.login(request);
            
            log.info("Successful login for user: {}", user.getEmail());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", user));
            
        } catch (RuntimeException e) {
            log.warn("Login failed: {}", e.getMessage());
            
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(404)
                    .body(new ApiResponse<>(false, "User not found", null));
            } else if (e.getMessage().equals("Wrong password")) {
                return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "Invalid password", null));
            }
            
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Login failed", null));
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Internal server error", null));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@RequestBody SignupRequest request) {
        try {
            // Validate all required fields
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Username is required", null));
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Email is required", null));
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Password is required", null));
            }

            // Validate email format
            if (!isValidEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Invalid email format", null));
            }

            // Validate password strength
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Password must be at least 6 characters", null));
            }

            // Attempt signup
            authService.signup(request);
            
            log.info("Successful signup for user: {}", request.getEmail());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Signup successful", null));
            
        } catch (RuntimeException e) {
            log.warn("Signup failed: {}", e.getMessage());
            
            if (e.getMessage().contains("Email already exists")) {
                return ResponseEntity.status(400)
                    .body(new ApiResponse<>(false, "Email already registered", null));
            } else if (e.getMessage().contains("Username already exists")) {
                return ResponseEntity.status(400)
                    .body(new ApiResponse<>(false, "Username already taken", null));
            }
            
            return ResponseEntity.status(400)
                .body(new ApiResponse<>(false, e.getMessage(), null));
                
        } catch (Exception e) {
            log.error("Unexpected error during signup", e);
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Internal server error", null));
        }
    }

    /**
     * Simple email validation
     */
    private boolean isValidEmail(String email) {
        if (email == null) return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
}