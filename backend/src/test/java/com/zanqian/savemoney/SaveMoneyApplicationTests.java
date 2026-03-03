package com.zanqian.savemoney;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zanqian.savemoney.entity.SmsCode;
import com.zanqian.savemoney.repository.SmsCodeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SaveMoneyApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SmsCodeRepository smsCodeRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void testSmsSend() throws Exception {
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"13488437203\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.expireIn").value(300));
    }

    @Test
    void testSmsSendValidation() throws Exception {
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(10001));
    }

    @Test
    void testLoginWrongCode() throws Exception {
        // First send SMS
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"13488437204\"}"))
                .andExpect(status().isOk());

        // Try login with wrong code
        mockMvc.perform(post("/auth/login/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"13488437204\",\"code\":\"000000\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(10001));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testFullAuthFlow() throws Exception {
        String phone = "13488437205";

        // Send SMS
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Get the actual code from DB
        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone)
                .orElseThrow();

        // Login with correct code
        MvcResult loginResult = mockMvc.perform(post("/auth/login/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\",\"code\":\"" + smsCode.getCode() + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.data.user.phone").value("134****7205"))
                .andReturn();

        Map<String, Object> loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) loginResponse.get("data");
        String token = (String) data.get("token");
        String refreshToken = (String) data.get("refreshToken");

        // Test authenticated endpoint - Get profile
        mockMvc.perform(get("/user/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.phone").value("134****7205"));

        // Test refresh token
        mockMvc.perform(post("/auth/token/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"" + refreshToken + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.token").isNotEmpty());

        // Test update profile
        mockMvc.perform(put("/user/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"测试用户\",\"email\":\"test@mail.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.nickname").value("测试用户"))
                .andExpect(jsonPath("$.data.email").value("test@mail.com"));

        // Test create account
        MvcResult accountResult = mockMvc.perform(post("/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"现金\",\"balance\":1500.00,\"icon\":\"cash\",\"color\":\"#4CAF50\",\"bookType\":\"personal\",\"isDefault\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("现金"))
                .andReturn();

        Map<String, Object> accResponse = objectMapper.readValue(
                accountResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> accData = (Map<String, Object>) accResponse.get("data");
        String accountId = (String) accData.get("id");

        // Test get accounts
        mockMvc.perform(get("/accounts")
                        .param("bookType", "personal")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].name").value("现金"));

        // Test create category
        MvcResult catResult = mockMvc.perform(post("/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"餐饮\",\"icon\":\"food\",\"color\":\"#FF9800\",\"type\":\"expense\",\"bookType\":\"personal\",\"order\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("餐饮"))
                .andReturn();

        Map<String, Object> catResponse = objectMapper.readValue(
                catResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> catData = (Map<String, Object>) catResponse.get("data");
        String categoryId = (String) catData.get("id");

        // Test create record
        MvcResult recResult = mockMvc.perform(post("/records")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":35.50,\"type\":\"expense\",\"categoryId\":\"" + categoryId +
                                "\",\"accountId\":\"" + accountId +
                                "\",\"bookType\":\"personal\",\"date\":\"2026-03-01\",\"note\":\"午餐\",\"images\":[]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.amount").value(35.50))
                .andExpect(jsonPath("$.data.category.name").value("餐饮"))
                .andExpect(jsonPath("$.data.account.name").value("现金"))
                .andReturn();

        Map<String, Object> recResponse = objectMapper.readValue(
                recResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> recData = (Map<String, Object>) recResponse.get("data");
        String recordId = (String) recData.get("id");

        // Test get records
        mockMvc.perform(get("/records")
                        .param("bookType", "personal")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.list[0].note").value("午餐"));

        // Test get record detail
        mockMvc.perform(get("/records/" + recordId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.note").value("午餐"));

        // Test create savings goal
        MvcResult goalResult = mockMvc.perform(post("/savings/goals")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"旅游基金\",\"targetAmount\":10000.00,\"bookType\":\"personal\",\"deadline\":\"2026-12-31\",\"icon\":\"airplane\",\"color\":\"#2196F3\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("旅游基金"))
                .andReturn();

        Map<String, Object> goalResponse = objectMapper.readValue(
                goalResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> goalData = (Map<String, Object>) goalResponse.get("data");
        String goalId = (String) goalData.get("id");

        // Test deposit
        mockMvc.perform(post("/savings/goals/" + goalId + "/deposits")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":1000.00,\"note\":\"发工资了\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.amount").value(1000.00));

        // Test withdraw
        mockMvc.perform(post("/savings/goals/" + goalId + "/withdraw")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":200.00,\"note\":\"临时用款\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.amount").value(-200.00));

        // Test get goal detail
        mockMvc.perform(get("/savings/goals/" + goalId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.deposits").isArray());

        // Test create budget
        mockMvc.perform(post("/budgets")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"categoryId\":\"" + categoryId + "\",\"amount\":3000.00,\"period\":\"monthly\",\"bookType\":\"personal\",\"alertThreshold\":80,\"isAlertEnabled\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.amount").value(3000.00));

        // Test get budgets
        mockMvc.perform(get("/budgets")
                        .param("bookType", "personal")
                        .param("period", "monthly")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Test statistics
        mockMvc.perform(get("/statistics")
                        .param("bookType", "personal")
                        .param("startDate", "2026-03-01")
                        .param("endDate", "2026-03-31")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.totalExpense").isNumber());

        // Test overview
        mockMvc.perform(get("/overview")
                        .param("bookType", "personal")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.bookType").value("personal"));

        // Test create reminder
        mockMvc.perform(post("/reminders")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"房租\",\"amount\":3500.00,\"dueDay\":1,\"isEnabled\":true,\"note\":\"每月1号交房租\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("房租"));

        // Test get reminders
        mockMvc.perform(get("/reminders")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Test reminder settings
        mockMvc.perform(get("/reminders/settings")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.billReminder").value(true));

        // Test update reminder settings
        mockMvc.perform(put("/reminders/settings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"billReminder\":true,\"billReminderTime\":\"08:00\",\"budgetAlertThreshold\":90}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.billReminderTime").value("08:00"));

        // Test get notifications
        mockMvc.perform(get("/notifications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.list").isArray());

        // Test mark all as read
        mockMvc.perform(put("/notifications/read-all")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Test submit feedback
        mockMvc.perform(post("/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"suggestion\",\"content\":\"希望能增加数据导出功能\",\"contact\":\"test@mail.com\",\"images\":[]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.status").value("pending"));

        // Test logout
        mockMvc.perform(post("/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Test delete record
        mockMvc.perform(delete("/records/" + recordId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        // Test delete account
        mockMvc.perform(delete("/accounts/" + accountId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    @Test
    void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(20001));
    }

    @Test
    void testInvalidToken() throws Exception {
        mockMvc.perform(get("/user/profile")
                        .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(20002));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testBudgetUsedAmountCalculation() throws Exception {
        // Setup: login a user
        String phone = "13488437210";
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\"}"))
                .andExpect(status().isOk());

        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone).orElseThrow();

        MvcResult loginResult = mockMvc.perform(post("/auth/login/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\",\"code\":\"" + smsCode.getCode() + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) loginResponse.get("data");
        String token = (String) data.get("token");

        // Create account and category
        MvcResult accResult = mockMvc.perform(post("/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"现金\",\"balance\":10000.00,\"icon\":\"cash\",\"color\":\"#4CAF50\",\"bookType\":\"personal\",\"isDefault\":true}"))
                .andExpect(status().isOk())
                .andReturn();
        Map<String, Object> accData = (Map<String, Object>) ((Map<String, Object>) objectMapper.readValue(
                accResult.getResponse().getContentAsString(), Map.class)).get("data");
        String accountId = (String) accData.get("id");

        MvcResult catResult = mockMvc.perform(post("/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"餐饮\",\"icon\":\"food\",\"color\":\"#FF9800\",\"type\":\"expense\",\"bookType\":\"personal\",\"order\":1}"))
                .andExpect(status().isOk())
                .andReturn();
        Map<String, Object> catData = (Map<String, Object>) ((Map<String, Object>) objectMapper.readValue(
                catResult.getResponse().getContentAsString(), Map.class)).get("data");
        String categoryId = (String) catData.get("id");

        // Create budget for this category
        MvcResult budgetResult = mockMvc.perform(post("/budgets")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"categoryId\":\"" + categoryId + "\",\"amount\":3000.00,\"period\":\"monthly\",\"bookType\":\"personal\",\"alertThreshold\":80,\"isAlertEnabled\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.usedAmount").value(0))
                .andReturn();

        // Create expense records in the current month
        String today = java.time.LocalDate.now().toString();
        mockMvc.perform(post("/records")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":100.50,\"type\":\"expense\",\"categoryId\":\"" + categoryId +
                                "\",\"accountId\":\"" + accountId +
                                "\",\"bookType\":\"personal\",\"date\":\"" + today + "\",\"note\":\"早餐\",\"images\":[]}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/records")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":200.00,\"type\":\"expense\",\"categoryId\":\"" + categoryId +
                                "\",\"accountId\":\"" + accountId +
                                "\",\"bookType\":\"personal\",\"date\":\"" + today + "\",\"note\":\"午餐\",\"images\":[]}"))
                .andExpect(status().isOk());

        // Verify budget usedAmount now reflects actual spending
        mockMvc.perform(get("/budgets")
                        .param("bookType", "personal")
                        .param("period", "monthly")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].usedAmount").value(300.50));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testNullFieldsPresent() throws Exception {
        // Setup: login a user
        String phone = "13488437211";
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\"}"))
                .andExpect(status().isOk());

        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone).orElseThrow();

        MvcResult loginResult = mockMvc.perform(post("/auth/login/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\",\"code\":\"" + smsCode.getCode() + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) loginResponse.get("data");
        String token = (String) data.get("token");

        // Verify user profile has null email field present
        mockMvc.perform(get("/user/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.email").value((Object) null));

        // Verify category with null parentId
        mockMvc.perform(post("/categories")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"测试分类\",\"icon\":\"test\",\"color\":\"#000000\",\"type\":\"expense\",\"bookType\":\"personal\",\"order\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.parentId").value((Object) null));
    }

    @Test
    void testAccountBookTypeValidation() throws Exception {
        // Setup: login
        String phone = "13488437212";
        mockMvc.perform(post("/auth/sms/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\"}"))
                .andExpect(status().isOk());

        SmsCode smsCode = smsCodeRepository.findFirstByPhoneAndUsedFalseOrderByExpireAtDesc(phone).orElseThrow();
        MvcResult loginResult = mockMvc.perform(post("/auth/login/phone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + phone + "\",\"code\":\"" + smsCode.getCode() + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        @SuppressWarnings("unchecked")
        Map<String, Object> loginResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(), Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) loginResponse.get("data");
        String token = (String) data.get("token");

        // Try creating account without bookType - should fail validation
        mockMvc.perform(post("/accounts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"测试账户\",\"balance\":100.00,\"icon\":\"cash\",\"color\":\"#000000\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(10001));
    }
}
