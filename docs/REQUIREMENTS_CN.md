# IntentRadar 产品需求文档 (PRD)

**版本**: v3.0 (整合版)  
**最后更新**: 2026年1月  
**状态**: 交互补全与核心功能开发阶段

---

## 1. 产品初衷与定位 (Vision)

### 1.1 核心痛点
初创企业、销售人员和自由职业者在寻找潜在客户时面临巨大困难：
- **跨平台割裂**：需要在小红书、LinkedIn、Twitter (X)、Reddit 等多个平台之间反复切换。
- **搜索效率低**：手动搜索关键词耗时耗力，容易遗漏重要信息。
- **信息噪音大**：难以快速分辨哪些帖子是真实的购买意向，哪些只是普通讨论。

### 1.2 产品定位：意向雷达 (The Radar)
IntentRadar 是一个**跨平台意向聚合与监测工具**。
- **它是雷达，不是战场**：我们负责扫描、发现和锁定目标（意向），具体的“战斗”（沟通联系）在原平台进行。
- **它是传送门，不是聊天室**：我们不提供内置聊天功能，而是提供一键跳转原帖的“直达电梯”。

### 1.3 核心价值
1.  **聚合 (Aggregate)**：一站式监测所有主流社交平台的潜在客户意向。
2.  **筛选 (Filter)**：利用 AI 评分和关键词匹配，过滤噪音，只看高价值线索。
3.  **连接 (Connect)**：发现线索后，一键跳转原平台建立真实、合规的联系。

---

## 2. 核心用户流程 (User Flow)

用户的使用路径非常清晰，遵循 **DSS-J (Detect -> Screen -> Save -> Jump)** 模型：

1.  **监测 (Detect)**: 用户配置业务关键词（如 "SaaS", "React开发"），系统自动扫描多平台帖子。
2.  **筛选 (Screen)**: 在 **Inbox** 中浏览 AI 聚合的意向卡片，查看 AI 评分、摘要及（探索中的）高意向评论。
3.  **保存 (Save)**: 发现有价值的意向，点击 **Save**，将其存入 **Leads** 库，防止丢失。
4.  **跳转 (Jump)**: 点击 **View Post**，系统直接打开原社交平台的帖子页面。
5.  **联系 (Contact)**: 用户在原平台（如小红书评论区、LinkedIn 私信）与潜在客户进行真实互动。
6.  **管理 (Manage)**: 回到 IntentRadar，将 Lead 状态更新为 "Contacting"（已联系）或添加备注。

---

## 3. 功能需求 (Features)

### 3.1 统一意向收件箱 (Unified Intent Inbox)
这是用户的主工作台。

*   **意向卡片 (Intent Card)**:
    *   **基础信息**: 用户头像、昵称、发布时间、平台图标（悬浮）。
    *   **核心内容**: 帖子摘要，支持点击展开查看更多上下文。
    *   **AI 意向评分**: 0-100% 进度条，直观展示潜在价值。
    *   **[新特性] 评论透视 (试验性)**: 尝试展示帖子下方的高价值评论（例如：有人评论“怎么收费？”），捕捉隐藏在评论区的意向。
*   **操作交互**:
    *   **View Post**: 醒目的跳转按钮，在新标签页打开原链接。
    *   **Save/Unsave**: 收藏/取消收藏意向。
*   **搜索与筛选**:
    *   **实时搜索**: 输入关键词（如 "兼职"）即时过滤当前列表。
    *   **多维筛选**: 按平台、意向等级 (High/Medium/Low)、时间筛选。

### 3.2 线索管理 (Leads Management)
已保存意向的CRM轻量级管理界面。

*   **状态管理 (Status Pipeline)**:
    *   `New` (新增): 刚保存，未处理。
    *   `Contacting` (联系中): 已跳转并发送消息。
    *   `Closed` (已成交): 成功转化。
    *   `Abandoned` (放弃): 不合适或无回复。
    *   *需求*: 在卡片上提供下拉菜单直接修改状态。
*   **备注系统 (Notes)**:
    *   允许对每个 Lead 添加多条文本备注（例如：“1/7 已私信，等待回复”）。
*   **数据导出**:
    *   支持导出为 CSV 格式，方便导入 Excel 或其他 CRM。

### 3.3 AI 配置 (Settings)
*   **关键词配置**: 用户输入业务描述和关键词，作为 AI 扫描的依据。
*   **平台开关**: 开启/关闭特定平台的监测（如只看 LinkedIn）。

---

## 4. 数据模型 (Data Model)

### Intent (意向对象)
```typescript
interface Intent {
  id: string
  platform: 'xiaohongshu' | 'linkedin' | 'x' | 'reddit' | 'telegram' // 来源平台
  author: {
    name: string
    avatar: string
    profileUrl: string
  }
  content: string       // 帖子正文
  topComment?: {        // [新增] 意向评论（探索性功能）
    author: string
    content: string
  }
  postedAt: Date
  aiScore: number       // 0-100
  scoreLevel: 'high' | 'medium' | 'low'
  sourceUrl: string     // 原帖跳转链接
  status: 'inbox' | 'saved' | 'dismissed'
}
```

### Lead (线索对象 - 扩展自 Intent)
```typescript
interface Lead extends Intent {
  savedAt: Date
  leadStatus: 'new' | 'contacting' | 'closed' | 'abandoned' // 状态流转
  notes: string[] // 备注列表
}
```

---

## 5. 设计系统 (Design System)

保持现有的高保真设计风格：
-   **风格**: Glassmorphism (毛玻璃) + 现代简约。
-   **配色**:
    -   主色: 紫色 (`#7c3aed`) - 代表 AI 与 科技。
    -   背景: 浅灰 (`#f5f6fa`)与深色侧边栏 (`#1e1b2e`) 对比。
-   **交互**: 强调微交互（Hover 效果、平滑过渡）。

---

## 6. 下一步开发计划 (Action Plan)

### Phase 1: 交互补全 (当前重点)
目标：将原型转化为可用的 MVP，补全缺失的交互逻辑。
1.  **实装搜索功能**: 让 Inbox 和 Leads 页面的搜索框真正生效。
2.  **完善 Leads 管理**:
    *   实现“修改状态”功能。
    *   实现“添加/删除备注”功能。
3.  **UI 细节优化**: 根据新加入的“评论”字段调整卡片布局。

### Phase 2: 数据真实化
1.  **Mock 数据升级**: 扩充模拟数据，加入评论数据，测试 UI 表现。
2.  **API 对接**: 逐步替换为真实社交媒体数据源（或模拟爬虫接口）。

---

*本文档整合了原 PRD、Demo Guide 及最新用户需求，作为项目的唯一需求来源。*
