package com.chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "history")
public class History {
    
    @Id
    private String id;
    
    @Indexed
    private String userEmail;
    
    private String query;
    
    private String response;
    
    private String type; // 'roadmap', 'resume', 'question'
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // Constructor for creating new history without id and createdAt
    public History(String userEmail, String query, String response, String type) {
        this.userEmail = userEmail;
        this.query = query;
        this.response = response;
        this.type = type;
    }
}