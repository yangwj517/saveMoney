package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.RecordRequest;
import com.zanqian.savemoney.dto.RecordUpdateRequest;
import java.util.Map;

/**
 * 账单记录服务接口
 *
 * 定义账单记录相关的业务逻辑
 */
public interface RecordService {
    /**
     * 获取账单列表（支持多条件筛选和分页）
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型
     * @param categoryId 分类ID
     * @param accountId 账户ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param keyword 关键词
     * @param page 页码
     * @param pageSize 每页数量
     * @return 分页的账单列表
     */
    Map<String, Object> getRecords(String userId, String bookType, String type, String categoryId,
                                    String accountId, String startDate, String endDate,
                                    String keyword, int page, int pageSize);

    /**
     * 获取账单详情
     *
     * @param userId 用户ID
     * @param id 账单ID
     * @return 账单详情
     */
    Map<String, Object> getRecord(String userId, String id);

    /**
     * 创建账单
     *
     * @param userId 用户ID
     * @param request 创建请求
     * @return 创建后的账单信息
     */
    Map<String, Object> createRecord(String userId, RecordRequest request);

    /**
     * 更新账单
     *
     * @param userId 用户ID
     * @param id 账单ID
     * @param request 更新请求
     * @return 更新后的账单信息
     */
    Map<String, Object> updateRecord(String userId, String id, RecordUpdateRequest request);

    /**
     * 删除账单
     *
     * @param userId 用户ID
     * @param id 账单ID
     */
    void deleteRecord(String userId, String id);

    /**
     * 上传账单图片
     *
     * @param originalFilename 原始文件名
     * @param fileContent 文件内容
     * @return 上传结果，包含图片URL
     */
    Map<String, Object> uploadImage(String originalFilename, byte[] fileContent);
}
