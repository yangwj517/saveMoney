package com.zanqian.savemoney.controller;

import com.zanqian.savemoney.common.ApiResponse;
import com.zanqian.savemoney.dto.ReminderRequest;
import com.zanqian.savemoney.dto.ReminderSettingsRequest;
import com.zanqian.savemoney.dto.ReminderUpdateRequest;
import com.zanqian.savemoney.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getReminders() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.getReminders(userId));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> createReminder(@Valid @RequestBody ReminderRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.createReminder(userId, request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> updateReminder(@PathVariable String id,
                                                            @Valid @RequestBody ReminderUpdateRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.updateReminder(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteReminder(@PathVariable String id) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        reminderService.deleteReminder(userId, id);
        return ApiResponse.success();
    }

    @GetMapping("/settings")
    public ApiResponse<Map<String, Object>> getSettings() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.getSettings(userId));
    }

    @PutMapping("/settings")
    public ApiResponse<Map<String, Object>> updateSettings(@Valid @RequestBody ReminderSettingsRequest request) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(reminderService.updateSettings(userId, request));
    }
}
