-- ============================================================
-- 攒钱记账 (SaveMoney) - MySQL 数据库初始化脚本
--
-- 数据库：MySQL 8.0+
-- 字符集：utf8mb4
-- 生成日期：2026-03-02
-- 使用方法：mysql -u root -p < init.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `saveapp`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `saveapp`;

-- 先按照依赖顺序删除旧表（子表在前，父表在后）
DROP TABLE IF EXISTS `sms_codes`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `reminder_settings`;
DROP TABLE IF EXISTS `reminders`;
DROP TABLE IF EXISTS `savings_deposits`;
DROP TABLE IF EXISTS `savings_goals`;
DROP TABLE IF EXISTS `budgets`;
DROP TABLE IF EXISTS `records`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `accounts`;
DROP TABLE IF EXISTS `users`;

-- ----------------------------------------------------------
-- 1. 用户表
-- 对应实体：User.java  |  表名：users
-- ----------------------------------------------------------
CREATE TABLE `users` (
    `id`         VARCHAR(36)  NOT NULL COMMENT '用户 ID（UUID）',
    `nickname`   VARCHAR(255) DEFAULT NULL COMMENT '昵称',
    `avatar`     VARCHAR(255) DEFAULT NULL COMMENT '头像 URL',
    `phone`      VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
    `password`   VARCHAR(255) DEFAULT NULL COMMENT '密码（加密存储）',
    `email`      VARCHAR(255) DEFAULT NULL COMMENT '邮箱',
    `created_at` DATETIME(6)  DEFAULT NULL COMMENT '注册时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ----------------------------------------------------------
-- 2. 账户表
-- 对应实体：Account.java  |  表名：accounts
-- ----------------------------------------------------------
CREATE TABLE `accounts` (
    `id`         VARCHAR(36)    NOT NULL COMMENT '账户ID（UUID）',
    `user_id`    VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `name`       VARCHAR(255)   NOT NULL COMMENT '账户名称',
    `balance`    DECIMAL(12,2)  DEFAULT 0.00 COMMENT '余额',
    `icon`       VARCHAR(255)   DEFAULT NULL COMMENT '图标',
    `color`      VARCHAR(50)    DEFAULT NULL COMMENT '颜色',
    `book_type`  VARCHAR(50)    DEFAULT NULL COMMENT '账簿类型（personal/family等）',
    `is_default` TINYINT(1)     DEFAULT 0 COMMENT '是否默认账户（0否 1是）',
    `created_at` DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_accounts_user_book` (`user_id`, `book_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户表';

-- ----------------------------------------------------------
-- 3. 分类表
-- 对应实体：Category.java  |  表名：categories
-- 注意：实体中 order 字段映射为 sort_order 列（order是MySQL保留字）
-- ----------------------------------------------------------
CREATE TABLE `categories` (
    `id`         VARCHAR(36)  NOT NULL COMMENT '分类ID（UUID）',
    `user_id`    VARCHAR(36)  DEFAULT NULL COMMENT '所属用户ID',
    `name`       VARCHAR(255) NOT NULL COMMENT '分类名称',
    `icon`       VARCHAR(255) DEFAULT NULL COMMENT '图标',
    `color`      VARCHAR(50)  DEFAULT NULL COMMENT '颜色',
    `type`       VARCHAR(20)  DEFAULT NULL COMMENT '类型（income收入/expense支出）',
    `book_type`  VARCHAR(50)  DEFAULT NULL COMMENT '账簿类型',
    `parent_id`  VARCHAR(36)  DEFAULT NULL COMMENT '父分类ID（NULL为顶级分类）',
    `sort_order` INT          DEFAULT NULL COMMENT '排序顺序',
    PRIMARY KEY (`id`),
    KEY `idx_categories_user_book` (`user_id`, `book_type`),
    KEY `idx_categories_user_book_type` (`user_id`, `book_type`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- ----------------------------------------------------------
-- 4. 账单记录表
-- 对应实体：Record.java  |  表名：records
-- ----------------------------------------------------------
CREATE TABLE `records` (
    `id`          VARCHAR(36)    NOT NULL COMMENT '记录ID（UUID）',
    `user_id`     VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `amount`      DECIMAL(12,2)  DEFAULT NULL COMMENT '金额',
    `type`        VARCHAR(20)    DEFAULT NULL COMMENT '类型（income收入/expense支出）',
    `category_id` VARCHAR(36)    DEFAULT NULL COMMENT '分类ID',
    `account_id`  VARCHAR(36)    DEFAULT NULL COMMENT '账户ID',
    `book_type`   VARCHAR(50)    DEFAULT NULL COMMENT '账簿类型',
    `date`        DATE           DEFAULT NULL COMMENT '账单日期',
    `note`        VARCHAR(500)   DEFAULT NULL COMMENT '备注',
    `images`      VARCHAR(2000)  DEFAULT NULL COMMENT '附图URL（逗号分隔）',
    `created_at`  DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    `updated_at`  DATETIME(6)    DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_records_user_book_date` (`user_id`, `book_type`, `date`),
    KEY `idx_records_user_book_type_date` (`user_id`, `book_type`, `type`, `date`),
    KEY `idx_records_user_category_date` (`user_id`, `category_id`, `date`),
    KEY `idx_records_user_book_cat_date` (`user_id`, `book_type`, `category_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单记录表';

-- ----------------------------------------------------------
-- 5. 预算表
-- 对应实体：Budget.java  |  表名：budgets
-- ----------------------------------------------------------
CREATE TABLE `budgets` (
    `id`               VARCHAR(36)    NOT NULL COMMENT '预算ID（UUID）',
    `user_id`          VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `category_id`      VARCHAR(36)    DEFAULT NULL COMMENT '分类ID（NULL为总预算）',
    `amount`           DECIMAL(12,2)  DEFAULT NULL COMMENT '预算额度',
    `used_amount`      DECIMAL(12,2)  DEFAULT 0.00 COMMENT '已使用额度',
    `period`           VARCHAR(20)    DEFAULT NULL COMMENT '周期（weekly/monthly/yearly）',
    `book_type`        VARCHAR(50)    DEFAULT NULL COMMENT '账簿类型',
    `alert_threshold`  INT            DEFAULT NULL COMMENT '提醒阈值（百分比，如80）',
    `is_alert_enabled` TINYINT(1)     DEFAULT 0 COMMENT '是否启用提醒（0否 1是）',
    PRIMARY KEY (`id`),
    KEY `idx_budgets_user_book` (`user_id`, `book_type`),
    KEY `idx_budgets_user_book_period` (`user_id`, `book_type`, `period`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算表';

-- ----------------------------------------------------------
-- 6. 储蓄目标表
-- 对应实体：SavingsGoal.java  |  表名：savings_goals
-- ----------------------------------------------------------
CREATE TABLE `savings_goals` (
    `id`             VARCHAR(36)    NOT NULL COMMENT '目标ID（UUID）',
    `user_id`        VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `name`           VARCHAR(255)   NOT NULL COMMENT '目标名称',
    `target_amount`  DECIMAL(12,2)  DEFAULT NULL COMMENT '目标金额',
    `current_amount` DECIMAL(12,2)  DEFAULT 0.00 COMMENT '当前已存金额',
    `book_type`      VARCHAR(50)    DEFAULT NULL COMMENT '账簿类型',
    `deadline`       DATE           DEFAULT NULL COMMENT '截止日期',
    `icon`           VARCHAR(255)   DEFAULT NULL COMMENT '图标',
    `color`          VARCHAR(50)    DEFAULT NULL COMMENT '颜色',
    `cover_image`    VARCHAR(255)   DEFAULT NULL COMMENT '封面图片URL',
    `is_completed`   TINYINT(1)     DEFAULT 0 COMMENT '是否已完成（0否 1是）',
    `created_at`     DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    `updated_at`     DATETIME(6)    DEFAULT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_savings_goals_user_book` (`user_id`, `book_type`),
    KEY `idx_savings_goals_completed` (`user_id`, `book_type`, `is_completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='储蓄目标表';

-- ----------------------------------------------------------
-- 7. 储蓄存取记录表
-- 对应实体：SavingsDeposit.java  |  表名：savings_deposits
-- ----------------------------------------------------------
CREATE TABLE `savings_deposits` (
    `id`         VARCHAR(36)    NOT NULL COMMENT '记录ID（UUID）',
    `goal_id`    VARCHAR(36)    DEFAULT NULL COMMENT '储蓄目标ID',
    `amount`     DECIMAL(12,2)  DEFAULT NULL COMMENT '金额（正数存入，负数提取）',
    `note`       VARCHAR(500)   DEFAULT NULL COMMENT '备注',
    `created_at` DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_savings_deposits_goal` (`goal_id`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='储蓄存取记录表';

-- ----------------------------------------------------------
-- 8. 提醒表
-- 对应实体：Reminder.java  |  表名：reminders
-- ----------------------------------------------------------
CREATE TABLE `reminders` (
    `id`          VARCHAR(36)    NOT NULL COMMENT '提醒ID（UUID）',
    `user_id`     VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `name`        VARCHAR(255)   NOT NULL COMMENT '提醒名称',
    `amount`      DECIMAL(12,2)  DEFAULT NULL COMMENT '金额',
    `due_day`     INT            DEFAULT NULL COMMENT '每月提醒日（1-31）',
    `category_id` VARCHAR(36)    DEFAULT NULL COMMENT '关联分类ID',
    `is_enabled`  TINYINT(1)     DEFAULT 1 COMMENT '是否启用（0否 1是）',
    `note`        VARCHAR(500)   DEFAULT NULL COMMENT '备注',
    `created_at`  DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_reminders_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提醒表';

-- ----------------------------------------------------------
-- 9. 提醒设置表（一个用户一条记录）
-- 对应实体：ReminderSettings.java  |  表名：reminder_settings
-- ----------------------------------------------------------
CREATE TABLE `reminder_settings` (
    `user_id`                VARCHAR(36)  NOT NULL COMMENT '用户ID（主键）',
    `bill_reminder`          TINYINT(1)   DEFAULT 1 COMMENT '启用账单提醒',
    `bill_reminder_time`     VARCHAR(10)  DEFAULT '09:00' COMMENT '账单提醒时间（HH:mm）',
    `savings_reminder`       TINYINT(1)   DEFAULT 1 COMMENT '启用储蓄提醒',
    `savings_reminder_time`  VARCHAR(10)  DEFAULT '20:00' COMMENT '储蓄提醒时间（HH:mm）',
    `budget_alert`           TINYINT(1)   DEFAULT 1 COMMENT '启用预算超额提醒',
    `budget_alert_threshold` INT          DEFAULT 80 COMMENT '预算提醒阈值（百分比）',
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提醒设置表';

-- ----------------------------------------------------------
-- 10. 通知表
-- 对应实体：Notification.java  |  表名：notifications
-- ----------------------------------------------------------
CREATE TABLE `notifications` (
    `id`         VARCHAR(36)    NOT NULL COMMENT '通知ID（UUID）',
    `user_id`    VARCHAR(36)    DEFAULT NULL COMMENT '所属用户ID',
    `type`       VARCHAR(50)    DEFAULT NULL COMMENT '类型（budget_alert/savings_progress等）',
    `title`      VARCHAR(255)   DEFAULT NULL COMMENT '标题',
    `content`    VARCHAR(1000)  DEFAULT NULL COMMENT '内容',
    `is_read`    TINYINT(1)     DEFAULT 0 COMMENT '是否已读（0未读 1已读）',
    `created_at` DATETIME(6)    DEFAULT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_notifications_user_read` (`user_id`, `is_read`),
    KEY `idx_notifications_user_time` (`user_id`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- ----------------------------------------------------------
-- 11. 用户反馈表
-- 对应实体：Feedback.java  |  表名：feedbacks
-- ----------------------------------------------------------
CREATE TABLE `feedbacks` (
    `id`         VARCHAR(36)    NOT NULL COMMENT '反馈ID（UUID）',
    `user_id`    VARCHAR(36)    DEFAULT NULL COMMENT '用户ID',
    `type`       VARCHAR(50)    DEFAULT NULL COMMENT '类型（bug/suggestion/feature）',
    `content`    VARCHAR(2000)  DEFAULT NULL COMMENT '内容',
    `contact`    VARCHAR(255)   DEFAULT NULL COMMENT '联系方式',
    `images`     VARCHAR(2000)  DEFAULT NULL COMMENT '附图URL（逗号分隔）',
    `status`     VARCHAR(20)    DEFAULT 'pending' COMMENT '状态（pending/processing/resolved）',
    `created_at` DATETIME(6)    DEFAULT NULL COMMENT '提交时间',
    PRIMARY KEY (`id`),
    KEY `idx_feedbacks_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户反馈表';

-- ----------------------------------------------------------
-- 12. 短信验证码表
-- 对应实体：SmsCode.java  |  表名：sms_codes
-- ----------------------------------------------------------
CREATE TABLE `sms_codes` (
    `id`        VARCHAR(36)  NOT NULL COMMENT '记录ID（UUID）',
    `phone`     VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
    `code`      VARCHAR(10)  DEFAULT NULL COMMENT '验证码',
    `expire_at` DATETIME(6)  DEFAULT NULL COMMENT '过期时间',
    `used`      TINYINT(1)   DEFAULT 0 COMMENT '是否已使用（0否 1是）',
    PRIMARY KEY (`id`),
    KEY `idx_sms_codes_phone_used` (`phone`, `used`, `expire_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码表';

-- ============================================================
-- 外键约束（可选 - 按需取消注释启用）
-- ============================================================
-- ALTER TABLE `accounts`          ADD CONSTRAINT `fk_accounts_user`          FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `categories`        ADD CONSTRAINT `fk_categories_user`        FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `categories`        ADD CONSTRAINT `fk_categories_parent`      FOREIGN KEY (`parent_id`)   REFERENCES `categories`(`id`) ON DELETE SET NULL;
-- ALTER TABLE `records`           ADD CONSTRAINT `fk_records_user`           FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `records`           ADD CONSTRAINT `fk_records_category`       FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;
-- ALTER TABLE `records`           ADD CONSTRAINT `fk_records_account`        FOREIGN KEY (`account_id`)  REFERENCES `accounts`(`id`) ON DELETE SET NULL;
-- ALTER TABLE `budgets`           ADD CONSTRAINT `fk_budgets_user`           FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `budgets`           ADD CONSTRAINT `fk_budgets_category`       FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;
-- ALTER TABLE `savings_goals`     ADD CONSTRAINT `fk_savings_goals_user`     FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `savings_deposits`  ADD CONSTRAINT `fk_savings_deposits_goal`  FOREIGN KEY (`goal_id`)     REFERENCES `savings_goals`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `reminders`         ADD CONSTRAINT `fk_reminders_user`         FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `reminders`         ADD CONSTRAINT `fk_reminders_category`     FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;
-- ALTER TABLE `reminder_settings` ADD CONSTRAINT `fk_reminder_settings_user` FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `notifications`     ADD CONSTRAINT `fk_notifications_user`     FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;
-- ALTER TABLE `feedbacks`         ADD CONSTRAINT `fk_feedbacks_user`         FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE;

-- ============================================================
-- 完成！共创建 12 张表：
--
--  序号 | 表名               | 说明
--  ---- | ------------------ | ----------------
--   1   | users              | 用户表
--   2   | accounts           | 账户表
--   3   | categories         | 分类表
--   4   | records            | 账单记录表
--   5   | budgets            | 预算表
--   6   | savings_goals      | 储蓄目标表
--   7   | savings_deposits   | 储蓄存取记录表
--   8   | reminders          | 提醒表
--   9   | reminder_settings  | 提醒设置表
--  10   | notifications      | 通知表
--  11   | feedbacks          | 用户反馈表
--  12   | sms_codes          | 短信验证码表
-- ============================================================

