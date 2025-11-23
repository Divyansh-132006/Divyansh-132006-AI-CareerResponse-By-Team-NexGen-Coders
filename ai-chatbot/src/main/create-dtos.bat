@echo off
REM Save this as create-dtos.bat in your project root
REM Run it to automatically create all DTO files

set DTO_DIR=src\main\java\com\chatbot\dto

echo Creating DTO directory...
mkdir %DTO_DIR% 2>nul

echo Deleting old DTOs.java...
del %DTO_DIR%\DTOs.java 2>nul

echo Creating LoginRequest.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class LoginRequest {
echo     private String email;
echo     private String password;
echo }
) > %DTO_DIR%\LoginRequest.java

echo Creating SignupRequest.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class SignupRequest {
echo     private String username;
echo     private String email;
echo     private String password;
echo }
) > %DTO_DIR%\SignupRequest.java

echo Creating UserResponse.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Builder;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo import java.time.LocalDateTime;
echo.
echo @Data
echo @Builder
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class UserResponse {
echo     private String name;
echo     private String email;
echo     private LocalDateTime createdAt;
echo }
) > %DTO_DIR%\UserResponse.java

echo Creating ApiResponse.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class ApiResponse^<T^> {
echo     private boolean success;
echo     private String message;
echo     private T user;
echo }
) > %DTO_DIR%\ApiResponse.java

echo Creating RoadmapRequest.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class RoadmapRequest {
echo     private String goal;
echo     private String skills;
echo }
) > %DTO_DIR%\RoadmapRequest.java

echo Creating RoadmapResponse.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class RoadmapResponse {
echo     private String roadmap;
echo }
) > %DTO_DIR%\RoadmapResponse.java

echo Creating AskRequest.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class AskRequest {
echo     private String query;
echo     private String userId;
echo }
) > %DTO_DIR%\AskRequest.java

echo Creating AskResponse.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class AskResponse {
echo     private String answer;
echo }
) > %DTO_DIR%\AskResponse.java

echo Creating ResumeResponse.java...
(
echo package com.chatbot.dto;
echo.
echo import lombok.AllArgsConstructor;
echo import lombok.Data;
echo import lombok.NoArgsConstructor;
echo.
echo @Data
echo @NoArgsConstructor
echo @AllArgsConstructor
echo public class ResumeResponse {
echo     private String feedback;
echo     private String error;
echo }
) > %DTO_DIR%\ResumeResponse.java

echo.
echo ========================================
echo All DTO files created successfully!
echo ========================================
echo.
echo Files created in: %DTO_DIR%
dir %DTO_DIR%\*.java
echo.
echo Next steps:
echo 1. Update all other files to use 'com.chatbot' package
echo 2. Fix ResumeController.java to use Loader.loadPDF()
echo 3. Run: mvn clean install
echo.
pause