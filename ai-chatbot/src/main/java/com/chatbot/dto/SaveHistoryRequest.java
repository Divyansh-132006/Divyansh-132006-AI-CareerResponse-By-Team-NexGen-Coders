package com.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveHistoryRequest {
    private String userEmail;
    private String query;
    private String response;
    private String type; 
}