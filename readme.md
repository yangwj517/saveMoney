# 攒钱记账 API 接口文档

## 基础信息

### 基础 URL
```
https://api.zanqian.app/v1
```

### 通用响应格式

#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

#### 错误响应
```json
{
  "code": 10001,
  "message": "错误描述信息",
  "data": null
}
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 参数错误 |
| 10002 | 数据不存在 |
| 10003 | 数据已存在 |
| 20001 | 未登录 |
| 20002 | Token 过期 |
| 20003 | 权限不足 |
| 30001 | 服务器内部错误 |

### 认证方式
所有需要认证的接口需在 Header 中携带：
```
Authorization: Bearer {token}
```

---

## 1. 认证模块

### 1.1 发送验证码
```
POST /auth/sms/send
```

**请求参数**
```json
{
  "phone": "13800138000"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "expireIn": 300
  }
}
```

### 1.2 手机号登录/注册
```
POST /auth/login/phone
```

**请求参数**
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "user": {
      "id": "u_001",
      "nickname": "用户123456",
      "avatar": "https://cdn.zanqian.app/avatar/default.png",
      "phone": "138****8000",
      "email": null,
      "createdAt": "2026-03-01T10:00:00Z"
    }
  }
}
```

### 1.3 刷新 Token
```
POST /auth/token/refresh
```

**请求参数**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200
  }
}
```

### 1.4 登出
```
POST /auth/logout
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 2. 用户模块

### 2.1 获取用户信息
```
GET /user/profile
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "u_001",
    "nickname": "小明",
    "avatar": "https://cdn.zanqian.app/avatar/001.png",
    "phone": "138****8000",
    "email": "example@mail.com",
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

### 2.2 更新用户信息
```
PUT /user/profile
```

**请求参数**
```json
{
  "nickname": "新昵称",
  "avatar": "https://cdn.zanqian.app/avatar/002.png",
  "email": "new@mail.com"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "u_001",
    "nickname": "新昵称",
    "avatar": "https://cdn.zanqian.app/avatar/002.png",
    "phone": "138****8000",
    "email": "new@mail.com",
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

### 2.3 上传头像
```
POST /user/avatar/upload
```

**请求参数** (multipart/form-data)
```
file: [图片文件]
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "https://cdn.zanqian.app/avatar/003.png"
  }
}
```

---

## 3. 账户模块

### 3.1 获取账户列表
```
GET /accounts?bookType=personal
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "acc_001",
      "name": "现金",
      "balance": 1500.00,
      "icon": "cash",
      "color": "#4CAF50",
      "bookType": "personal",
      "isDefault": true,
      "createdAt": "2026-03-01T10:00:00Z"
    },
    {
      "id": "acc_002",
      "name": "支付宝",
      "balance": 8520.50,
      "icon": "alipay",
      "color": "#1677FF",
      "bookType": "personal",
      "isDefault": false,
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

### 3.2 创建账户
```
POST /accounts
```

**请求参数**
```json
{
  "name": "微信钱包",
  "balance": 5000.00,
  "icon": "wechat",
  "color": "#07C160",
  "bookType": "personal",
  "isDefault": false
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "acc_003",
    "name": "微信钱包",
    "balance": 5000.00,
    "icon": "wechat",
    "color": "#07C160",
    "bookType": "personal",
    "isDefault": false,
    "createdAt": "2026-03-01T12:00:00Z"
  }
}
```

### 3.3 更新账户
```
PUT /accounts/{id}
```

**请求参数**
```json
{
  "name": "微信钱包",
  "balance": 6000.00,
  "icon": "wechat",
  "color": "#07C160",
  "isDefault": true
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "acc_003",
    "name": "微信钱包",
    "balance": 6000.00,
    "icon": "wechat",
    "color": "#07C160",
    "bookType": "personal",
    "isDefault": true,
    "createdAt": "2026-03-01T12:00:00Z"
  }
}
```

### 3.4 删除账户
```
DELETE /accounts/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 4. 分类模块

### 4.1 获取分类列表
```
GET /categories?bookType=personal&type=expense
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |
| type | string | 否 | expense / income |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "cat_001",
      "name": "餐饮",
      "icon": "food",
      "color": "#FF9800",
      "type": "expense",
      "bookType": "personal",
      "parentId": null,
      "order": 1
    },
    {
      "id": "cat_002",
      "name": "交通",
      "icon": "car",
      "color": "#2196F3",
      "type": "expense",
      "bookType": "personal",
      "parentId": null,
      "order": 2
    }
  ]
}
```

### 4.2 创建分类
```
POST /categories
```

**请求参数**
```json
{
  "name": "购物",
  "icon": "shopping",
  "color": "#E91E63",
  "type": "expense",
  "bookType": "personal",
  "parentId": null,
  "order": 3
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "cat_003",
    "name": "购物",
    "icon": "shopping",
    "color": "#E91E63",
    "type": "expense",
    "bookType": "personal",
    "parentId": null,
    "order": 3
  }
}
```

### 4.3 更新分类
```
PUT /categories/{id}
```

**请求参数**
```json
{
  "name": "购物消费",
  "icon": "shopping",
  "color": "#E91E63",
  "order": 3
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "cat_003",
    "name": "购物消费",
    "icon": "shopping",
    "color": "#E91E63",
    "type": "expense",
    "bookType": "personal",
    "parentId": null,
    "order": 3
  }
}
```

### 4.4 删除分类
```
DELETE /categories/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 5. 账单记录模块

### 5.1 获取账单列表
```
GET /records?bookType=personal&startDate=2026-03-01&endDate=2026-03-31&page=1&pageSize=20
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |
| type | string | 否 | expense / income |
| categoryId | string | 否 | 分类ID |
| accountId | string | 否 | 账户ID |
| startDate | string | 否 | 开始日期 YYYY-MM-DD |
| endDate | string | 否 | 结束日期 YYYY-MM-DD |
| keyword | string | 否 | 搜索关键词(备注) |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "rec_001",
        "amount": 35.50,
        "type": "expense",
        "categoryId": "cat_001",
        "category": {
          "id": "cat_001",
          "name": "餐饮",
          "icon": "food",
          "color": "#FF9800",
          "type": "expense",
          "bookType": "personal"
        },
        "accountId": "acc_001",
        "account": {
          "id": "acc_001",
          "name": "现金",
          "icon": "cash",
          "color": "#4CAF50"
        },
        "bookType": "personal",
        "date": "2026-03-01",
        "note": "午餐",
        "images": [],
        "createdAt": "2026-03-01T12:30:00Z",
        "updatedAt": "2026-03-01T12:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 5.2 获取单条账单详情
```
GET /records/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "rec_001",
    "amount": 35.50,
    "type": "expense",
    "categoryId": "cat_001",
    "category": {
      "id": "cat_001",
      "name": "餐饮",
      "icon": "food",
      "color": "#FF9800",
      "type": "expense",
      "bookType": "personal"
    },
    "accountId": "acc_001",
    "account": {
      "id": "acc_001",
      "name": "现金",
      "icon": "cash",
      "color": "#4CAF50"
    },
    "bookType": "personal",
    "date": "2026-03-01",
    "note": "午餐",
    "images": ["https://cdn.zanqian.app/records/img_001.jpg"],
    "createdAt": "2026-03-01T12:30:00Z",
    "updatedAt": "2026-03-01T12:30:00Z"
  }
}
```

### 5.3 创建账单
```
POST /records
```

**请求参数**
```json
{
  "amount": 88.00,
  "type": "expense",
  "categoryId": "cat_001",
  "accountId": "acc_001",
  "bookType": "personal",
  "date": "2026-03-01",
  "note": "聚餐",
  "images": []
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "rec_002",
    "amount": 88.00,
    "type": "expense",
    "categoryId": "cat_001",
    "category": {
      "id": "cat_001",
      "name": "餐饮",
      "icon": "food",
      "color": "#FF9800",
      "type": "expense",
      "bookType": "personal"
    },
    "accountId": "acc_001",
    "account": {
      "id": "acc_001",
      "name": "现金",
      "icon": "cash",
      "color": "#4CAF50"
    },
    "bookType": "personal",
    "date": "2026-03-01",
    "note": "聚餐",
    "images": [],
    "createdAt": "2026-03-01T18:00:00Z",
    "updatedAt": "2026-03-01T18:00:00Z"
  }
}
```

### 5.4 更新账单
```
PUT /records/{id}
```

**请求参数**
```json
{
  "amount": 98.00,
  "type": "expense",
  "categoryId": "cat_001",
  "accountId": "acc_002",
  "date": "2026-03-01",
  "note": "聚餐（修改）",
  "images": []
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "rec_002",
    "amount": 98.00,
    "type": "expense",
    "categoryId": "cat_001",
    "category": {
      "id": "cat_001",
      "name": "餐饮",
      "icon": "food",
      "color": "#FF9800",
      "type": "expense",
      "bookType": "personal"
    },
    "accountId": "acc_002",
    "account": {
      "id": "acc_002",
      "name": "支付宝",
      "icon": "alipay",
      "color": "#1677FF"
    },
    "bookType": "personal",
    "date": "2026-03-01",
    "note": "聚餐（修改）",
    "images": [],
    "createdAt": "2026-03-01T18:00:00Z",
    "updatedAt": "2026-03-01T19:00:00Z"
  }
}
```

### 5.5 删除账单
```
DELETE /records/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 5.6 上传账单图片
```
POST /records/images/upload
```

**请求参数** (multipart/form-data)
```
file: [图片文件]
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "https://cdn.zanqian.app/records/img_002.jpg"
  }
}
```

---

## 6. 攒钱目标模块

### 6.1 获取攒钱目标列表
```
GET /savings/goals?bookType=personal
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |
| isCompleted | boolean | 否 | 是否已完成 |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "goal_001",
      "name": "旅游基金",
      "targetAmount": 10000.00,
      "currentAmount": 3500.00,
      "bookType": "personal",
      "deadline": "2026-12-31",
      "icon": "airplane",
      "color": "#2196F3",
      "coverImage": "https://cdn.zanqian.app/goals/cover_001.jpg",
      "isCompleted": false,
      "createdAt": "2026-01-01T10:00:00Z",
      "updatedAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

### 6.2 获取攒钱目标详情
```
GET /savings/goals/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "goal_001",
    "name": "旅游基金",
    "targetAmount": 10000.00,
    "currentAmount": 3500.00,
    "bookType": "personal",
    "deadline": "2026-12-31",
    "icon": "airplane",
    "color": "#2196F3",
    "coverImage": "https://cdn.zanqian.app/goals/cover_001.jpg",
    "isCompleted": false,
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-03-01T10:00:00Z",
    "deposits": [
      {
        "id": "dep_001",
        "goalId": "goal_001",
        "amount": 1000.00,
        "note": "发工资了",
        "createdAt": "2026-02-01T10:00:00Z"
      },
      {
        "id": "dep_002",
        "goalId": "goal_001",
        "amount": 2500.00,
        "note": "年终奖",
        "createdAt": "2026-02-15T10:00:00Z"
      }
    ]
  }
}
```

### 6.3 创建攒钱目标
```
POST /savings/goals
```

**请求参数**
```json
{
  "name": "新电脑",
  "targetAmount": 8000.00,
  "bookType": "personal",
  "deadline": "2026-06-30",
  "icon": "laptop",
  "color": "#9C27B0",
  "coverImage": null
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "goal_002",
    "name": "新电脑",
    "targetAmount": 8000.00,
    "currentAmount": 0,
    "bookType": "personal",
    "deadline": "2026-06-30",
    "icon": "laptop",
    "color": "#9C27B0",
    "coverImage": null,
    "isCompleted": false,
    "createdAt": "2026-03-01T15:00:00Z",
    "updatedAt": "2026-03-01T15:00:00Z"
  }
}
```

### 6.4 更新攒钱目标
```
PUT /savings/goals/{id}
```

**请求参数**
```json
{
  "name": "新电脑基金",
  "targetAmount": 9000.00,
  "deadline": "2026-07-31",
  "icon": "laptop",
  "color": "#9C27B0"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "goal_002",
    "name": "新电脑基金",
    "targetAmount": 9000.00,
    "currentAmount": 0,
    "bookType": "personal",
    "deadline": "2026-07-31",
    "icon": "laptop",
    "color": "#9C27B0",
    "coverImage": null,
    "isCompleted": false,
    "createdAt": "2026-03-01T15:00:00Z",
    "updatedAt": "2026-03-01T16:00:00Z"
  }
}
```

### 6.5 删除攒钱目标
```
DELETE /savings/goals/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 6.6 存入金额
```
POST /savings/goals/{id}/deposits
```

**请求参数**
```json
{
  "amount": 500.00,
  "note": "本周节余"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "dep_003",
    "goalId": "goal_001",
    "amount": 500.00,
    "note": "本周节余",
    "createdAt": "2026-03-01T16:00:00Z"
  }
}
```

### 6.7 取出金额
```
POST /savings/goals/{id}/withdraw
```

**请求参数**
```json
{
  "amount": 200.00,
  "note": "临时用款"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "dep_004",
    "goalId": "goal_001",
    "amount": -200.00,
    "note": "临时用款",
    "createdAt": "2026-03-01T17:00:00Z"
  }
}
```

---

## 7. 预算模块

### 7.1 获取预算列表
```
GET /budgets?bookType=personal&period=monthly
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |
| period | string | 否 | monthly / weekly / yearly |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "bud_001",
      "categoryId": "cat_001",
      "category": {
        "id": "cat_001",
        "name": "餐饮",
        "icon": "food",
        "color": "#FF9800"
      },
      "amount": 3000.00,
      "usedAmount": 1850.50,
      "period": "monthly",
      "bookType": "personal",
      "alertThreshold": 80,
      "isAlertEnabled": true
    },
    {
      "id": "bud_002",
      "categoryId": null,
      "category": null,
      "amount": 10000.00,
      "usedAmount": 5230.00,
      "period": "monthly",
      "bookType": "personal",
      "alertThreshold": 90,
      "isAlertEnabled": true
    }
  ]
}
```

### 7.2 创建预算
```
POST /budgets
```

**请求参数**
```json
{
  "categoryId": "cat_002",
  "amount": 500.00,
  "period": "monthly",
  "bookType": "personal",
  "alertThreshold": 80,
  "isAlertEnabled": true
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "bud_003",
    "categoryId": "cat_002",
    "category": {
      "id": "cat_002",
      "name": "交通",
      "icon": "car",
      "color": "#2196F3"
    },
    "amount": 500.00,
    "usedAmount": 0,
    "period": "monthly",
    "bookType": "personal",
    "alertThreshold": 80,
    "isAlertEnabled": true
  }
}
```

### 7.3 更新预算
```
PUT /budgets/{id}
```

**请求参数**
```json
{
  "amount": 600.00,
  "alertThreshold": 85,
  "isAlertEnabled": true
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "bud_003",
    "categoryId": "cat_002",
    "category": {
      "id": "cat_002",
      "name": "交通",
      "icon": "car",
      "color": "#2196F3"
    },
    "amount": 600.00,
    "usedAmount": 0,
    "period": "monthly",
    "bookType": "personal",
    "alertThreshold": 85,
    "isAlertEnabled": true
  }
}
```

### 7.4 删除预算
```
DELETE /budgets/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 8. 统计模块

### 8.1 获取统计数据
```
GET /statistics?bookType=personal&startDate=2026-03-01&endDate=2026-03-31
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookType | string | 是 | personal / business |
| startDate | string | 是 | 开始日期 YYYY-MM-DD |
| endDate | string | 是 | 结束日期 YYYY-MM-DD |
| type | string | 否 | expense / income |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalIncome": 15000.00,
    "totalExpense": 8520.50,
    "balance": 6479.50,
    "categoryStats": [
      {
        "categoryId": "cat_001",
        "category": {
          "id": "cat_001",
          "name": "餐饮",
          "icon": "food",
          "color": "#FF9800"
        },
        "amount": 2850.00,
        "percentage": 33.45,
        "count": 45
      },
      {
        "categoryId": "cat_002",
        "category": {
          "id": "cat_002",
          "name": "交通",
          "icon": "car",
          "color": "#2196F3"
        },
        "amount": 1200.00,
        "percentage": 14.08,
        "count": 22
      }
    ],
    "dailyStats": [
      {
        "date": "2026-03-01",
        "income": 0,
        "expense": 156.50
      },
      {
        "date": "2026-03-02",
        "income": 15000.00,
        "expense": 88.00
      }
    ]
  }
}
```

### 8.2 获取账本总览
```
GET /overview?bookType=personal
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "bookType": "personal",
    "totalBalance": 52680.50,
    "todayIncome": 0,
    "todayExpense": 125.00,
    "monthIncome": 15000.00,
    "monthExpense": 8520.50
  }
}
```

---

## 9. 账单提醒模块

### 9.1 获取提醒列表
```
GET /reminders
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "rem_001",
      "name": "房租",
      "amount": 3500.00,
      "dueDay": 1,
      "categoryId": "cat_010",
      "category": {
        "id": "cat_010",
        "name": "住房",
        "icon": "home",
        "color": "#795548"
      },
      "isEnabled": true,
      "note": "每月1号交房租",
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ]
}
```

### 9.2 创建提醒
```
POST /reminders
```

**请求参数**
```json
{
  "name": "电费",
  "amount": 200.00,
  "dueDay": 15,
  "categoryId": "cat_011",
  "isEnabled": true,
  "note": "每月15号缴电费"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "rem_002",
    "name": "电费",
    "amount": 200.00,
    "dueDay": 15,
    "categoryId": "cat_011",
    "category": {
      "id": "cat_011",
      "name": "水电",
      "icon": "electricity",
      "color": "#FFC107"
    },
    "isEnabled": true,
    "note": "每月15号缴电费",
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

### 9.3 更新提醒
```
PUT /reminders/{id}
```

**请求参数**
```json
{
  "name": "电费",
  "amount": 250.00,
  "dueDay": 15,
  "isEnabled": true,
  "note": "每月15号缴电费（夏季用量增加）"
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "rem_002",
    "name": "电费",
    "amount": 250.00,
    "dueDay": 15,
    "categoryId": "cat_011",
    "category": {
      "id": "cat_011",
      "name": "水电",
      "icon": "electricity",
      "color": "#FFC107"
    },
    "isEnabled": true,
    "note": "每月15号缴电费（夏季用量增加）",
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

### 9.4 删除提醒
```
DELETE /reminders/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 9.5 获取提醒设置
```
GET /reminders/settings
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "billReminder": true,
    "billReminderTime": "09:00",
    "savingsReminder": true,
    "savingsReminderTime": "20:00",
    "budgetAlert": true,
    "budgetAlertThreshold": 80
  }
}
```

### 9.6 更新提醒设置
```
PUT /reminders/settings
```

**请求参数**
```json
{
  "billReminder": true,
  "billReminderTime": "08:00",
  "savingsReminder": false,
  "savingsReminderTime": "20:00",
  "budgetAlert": true,
  "budgetAlertThreshold": 90
}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "billReminder": true,
    "billReminderTime": "08:00",
    "savingsReminder": false,
    "savingsReminderTime": "20:00",
    "budgetAlert": true,
    "budgetAlertThreshold": 90
  }
}
```

---

## 10. 消息通知模块

### 10.1 获取通知列表
```
GET /notifications?page=1&pageSize=20
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| isRead | boolean | 否 | 是否已读 |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "noti_001",
        "type": "budget_alert",
        "title": "预算提醒",
        "content": "您的餐饮预算已使用80%，请注意控制支出",
        "isRead": false,
        "createdAt": "2026-03-01T10:00:00Z"
      },
      {
        "id": "noti_002",
        "type": "bill_reminder",
        "title": "账单提醒",
        "content": "明天是房租缴费日，金额3500元",
        "isRead": true,
        "createdAt": "2026-02-28T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 25,
      "totalPages": 2
    },
    "unreadCount": 5
  }
}
```

### 10.2 标记已读
```
PUT /notifications/{id}/read
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 10.3 全部标记已读
```
PUT /notifications/read-all
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 10.4 删除通知
```
DELETE /notifications/{id}
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 11. 反馈模块

### 11.1 提交反馈
```
POST /feedback
```

**请求参数**
```json
{
  "type": "suggestion",
  "content": "希望能增加数据导出功能",
  "contact": "example@mail.com",
  "images": []
}
```

**参数说明**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | bug / suggestion / other |
| content | string | 是 | 反馈内容 |
| contact | string | 否 | 联系方式 |
| images | array | 否 | 图片URL数组 |

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "fb_001",
    "type": "suggestion",
    "content": "希望能增加数据导出功能",
    "contact": "example@mail.com",
    "images": [],
    "status": "pending",
    "createdAt": "2026-03-01T16:00:00Z"
  }
}
```

### 11.2 上传反馈图片
```
POST /feedback/images/upload
```

**请求参数** (multipart/form-data)
```
file: [图片文件]
```

**成功响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "https://cdn.zanqian.app/feedback/img_001.jpg"
  }
}
```

---

## 通用错误响应示例

### 参数错误
```json
{
  "code": 10001,
  "message": "参数错误: amount必须大于0",
  "data": null
}
```

### 数据不存在
```json
{
  "code": 10002,
  "message": "记录不存在",
  "data": null
}
```

### 数据已存在
```json
{
  "code": 10003,
  "message": "该分类名称已存在",
  "data": null
}
```

### 未登录
```json
{
  "code": 20001,
  "message": "请先登录",
  "data": null
}
```

### Token 过期
```json
{
  "code": 20002,
  "message": "登录已过期，请重新登录",
  "data": null
}
```

### 权限不足
```json
{
  "code": 20003,
  "message": "无权操作此资源",
  "data": null
}
```

### 服务器错误
```json
{
  "code": 30001,
  "message": "服务器繁忙，请稍后重试",
  "data": null
}
```
