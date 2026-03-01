package com.zanqian.savemoney.service;

import java.util.Map;

public interface StatisticsService {
    Map<String, Object> getStatistics(String userId, String bookType, String startDate, String endDate, String type);
    Map<String, Object> getOverview(String userId, String bookType);
}
