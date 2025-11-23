package com.chatbot.service;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;
import java.io.IOException;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final OkHttpClient client = new OkHttpClient();
    private final Gson gson = new Gson();

    public String generateCareerRoadmap(String goal, List<String> skills) {
       String skillsStr = String.join(", ", skills);
String prompt = String.format("""
            You're an AI career mentor.
           Give a realistic step-by-step career roadmap for someone who wants to become a %s.
           They already know: %s.
           Return the roadmap as plain text only.
           Do not use any Markdown formatting like **bold**, ## headers, or hyphen (-) bullets.
           Number each step clearly, like "Step 1:", "Step 2:", etc.
            Use a clean and readable format suitable for plain text display.
            """, goal, skillsStr);


        return generateContent(prompt);
    }

    public String askAnything(String query) {
        log.debug("User Query: {}", query);
        
        String prompt = String.format("""
            You are a helpful AI assistant. Answer this question simply:
            
            %s
            """, query);

        return generateContent(prompt);
    }

    public String analyzeResume(String resumeText) {
        String prompt = String.format("""
            Give professional feedback on this resume:

            %s
            """, resumeText);

        return generateContent(prompt);
    }

    private String generateContent(String prompt) {
    try {
        JsonObject textPart = new JsonObject();
        textPart.addProperty("text", prompt);

        JsonObject content = new JsonObject();
        content.add("parts", gson.toJsonTree(List.of(textPart)));

        JsonObject requestBody = new JsonObject();
        requestBody.add("contents", gson.toJsonTree(List.of(content)));

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(apiUrl + "?key=" + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "empty";
                throw new IOException("Gemini API returned " + response.code() + ": " + errorBody);
            }

            String responseBody = response.body().string();
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            return jsonResponse
                    .getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString();
        }
    } catch (Exception e) {
        log.error("Gemini API Error: ", e);
        return "⚠️ Something went wrong while generating the response. Please try again later.";
    }
}
}