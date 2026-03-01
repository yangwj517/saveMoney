package com.zanqian.savemoney.repository;

import com.zanqian.savemoney.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, String> {
}
