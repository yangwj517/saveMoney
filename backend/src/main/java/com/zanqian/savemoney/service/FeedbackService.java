package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.FeedbackRequest;
import java.util.Map;

/**
 * 反馈服务接口
 *
 * 定义用户反馈相关的业务逻辑
 */
public interface FeedbackService {
    /**
     * 提交用户反馈
     *
     * @param userId 用户ID
     * @param request 反馈请求
     * @return 反馈提交结果
     */
    Map<String, Object> submitFeedback(String userId, FeedbackRequest request);

    /**
     * 上传反馈图片
     *
     * @param originalFilename 原始文件名
     * @param fileContent 文件内容
     * @return 上传结果，包含图片URL
     */
    Map<String, Object> uploadImage(String originalFilename, byte[] fileContent);
}
