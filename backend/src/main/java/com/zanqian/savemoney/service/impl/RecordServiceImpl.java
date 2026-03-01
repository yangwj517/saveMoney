package com.zanqian.savemoney.service.impl;

import com.zanqian.savemoney.common.ErrorCode;
import com.zanqian.savemoney.common.exception.BusinessException;
import com.zanqian.savemoney.dto.RecordRequest;
import com.zanqian.savemoney.dto.RecordUpdateRequest;
import com.zanqian.savemoney.entity.Account;
import com.zanqian.savemoney.entity.Category;
import com.zanqian.savemoney.entity.Record;
import com.zanqian.savemoney.repository.AccountRepository;
import com.zanqian.savemoney.repository.CategoryRepository;
import com.zanqian.savemoney.repository.RecordRepository;
import com.zanqian.savemoney.service.RecordService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    @Value("${app.upload.url-prefix}")
    private String uploadUrlPrefix;

    public RecordServiceImpl(RecordRepository recordRepository,
                             CategoryRepository categoryRepository,
                             AccountRepository accountRepository) {
        this.recordRepository = recordRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public Map<String, Object> getRecords(String userId, String bookType, String type,
                                           String categoryId, String accountId,
                                           String startDate, String endDate,
                                           String keyword, int page, int pageSize) {
        Specification<Record> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("userId"), userId));
            predicates.add(cb.equal(root.get("bookType"), bookType));

            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (categoryId != null && !categoryId.isEmpty()) {
                predicates.add(cb.equal(root.get("categoryId"), categoryId));
            }
            if (accountId != null && !accountId.isEmpty()) {
                predicates.add(cb.equal(root.get("accountId"), accountId));
            }
            if (startDate != null && !startDate.isEmpty()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), LocalDate.parse(startDate)));
            }
            if (endDate != null && !endDate.isEmpty()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), LocalDate.parse(endDate)));
            }
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(root.get("note"), "%" + keyword + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Record> pageResult = recordRepository.findAll(spec,
                PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "date", "createdAt")));

        List<Map<String, Object>> list = pageResult.getContent().stream()
                .map(this::toDetailMap)
                .collect(Collectors.toList());

        Map<String, Object> pagination = new LinkedHashMap<>();
        pagination.put("page", page);
        pagination.put("pageSize", pageSize);
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("totalPages", pageResult.getTotalPages());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("pagination", pagination);
        return result;
    }

    @Override
    public Map<String, Object> getRecord(String userId, String id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return toDetailMap(record);
    }

    @Override
    @Transactional
    public Map<String, Object> createRecord(String userId, RecordRequest request) {
        Record record = new Record();
        record.setUserId(userId);
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategoryId(request.getCategoryId());
        record.setAccountId(request.getAccountId());
        record.setBookType(request.getBookType());
        record.setDate(LocalDate.parse(request.getDate()));
        record.setNote(request.getNote());
        if (request.getImages() != null) {
            record.setImages(String.join(",", request.getImages()));
        }
        recordRepository.save(record);
        return toDetailMap(record);
    }

    @Override
    @Transactional
    public Map<String, Object> updateRecord(String userId, String id, RecordUpdateRequest request) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        if (request.getAmount() != null) record.setAmount(request.getAmount());
        if (request.getType() != null) record.setType(request.getType());
        if (request.getCategoryId() != null) record.setCategoryId(request.getCategoryId());
        if (request.getAccountId() != null) record.setAccountId(request.getAccountId());
        if (request.getDate() != null) record.setDate(LocalDate.parse(request.getDate()));
        if (request.getNote() != null) record.setNote(request.getNote());
        if (request.getImages() != null) record.setImages(String.join(",", request.getImages()));
        recordRepository.save(record);
        return toDetailMap(record);
    }

    @Override
    @Transactional
    public void deleteRecord(String userId, String id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        recordRepository.delete(record);
    }

    @Override
    public Map<String, Object> uploadImage(String originalFilename, byte[] fileContent) {
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String url = uploadUrlPrefix + "/records/" + UUID.randomUUID() + ext;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }

    private Map<String, Object> toDetailMap(Record r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("amount", r.getAmount());
        map.put("type", r.getType());
        map.put("categoryId", r.getCategoryId());

        // Fetch category
        categoryRepository.findById(r.getCategoryId()).ifPresent(cat -> {
            Map<String, Object> catMap = new LinkedHashMap<>();
            catMap.put("id", cat.getId());
            catMap.put("name", cat.getName());
            catMap.put("icon", cat.getIcon());
            catMap.put("color", cat.getColor());
            catMap.put("type", cat.getType());
            catMap.put("bookType", cat.getBookType());
            map.put("category", catMap);
        });

        map.put("accountId", r.getAccountId());

        // Fetch account
        accountRepository.findById(r.getAccountId()).ifPresent(acc -> {
            Map<String, Object> accMap = new LinkedHashMap<>();
            accMap.put("id", acc.getId());
            accMap.put("name", acc.getName());
            accMap.put("icon", acc.getIcon());
            accMap.put("color", acc.getColor());
            map.put("account", accMap);
        });

        map.put("bookType", r.getBookType());
        map.put("date", r.getDate() != null ? r.getDate().toString() : null);
        map.put("note", r.getNote());

        // Parse images
        List<String> images = new ArrayList<>();
        if (r.getImages() != null && !r.getImages().isEmpty()) {
            images = Arrays.asList(r.getImages().split(","));
        }
        map.put("images", images);

        map.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        map.put("updatedAt", r.getUpdatedAt() != null ? r.getUpdatedAt().toString() : null);
        return map;
    }
}
