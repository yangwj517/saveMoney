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

@RestController
@RequestMapping("/records")
public class RecordController {

    private final RecordService recordService;

    public RecordController(RecordService recordService) {
        this.recordService = recordService;
    }

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

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getRecord(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.getRecord(userId, id));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createRecord(@Valid @RequestBody RecordRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.createRecord(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateRecord(@PathVariable String id,
                                                          @Valid @RequestBody RecordUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(recordService.updateRecord(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteRecord(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        recordService.deleteRecord(userId, id);
        return ApiResponse.success();
    }

    @PostMapping("/images/upload")
    public ApiResponse<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.success(recordService.uploadImage(file.getOriginalFilename(), file.getBytes()));
    }
}
