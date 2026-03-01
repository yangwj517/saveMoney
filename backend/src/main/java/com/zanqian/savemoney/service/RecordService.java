package com.zanqian.savemoney.service;

import com.zanqian.savemoney.dto.RecordRequest;
import com.zanqian.savemoney.dto.RecordUpdateRequest;
import java.util.Map;

public interface RecordService {
    Map<String, Object> getRecords(String userId, String bookType, String type, String categoryId,
                                    String accountId, String startDate, String endDate,
                                    String keyword, int page, int pageSize);
    Map<String, Object> getRecord(String userId, String id);
    Map<String, Object> createRecord(String userId, RecordRequest request);
    Map<String, Object> updateRecord(String userId, String id, RecordUpdateRequest request);
    void deleteRecord(String userId, String id);
    Map<String, Object> uploadImage(String originalFilename, byte[] fileContent);
}
