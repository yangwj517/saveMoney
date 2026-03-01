package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.FeedbackRequest;
import java.util.Map;

public interface FeedbackService {
    Map<String, Object> submitFeedback(String userId, FeedbackRequest request);
    Map<String, Object> uploadImage(String originalFilename, byte[] fileContent);
}
