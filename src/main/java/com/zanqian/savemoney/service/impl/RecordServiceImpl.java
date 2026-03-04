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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
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

    @Value("${app.upload.url-prefix:https://cdn.zanqian.app}")
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
        // 验证分页参数
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        // 构建动态查询条件（使用JPA Specification）
        Specification<Record> spec = buildSpecification(userId, bookType, type, categoryId,
                accountId, startDate, endDate, keyword);

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
        pagination.put("hasNext", pageResult.hasNext());
        pagination.put("hasPrevious", pageResult.hasPrevious());

        // 构建返回结果
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("list", list);
        result.put("pagination", pagination);

        // 添加统计信息
        result.put("totalIncome", calculateTotalIncome(list));
        result.put("totalExpense", calculateTotalExpense(list));

        return result;
    }

    /**
     * 构建查询条件
     */
    private Specification<Record> buildSpecification(String userId, String bookType, String type,
                                                     String categoryId, String accountId,
                                                     String startDate, String endDate, String keyword) {
        return (root, query, cb) -> {
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
                try {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("date"), LocalDate.parse(startDate)));
                } catch (DateTimeParseException e) {
                    // 忽略无效日期
                }
            }
            // 可选条件：结束日期
            if (endDate != null && !endDate.isEmpty()) {
                try {
                    predicates.add(cb.lessThanOrEqualTo(root.get("date"), LocalDate.parse(endDate)));
                } catch (DateTimeParseException e) {
                    // 忽略无效日期
                }
            }
            // 可选条件：关键词模糊搜索（在备注中搜索）
            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("note")), "%" + keyword.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * 计算总收入
     */
    private BigDecimal calculateTotalIncome(List<Map<String, Object>> records) {
        return records.stream()
                .filter(r -> "income".equals(r.get("type")))
                .map(r -> (BigDecimal) r.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 计算总支出
     */
    private BigDecimal calculateTotalExpense(List<Map<String, Object>> records) {
        return records.stream()
                .filter(r -> "expense".equals(r.get("type")))
                .map(r -> (BigDecimal) r.get("amount"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
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
        Record record = findRecordByIdAndUserId(id, userId);
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
        // 验证请求参数
        validateRecordRequest(request);

        // 验证分类和账户是否存在（可选）
        validateCategoryAndAccount(request.getCategoryId(), request.getAccountId(), userId, request.getBookType());

        Record record = new Record();
        record.setUserId(userId);
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategoryId(request.getCategoryId());
        record.setAccountId(request.getAccountId());
        record.setBookType(request.getBookType());

        try {
            record.setDate(LocalDate.parse(request.getDate()));
        } catch (DateTimeParseException e) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "日期格式错误，应为yyyy-MM-dd");
        }

        record.setNote(request.getNote());

        // 将图片列表转换为逗号分隔的字符串存储
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            record.setImages(String.join(",", request.getImages()));
        }

        recordRepository.save(record);

        // 更新账户余额
        updateAccountBalance(record, true);

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
        Record record = findRecordByIdAndUserId(id, userId);

        // 保存原账户ID和金额用于更新余额
        String oldAccountId = record.getAccountId();
        BigDecimal oldAmount = record.getAmount();
        String oldType = record.getType();

        // 选择性更新账单信息
        boolean accountChanged = false;

        if (request.getAmount() != null) {
            if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "金额必须大于0");
            }
            record.setAmount(request.getAmount());
        }

        if (request.getType() != null) {
            if (!List.of("income", "expense").contains(request.getType())) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "账单类型无效");
            }
            record.setType(request.getType());
        }

        if (request.getCategoryId() != null) {
            validateCategory(request.getCategoryId(), userId, record.getBookType());
            record.setCategoryId(request.getCategoryId());
        }

        if (request.getAccountId() != null) {
            validateAccount(request.getAccountId(), userId, record.getBookType());
            record.setAccountId(request.getAccountId());
            accountChanged = true;
        }

        if (request.getDate() != null) {
            try {
                record.setDate(LocalDate.parse(request.getDate()));
            } catch (DateTimeParseException e) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "日期格式错误，应为yyyy-MM-dd");
            }
        }

        if (request.getNote() != null) {
            record.setNote(request.getNote());
        }

        if (request.getImages() != null) {
            if (request.getImages().isEmpty()) {
                record.setImages(null);
            } else {
                record.setImages(String.join(",", request.getImages()));
            }
        }

        recordRepository.save(record);

        // 如果账户或金额或类型发生变化，更新账户余额
        if (accountChanged || !oldAmount.equals(record.getAmount()) || !oldType.equals(record.getType())) {
            // 恢复原账户余额
            revertAccountBalance(oldAccountId, oldAmount, oldType);
            // 更新新账户余额
            updateAccountBalance(record, true);
        }

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
        Record record = findRecordByIdAndUserId(id, userId);

        // 恢复账户余额
        revertAccountBalance(record.getAccountId(), record.getAmount(), record.getType());

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
            // 验证文件类型
            if (!List.of(".jpg", ".jpeg", ".png", ".gif", ".webp").contains(ext.toLowerCase())) {
                throw new BusinessException(ErrorCode.PARAM_ERROR, "不支持的图片格式");
            }
        }

        // 生成唯一的URL
        String url = uploadUrlPrefix + "/records/" + UUID.randomUUID() + ext;

        // TODO: 实际保存文件到OSS或本地存储

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("url", url);
        return result;
    }

    /**
     * 根据ID和用户ID查找记录
     */
    private Record findRecordByIdAndUserId(String id, String userId) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "记录不存在"));

        // 权限验证：只能操作属于自己的账单
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "无权操作此记录");
        }

        return record;
    }

    /**
     * 验证账单创建请求
     */
    private void validateRecordRequest(RecordRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "金额必须大于0");
        }

        if (request.getType() == null || (!"income".equals(request.getType()) && !"expense".equals(request.getType()))) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "账单类型无效，必须是income或expense");
        }

        if (request.getDate() == null || request.getDate().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "日期不能为空");
        }

        if (request.getBookType() == null || request.getBookType().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_ERROR, "账簿类型不能为空");
        }
    }

    /**
     * 验证分类和账户
     */
    private void validateCategoryAndAccount(String categoryId, String accountId, String userId, String bookType) {
        if (categoryId != null) {
            validateCategory(categoryId, userId, bookType);
        }

        if (accountId != null) {
            validateAccount(accountId, userId, bookType);
        }
    }

    /**
     * 验证分类
     */
    private void validateCategory(String categoryId, String userId, String bookType) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "分类不存在"));

        // 预设分类（userId 为 null）所有人都可以使用，只需验证账本类型
        // 用户自定义分类需要验证 userId 和 bookType
        if (category.getUserId() != null) {
            // 用户自定义分类
            if (!category.getUserId().equals(userId) || !category.getBookType().equals(bookType)) {
                throw new BusinessException(ErrorCode.FORBIDDEN, "无权使用此分类");
            }
        } else {
            // 预设分类，只验证账本类型
            if (!category.getBookType().equals(bookType)) {
                throw new BusinessException(ErrorCode.FORBIDDEN, "无权使用此分类");
            }
        }
    }

    /**
     * 验证账户
     */
    private void validateAccount(String accountId, String userId, String bookType) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DATA_NOT_FOUND, "账户不存在"));

        if (!account.getUserId().equals(userId) || !account.getBookType().equals(bookType)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "无权使用此账户");
        }
    }

    /**
     * 更新账户余额
     */
    private void updateAccountBalance(Record record, boolean isAdd) {
        if (record.getAccountId() == null) return;

        accountRepository.findById(record.getAccountId()).ifPresent(account -> {
            BigDecimal amount = record.getAmount();
            if ("expense".equals(record.getType())) {
                amount = amount.negate();
            }

            if (isAdd) {
                account.setBalance(account.getBalance().add(amount));
            } else {
                account.setBalance(account.getBalance().subtract(amount));
            }

            accountRepository.save(account);
        });
    }

    /**
     * 恢复账户余额（删除或修改时使用）
     */
    private void revertAccountBalance(String accountId, BigDecimal amount, String type) {
        if (accountId == null) return;

        accountRepository.findById(accountId).ifPresent(account -> {
            // 删除时反向操作：收入则减去，支出则加上
            if ("income".equals(type)) {
                account.setBalance(account.getBalance().subtract(amount));
            } else if ("expense".equals(type)) {
                account.setBalance(account.getBalance().add(amount));
            }

            accountRepository.save(account);
        });
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
     * @param record 账单实体
     * @return 账单详细信息Map
     */
    private Map<String, Object> toDetailMap(Record record) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", record.getId());
        map.put("amount", record.getAmount());
        map.put("type", record.getType());
        map.put("categoryId", record.getCategoryId());

        // 获取分类详情
        map.put("category", getCategoryMap(record.getCategoryId()));

        map.put("accountId", record.getAccountId());

        // 获取账户详情
        map.put("account", getAccountMap(record.getAccountId()));

        map.put("bookType", record.getBookType());
        map.put("date", record.getDate() != null ? record.getDate().toString() : null);
        map.put("note", record.getNote());

        // 解析并返回图片列表
        map.put("images", parseImages(record.getImages()));

        map.put("createdAt", record.getCreatedAt() != null ? record.getCreatedAt().toString() : null);
        map.put("updatedAt", record.getUpdatedAt() != null ? record.getUpdatedAt().toString() : null);

        return map;
    }

    /**
     * 获取分类Map
     */
    private Map<String, Object> getCategoryMap(String categoryId) {
        if (categoryId == null) return null;

        Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
        if (categoryOpt.isEmpty()) return null;

        Category cat = categoryOpt.get();
        Map<String, Object> catMap = new LinkedHashMap<>();
        catMap.put("id", cat.getId());
        catMap.put("name", cat.getName());
        catMap.put("icon", cat.getIcon());
        catMap.put("color", cat.getColor());
        catMap.put("type", cat.getType());
        catMap.put("bookType", cat.getBookType());
        return catMap;
    }

    /**
     * 获取账户Map
     */
    private Map<String, Object> getAccountMap(String accountId) {
        if (accountId == null) return null;

        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isEmpty()) return null;

        Account acc = accountOpt.get();
        Map<String, Object> accMap = new LinkedHashMap<>();
        accMap.put("id", acc.getId());
        accMap.put("name", acc.getName());
        accMap.put("icon", acc.getIcon());
        accMap.put("color", acc.getColor());
        accMap.put("balance", acc.getBalance());
        return accMap;
    }

    /**
     * 解析图片字符串为列表
     */
    private List<String> parseImages(String imagesStr) {
        if (imagesStr == null || imagesStr.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(imagesStr.split(","));
    }
}