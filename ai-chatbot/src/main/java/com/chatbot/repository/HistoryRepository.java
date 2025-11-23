package com.chatbot.repository;

import com.chatbot.model.History;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends MongoRepository<History, String> {
    
    List<History> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    
    List<History> findByUserEmailAndTypeOrderByCreatedAtDesc(String userEmail, String type);
}