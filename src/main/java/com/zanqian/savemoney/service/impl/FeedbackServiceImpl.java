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

/**
 * 用户反馈业务实现类
 *
 * 实现用户反馈相关的业务逻辑：
 * - 提交用户反馈（包括反馈类型、内容、联系方式和附图）
 * - 上传反馈附图
 */
@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    /** 文件上传URL前缀，从配置文件注入 */
    @Value("${app.upload.url-prefix}")
    private String uploadUrlPrefix;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    /**
     * 提交用户反馈
     *
     * 创建反馈记录，初始状态为"待处理"（pending）
     * 支持附加多张图片
     *
     * @param userId 用户ID
     * @param request 反馈请求（包含类型、内容、联系方式、图片列表）
     * @return 反馈提交结果
     */
    @Override
    @Transactional
    public Map<String, Object> submitFeedback(String userId, FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setType(request.getType());
        feedback.setContent(request.getContent());
        feedback.setContact(request.getContact());

        // 将图片列表转换为逗号分隔的字符串存储
        if (request.getImages() != null) {
            feedback.setImages(String.join(",", request.getImages()));
        }

        // 初始状态为待处理
        feedback.setStatus("pending");
        feedbackRepository.save(feedback);

        // 构建反馈提交结果
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

    /**
     * 上传反馈图片
     *
     * 生成唯一的URL并返回
     * 实际的文件保存需要由其他服务处理
     *
     * @param originalFilename 原始文件名
     * @param fileContent 文件内容（二进制）
     * @return 包含图片URL的Map
     */
    @Override
    public Map<String, Object> uploadImage(String originalFilename, byte[] fileContent) {
        // 提取文件后缀名
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        // 生成唯一的URL（使用UUID保证文件名唯一性）
        String url = uploadUrlPrefix + "/feedback/" + UUID.randomUUID() + ext;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }
}
