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

/**
 * 账单记录业务实现类
 *
 * 实现账单记录相关的业务逻辑：
 * - 获取账单列表（支持多条件筛选和分页）
 * - 获取账单详情
 * - 创建账单
 * - 更新账单
 * - 删除账单
 * - 上传账单图片
 */
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

    /**
     * 获取账单列表（支持多条件筛选和分页）
     *
     * 支持的筛选条件：
     * - 用户ID和账簿类型（必需）
     * - 账单类型：收入或支出
     * - 分类ID：特定分类
     * - 账户ID：特定账户
     * - 日期范围：开始日期和结束日期
     * - 关键词：在备注中模糊搜索
     *
     * 返回结果按日期倒序排列，再按创建时间倒序
     *
     * @param userId 用户ID
     * @param bookType 账簿类型
     * @param type 账单类型（可选）
     * @param categoryId 分类ID（可选）
     * @param accountId 账户ID（可选）
     * @param startDate 开始日期（可选，格式：yyyy-MM-dd）
     * @param endDate 结束日期（可选，格式：yyyy-MM-dd）
     * @param keyword 关键词（可选）
     * @param page 页码（从1开始）
     * @param pageSize 每页数量
     * @return 包含分页数据的Map
     */
    @Override
    public Map<String, Object> getRecords(String userId, String bookType, String type,
                                           String categoryId, String accountId,
                                           String startDate, String endDate,
                                           String keyword, int page, int pageSize) {
        // 构建动态查询条件（使用JPA Specification）
        Specification<Record> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 必须条件：用户ID和账簿类型
            predicates.add(cb.equal(root.get("userId"), userId));
            predicates.add(cb.equal(root.get("bookType"), bookType));

            // 可选条件：账单类型
            if (type != null && !type.isEmpty()) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            // 可选条件：分类ID
            if (categoryId != null && !categoryId.isEmpty()) {
                predicates.add(cb.equal(root.get("categoryId"), categoryId));
            }
            // 可选条件：账户ID
            if (accountId != null && !accountId.isEmpty()) {
                predicates.add(cb.equal(root.get("accountId"), accountId));
            }
            // 可选条件：开始日期
            if (startDate != null && !startDate.isEmpty()) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), LocalDate.parse(startDate)));
            }
            // 可选条件：结束日期
            if (endDate != null && !endDate.isEmpty()) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), LocalDate.parse(endDate)));
            }
            // 可选条件：关键词模糊搜索（在备注中搜索）
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(root.get("note"), "%" + keyword + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 执行分页查询，按日期倒序，再按创建时间倒序
        Page<Record> pageResult = recordRepository.findAll(spec,
                PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "date", "createdAt")));

        // 将实体转换为Map格式
        List<Map<String, Object>> list = pageResult.getContent().stream()
                .map(this::toDetailMap)
                .collect(Collectors.toList());

        // 构建分页信息
        Map<String, Object> pagination = new LinkedHashMap<>();
        pagination.put("page", page);
        pagination.put("pageSize", pageSize);
        pagination.put("total", pageResult.getTotalElements());
        pagination.put("totalPages", pageResult.getTotalPages());

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("pagination", pagination);
        return result;
    }

    /**
     * 获取账单详情
     *
     * @param userId 用户ID
     * @param id 账单ID
     * @return 账单详情
     * @throws BusinessException 如果账单不存在或无权操作
     */
    @Override
    public Map<String, Object> getRecord(String userId, String id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));

        // 权限验证：只能查看属于自己的账单
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return toDetailMap(record);
    }

    /**
     * 创建账单
     *
     * @param userId 用户ID
     * @param request 账单创建请求
     * @return 创建后的账单详情
     */
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

        // 将图片列表转换为逗号分隔的字符串存储
        if (request.getImages() != null) {
            record.setImages(String.join(",", request.getImages()));
        }
        recordRepository.save(record);
        return toDetailMap(record);
    }

    /**
     * 更新账单
     *
     * 支持部分更新，只更新非null的字段
     *
     * @param userId 用户ID
     * @param id 账单ID
     * @param request 账单更新请求
     * @return 更新后的账单详情
     * @throws BusinessException 如果账单不存在或无权操作
     */
    @Override
    @Transactional
    public Map<String, Object> updateRecord(String userId, String id, RecordUpdateRequest request) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));

        // 权限验证：只能修改属于自己的账单
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        // 选择性更新账单信息
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

    /**
     * 删除账单
     *
     * @param userId 用户ID
     * @param id 账单ID
     * @throws BusinessException 如果账单不存在或无权操作
     */
    @Override
    @Transactional
    public void deleteRecord(String userId, String id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));

        // 权限验证：只能删除属于自己的账单
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        recordRepository.delete(record);
    }

    /**
     * 上传账单图片
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
        // 生成唯一的URL
        String url = uploadUrlPrefix + "/records/" + UUID.randomUUID() + ext;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }

    /**
     * 将Record实体转换为详细Map格式
     *
     * 包含字段：
     * - 账单基本信息：id、金额、类型、日期、备注
     * - 关联信息：分类详情、账户详情
     * - 附加信息：图片列表、创建/更新时间
     *
     * 注意：会同时查询关联的分类和账户信息
     *
     * @param r 账单实体
     * @return 账单详细信息Map
     */
    private Map<String, Object> toDetailMap(Record r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", r.getId());
        map.put("amount", r.getAmount());
        map.put("type", r.getType());
        map.put("categoryId", r.getCategoryId());

        // 获取分类详情
        map.put("category", null);
        if (r.getCategoryId() != null) {
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
        }

        map.put("accountId", r.getAccountId());

        // 获取账户详情
        map.put("account", null);
        if (r.getAccountId() != null) {
            accountRepository.findById(r.getAccountId()).ifPresent(acc -> {
                Map<String, Object> accMap = new LinkedHashMap<>();
                accMap.put("id", acc.getId());
                accMap.put("name", acc.getName());
                accMap.put("icon", acc.getIcon());
                accMap.put("color", acc.getColor());
                map.put("account", accMap);
            });
        }

        map.put("bookType", r.getBookType());
        map.put("date", r.getDate() != null ? r.getDate().toString() : null);
        map.put("note", r.getNote());

        // 解析并返回图片列表
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
        map.put("category", null);
        if (r.getCategoryId() != null) {
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
        }

        map.put("accountId", r.getAccountId());

        // Fetch account
        map.put("account", null);
        if (r.getAccountId() != null) {
            accountRepository.findById(r.getAccountId()).ifPresent(acc -> {
                Map<String, Object> accMap = new LinkedHashMap<>();
                accMap.put("id", acc.getId());
                accMap.put("name", acc.getName());
                accMap.put("icon", acc.getIcon());
                accMap.put("color", acc.getColor());
                map.put("account", accMap);
            });
        }

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
