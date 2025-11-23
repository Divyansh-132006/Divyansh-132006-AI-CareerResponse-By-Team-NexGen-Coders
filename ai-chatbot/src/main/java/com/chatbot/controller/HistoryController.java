package com.chatbot.controller;

import com.chatbot.dto.SaveHistoryRequest;
import com.chatbot.dto.ApiResponse;
import com.chatbot.model.History;
import com.chatbot.service.HistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @PostMapping("/savehistory")
    public ResponseEntity<ApiResponse<Void>> saveHistory(@RequestBody SaveHistoryRequest request) {
        try {
            log.info("Saving history for user: {}", request.getUserEmail());
            
            if (request.getUserEmail() == null || request.getQuery() == null || request.getResponse() == null) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Missing required fields", null));
            }
            
            historyService.saveHistory(request);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "History saved successfully", null));
            
        } catch (Exception e) {
            log.error("Error saving history: ", e);
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Failed to save history: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/history/{email}")
    public ResponseEntity<ApiResponse<List<History>>> getHistory(@PathVariable String email) {
        try {
            log.info("Fetching history for user: {}", email);
            
            List<History> history = historyService.getHistoryByEmail(email);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "History retrieved", history));
            
        } catch (Exception e) {
            log.error("Error fetching history: ", e);
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Failed to fetch history: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/history/{email}/{type}")
    public ResponseEntity<ApiResponse<List<History>>> getHistoryByType(
            @PathVariable String email, 
            @PathVariable String type) {
        try {
            log.info("Fetching {} history for user: {}", type, email);
            
            List<History> history = historyService.getHistoryByEmailAndType(email, type);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "History retrieved", history));
            
        } catch (Exception e) {
            log.error("Error fetching history: ", e);
            return ResponseEntity.status(500)
                .body(new ApiResponse<>(false, "Failed to fetch history: " + e.getMessage(), null));
        }
    }
}