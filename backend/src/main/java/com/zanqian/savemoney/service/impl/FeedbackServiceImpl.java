package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.dto.FeedbackRequest;
import com.zanqian.savemoney.entity.Feedback;
import com.zanqian.savemoney.repository.FeedbackRepository;
import com.zanqian.savemoney.service.FeedbackService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Value("${app.upload.url-prefix}")
    private String uploadUrlPrefix;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    @Transactional
    public Map<String, Object> submitFeedback(String userId, FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setType(request.getType());
        feedback.setContent(request.getContent());
        feedback.setContact(request.getContact());
        if (request.getImages() != null) {
            feedback.setImages(String.join(",", request.getImages()));
        }
        feedback.setStatus("pending");
        feedbackRepository.save(feedback);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", feedback.getId());
        result.put("type", feedback.getType());
        result.put("content", feedback.getContent());
        result.put("contact", feedback.getContact());
        result.put("images", request.getImages() != null ? request.getImages() : java.util.Collections.emptyList());
        result.put("status", feedback.getStatus());
        result.put("createdAt", feedback.getCreatedAt() != null ? feedback.getCreatedAt().toString() : null);
        return result;
    }

    @Override
    public Map<String, Object> uploadImage(String originalFilename, byte[] fileContent) {
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String url = uploadUrlPrefix + "/feedback/" + UUID.randomUUID() + ext;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }
}
