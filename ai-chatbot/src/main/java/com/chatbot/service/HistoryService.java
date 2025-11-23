package com.chatbot.service;

import com.chatbot.dto.SaveHistoryRequest;
import com.chatbot.model.History;
import com.chatbot.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public void saveHistory(SaveHistoryRequest request) {
        try {
            String type = request.getType() != null ? request.getType() : "question";
            
            History history = new History(
                request.getUserEmail(),
                request.getQuery(),
                request.getResponse(),
                type
            );
            
            historyRepository.save(history);
            log.info("History saved successfully for user: {}", request.getUserEmail());
            
        } catch (Exception e) {
            log.error("Error saving history: ", e);
            throw new RuntimeException("Failed to save history", e);
        }
    }

    public List<History> getHistoryByEmail(String email) {
        try {
            return historyRepository.findByUserEmailOrderByCreatedAtDesc(email);
        } catch (Exception e) {
            log.error("Error fetching history for user: {}", email, e);
            throw new RuntimeException("Failed to fetch history", e);
        }
    }

    public List<History> getHistoryByEmailAndType(String email, String type) {
        try {
            return historyRepository.findByUserEmailAndTypeOrderByCreatedAtDesc(email, type);
        } catch (Exception e) {
            log.error("Error fetching history for user: {} and type: {}", email, type, e);
            throw new RuntimeException("Failed to fetch history", e);
        }
    }
}