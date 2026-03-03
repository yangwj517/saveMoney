-- ============================================================
-- 攒钱记账 - 默认分类数据初始化脚本
-- 
-- 说明：这些是系统预设分类，user_id 为 NULL 表示公共分类
-- 用户可以基于这些分类进行自定义
-- ============================================================

USE `saveapp`;

-- 清空旧的默认分类（user_id 为 NULL 的记录）
DELETE FROM `categories` WHERE `user_id` IS NULL;

-- ----------------------------------------------------------
-- 个人账本 - 支出分类（15个）
-- ----------------------------------------------------------
INSERT INTO `categories` (`id`, `user_id`, `name`, `icon`, `color`, `type`, `book_type`, `parent_id`, `sort_order`) VALUES
('p_exp_food', NULL, '餐饮', '🍜', '#FF9800', 'expense', 'personal', NULL, 1),
('p_exp_transport', NULL, '交通', '🚗', '#2196F3', 'expense', 'personal', NULL, 2),
('p_exp_shopping', NULL, '购物', '🛒', '#E91E63', 'expense', 'personal', NULL, 3),
('p_exp_entertainment', NULL, '娱乐', '🎮', '#9C27B0', 'expense', 'personal', NULL, 4),
('p_exp_home', NULL, '住房', '🏠', '#795548', 'expense', 'personal', NULL, 5),
('p_exp_utility', NULL, '水电燃', '💡', '#FFC107', 'expense', 'personal', NULL, 6),
('p_exp_communication', NULL, '通讯', '📱', '#00BCD4', 'expense', 'personal', NULL, 7),
('p_exp_medical', NULL, '医疗', '💊', '#F44336', 'expense', 'personal', NULL, 8),
('p_exp_education', NULL, '教育', '📚', '#3F51B5', 'expense', 'personal', NULL, 9),
('p_exp_gift', NULL, '人情', '🎁', '#FF5722', 'expense', 'personal', NULL, 10),
('p_exp_clothes', NULL, '服饰', '👔', '#607D8B', 'expense', 'personal', NULL, 11),
('p_exp_beauty', NULL, '美容', '💄', '#EC407A', 'expense', 'personal', NULL, 12),
('p_exp_sports', NULL, '运动', '⚽', '#4CAF50', 'expense', 'personal', NULL, 13),
('p_exp_pet', NULL, '宠物', '🐱', '#8D6E63', 'expense', 'personal', NULL, 14),
('p_exp_other', NULL, '其他', '📝', '#9E9E9E', 'expense', 'personal', NULL, 15);

-- ----------------------------------------------------------
-- 个人账本 - 收入分类（7个）
-- ----------------------------------------------------------
INSERT INTO `categories` (`id`, `user_id`, `name`, `icon`, `color`, `type`, `book_type`, `parent_id`, `sort_order`) VALUES
('p_inc_salary', NULL, '工资', '💰', '#4CAF50', 'income', 'personal', NULL, 1),
('p_inc_bonus', NULL, '奖金', '🎉', '#FF9800', 'income', 'personal', NULL, 2),
('p_inc_invest', NULL, '投资', '📈', '#2196F3', 'income', 'personal', NULL, 3),
('p_inc_parttime', NULL, '兼职', '💼', '#9C27B0', 'income', 'personal', NULL, 4),
('p_inc_redpacket', NULL, '红包', '🧧', '#F44336', 'income', 'personal', NULL, 5),
('p_inc_refund', NULL, '退款', '↩️', '#00BCD4', 'income', 'personal', NULL, 6),
('p_inc_other', NULL, '其他', '📝', '#9E9E9E', 'income', 'personal', NULL, 7);

-- ----------------------------------------------------------
-- 公司账本 - 支出分类（13个）
-- ----------------------------------------------------------
INSERT INTO `categories` (`id`, `user_id`, `name`, `icon`, `color`, `type`, `book_type`, `parent_id`, `sort_order`) VALUES
('b_exp_salary', NULL, '工资', '💵', '#4CAF50', 'expense', 'business', NULL, 1),
('b_exp_rent', NULL, '房租', '🏢', '#795548', 'expense', 'business', NULL, 2),
('b_exp_utility', NULL, '水电', '💡', '#FFC107', 'expense', 'business', NULL, 3),
('b_exp_office', NULL, '办公', '🖨️', '#607D8B', 'expense', 'business', NULL, 4),
('b_exp_marketing', NULL, '营销', '📢', '#E91E63', 'expense', 'business', NULL, 5),
('b_exp_travel', NULL, '差旅', '✈️', '#2196F3', 'expense', 'business', NULL, 6),
('b_exp_entertain', NULL, '招待', '🍽️', '#FF5722', 'expense', 'business', NULL, 7),
('b_exp_equipment', NULL, '设备', '💻', '#3F51B5', 'expense', 'business', NULL, 8),
('b_exp_service', NULL, '服务费', '🔧', '#00BCD4', 'expense', 'business', NULL, 9),
('b_exp_tax', NULL, '税费', '📋', '#9C27B0', 'expense', 'business', NULL, 10),
('b_exp_insurance', NULL, '保险', '🛡️', '#009688', 'expense', 'business', NULL, 11),
('b_exp_logistics', NULL, '物流', '📦', '#8D6E63', 'expense', 'business', NULL, 12),
('b_exp_other', NULL, '其他', '📝', '#9E9E9E', 'expense', 'business', NULL, 13);

-- ----------------------------------------------------------
-- 公司账本 - 收入分类（6个）
-- ----------------------------------------------------------
INSERT INTO `categories` (`id`, `user_id`, `name`, `icon`, `color`, `type`, `book_type`, `parent_id`, `sort_order`) VALUES
('b_inc_sales', NULL, '销售', '💰', '#4CAF50', 'income', 'business', NULL, 1),
('b_inc_service', NULL, '服务', '🔧', '#2196F3', 'income', 'business', NULL, 2),
('b_inc_invest', NULL, '投资', '📈', '#FF9800', 'income', 'business', NULL, 3),
('b_inc_subsidy', NULL, '补贴', '🏛️', '#9C27B0', 'income', 'business', NULL, 4),
('b_inc_refund', NULL, '退款', '↩️', '#00BCD4', 'income', 'business', NULL, 5),
('b_inc_other', NULL, '其他', '📝', '#9E9E9E', 'income', 'business', NULL, 6);

-- ============================================================
-- 完成！共插入 41 个默认分类：
--
--   账本类型 | 收支类型 | 分类数量
--   -------- | -------- | --------
--   personal | expense  | 15
--   personal | income   | 7
--   business | expense  | 13
--   business | income   | 6
-- ============================================================
