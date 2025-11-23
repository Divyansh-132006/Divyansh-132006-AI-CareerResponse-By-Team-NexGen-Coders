package com.chatbot.controller;

import com.chatbot.dto.*;
import com.chatbot.service.GeminiService;
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
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/roadmap")
    public ResponseEntity<RoadmapResponse> generateRoadmap(@RequestBody RoadmapRequest request) {
        try {
            
            String roadmap = geminiService.generateCareerRoadmap(
                request.getGoal(),
                List.of(request.getSkills())
            );
            return ResponseEntity.ok(new RoadmapResponse(roadmap));
        } catch (Exception e) {
            log.error("Error in /roadmap: ", e);
            return ResponseEntity.status(500)
                .body(new RoadmapResponse("AI response failed: " + e.getMessage()));
        }
    }

    @PostMapping("/ask")
    public ResponseEntity<AskResponse> askQuestion(@RequestBody AskRequest request) {
        try {
            log.info("Query Received: {}", request.getQuery());
            String answer = geminiService.askAnything(request.getQuery());
            return ResponseEntity.ok(new AskResponse(answer));
        } catch (Exception e) {
            log.error("Error in /ask: ", e);
            return ResponseEntity.status(500)
                .body(new AskResponse("AI failed: " + e.getMessage()));
        }
    }
}
