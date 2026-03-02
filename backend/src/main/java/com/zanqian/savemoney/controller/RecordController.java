package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.RecordRequest;
import com.zanqian.savemoney.dto.RecordUpdateRequest;
import com.zanqian.savemoney.service.RecordService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * 账单记录控制器
 *
 * 处理账单记录相关操作：
 * - 获取账单列表（支持多条件筛选）
 * - 获取账单详情
 * - 创建账单
 * - 修改账单
 * - 删除账单
 * - 上传账单附图
 */
@RestController
@RequestMapping("/records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

    /**
     * 获取账单列表
     *
     * 支持多条件组合查询：
     * - 按账簿类型、账单类型、分类、账户、日期范围、关键词筛选
     * - 支持分页
     *
     * @param bookType 账簿类型
     * @param type 账单类型（可选，"income"收入或"expense"支出）
     * @param categoryId 分类ID（可选）
     * @param accountId 账户ID（可选）
     * @param startDate 开始日期（可选，格式：yyyy-MM-dd）
     * @param endDate 结束日期（可选，格式：yyyy-MM-dd）
     * @param keyword 关键词（可选，用于搜索备注）
     * @param page 页码（默认1）
     * @param pageSize 每页数量（默认20）
     * @return 分页的账单列表
     */
    @GetMapping
    public ApiResponse<Map<String, Object>> getRecords(
            @RequestParam String bookType,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String accountId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.getRecords(userId, bookType, type, categoryId,
                accountId, startDate, endDate, keyword, page, pageSize));
    }

    /**
     * 获取账单详情
     *
     * 获取单条账单的完整信息
     *
     * @param id 账单ID
     * @return 账单详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getRecord(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.getRecord(userId, id));
    }

    /**
     * 创建账单
     *
     * 创建新的收支账单
     *
     * @param request 包含账单信息的请求
     * @return 创建后的账单信息
     */
    @PostMapping
    public ApiResponse<Map<String, Object>> createRecord(@Valid @RequestBody RecordRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.createRecord(userId, request));
    }

    /**
     * 更新账单
     *
     * 修改指定账单的信息
     *
     * @param id 账单ID
     * @param request 包含更新信息的请求
     * @return 更新后的账单信息
     */
    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateRecord(@PathVariable String id,
                                                          @Valid @RequestBody RecordUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.updateRecord(userId, id, request));
    }

    /**
     * 删除账单
     *
     * 删除指定的账单
     *
     * @param id 账单ID
     * @return 删除成功响应
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecord(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        recordService.deleteRecord(userId, id);
        return ApiResponse.success();
    }

    /**
     * 上传账单图片
     *
     * 为账单上传附加图片（如收据、发票等）
     *
     * @param file 图片文件
     * @return 上传结果及图片访问地址
     * @throws IOException IO异常
     */
    @PostMapping("/images/upload")
    public ApiResponse<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.success(recordService.uploadImage(file.getOriginalFilename(), file.getBytes()));
    }
}
