package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 用户反馈数据仓库接口
 *
 * 提供用户反馈数据的数据库操作接口
 */
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
}
