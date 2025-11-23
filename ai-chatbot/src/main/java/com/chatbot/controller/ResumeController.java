
package com.chatbot.controller;

import com.chatbot.dto.ResumeResponse;
import com.chatbot.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class ResumeController {

    private final GeminiService geminiService;

    @PostMapping("/resume")
    public ResponseEntity<ResumeResponse> analyzeResume(@RequestParam("resume") MultipartFile file) {
        File tempFile = null;
        try {
            tempFile = File.createTempFile("resume", ".pdf");
            file.transferTo(tempFile);

            PDDocument document = Loader.loadPDF(tempFile);
            PDFTextStripper stripper = new PDFTextStripper();
            String resumeText = stripper.getText(document);
            document.close();

            if (resumeText == null || resumeText.length() < 50) {
                ResumeResponse response = new ResumeResponse();
                response.setFeedback(null);
                response.setError("Resume content could not be extracted properly.");
                return ResponseEntity.badRequest().body(response);
            }

            String feedback = geminiService.analyzeResume(resumeText);
            ResumeResponse response = new ResumeResponse();
            response.setFeedback(feedback);
            response.setError(null);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("PDF processing error: ", e);
            ResumeResponse response = new ResumeResponse();
            response.setFeedback(null);
            response.setError("Failed to parse PDF");
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            log.error("Resume analysis error: ", e);
            ResumeResponse response = new ResumeResponse();
            response.setFeedback(null);
            response.setError("Failed to analyze resume: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }
}