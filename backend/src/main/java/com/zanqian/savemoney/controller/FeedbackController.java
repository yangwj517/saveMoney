package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.FeedbackRequest;
import com.zanqian.savemoney.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(feedbackService.submitFeedback(userId, request));
    }

    @PostMapping("/images/upload")
    public ApiResponse<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.success(feedbackService.uploadImage(file.getOriginalFilename(), file.getBytes()));
    }
}
