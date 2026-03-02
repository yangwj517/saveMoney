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

/**
 * 反馈控制器
 *
 * 处理用户反馈相关操作：
 * - 提交反馈
 * - 上传反馈附图
 *
 * 用于收集用户的意见和建议
 */
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * 提交用户反馈
     *
     * 用户提交对应用的意见和建议
     *
     * @param request 包含反馈内容的请求（反馈类型、内容、联系方式等）
     * @return 提交结果及反馈ID
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(feedbackService.submitFeedback(userId, request));
    }

    /**
     * 上传反馈图片
     *
     * 为反馈附加截图或其他相关图片
     *
     * @param file 图片文件
     * @return 上传结果及图片访问地址
     * @throws IOException IO异常
     */
    @PostMapping("/images/upload")
    public ApiResponse<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.success(feedbackService.uploadImage(file.getOriginalFilename(), file.getBytes()));
    }
}
