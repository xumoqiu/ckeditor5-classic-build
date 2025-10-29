# 格式刷插件 (Format Painter)

## 功能说明

格式刷插件允许您复制一段文本的格式并应用到另一段文本上，类似于 Microsoft Word 中的格式刷功能。

## 支持的格式

该插件可以复制和应用以下格式：

- **粗体** (Bold)
- **斜体** (Italic)
- **下划线** (Underline)
- **代码** (Code)
- **字体系列** (Font Family)
- **字体大小** (Font Size)
- **字体颜色** (Font Color)
- **背景颜色** (Font Background Color)
- **高亮** (Highlight)

## 使用方法

### 方式一：使用工具栏按钮

1. **复制格式**：选中包含您想要复制格式的文本
2. **激活格式刷**：点击工具栏中的格式刷按钮（刷子图标）
3. **应用格式**：选中您想要应用格式的目标文本
4. 格式将自动应用，格式刷自动关闭

### 方式二：取消格式刷

如果激活格式刷后想要取消：
- 按 **ESC 键**，或
- 再次点击格式刷按钮

## 技术实现

### 文件结构

```
src/format-painter/
├── src/
│   ├── format-painter.js           # 主插件文件
│   ├── format-painter-editing.js   # 编辑功能
│   ├── format-painter-ui.js        # UI界面
│   └── format-painter-command.js   # 命令逻辑
├── theme/
│   └── format-painter.css          # 样式文件
├── icons/
│   └── format-painter.svg          # 图标
└── README.md                       # 说明文档
```

### 工作原理

1. **命令系统**：使用 CKEditor 5 的命令模式实现
2. **状态管理**：通过 `isActive` 状态跟踪格式刷模式
3. **属性存储**：使用 Map 对象存储复制的格式属性
4. **应用格式**：通过模型的 writer API 批量应用属性

## 注意事项

- 只能在有文本选区时使用格式刷
- 格式刷会覆盖目标文本的现有格式
- 每次只能复制一个文本范围的格式
- 应用格式后，格式刷会自动关闭

## 兼容性

- 适用于 CKEditor 5 版本：20.0.0
- 已测试环境：Windows 10, Node.js
- 浏览器支持：所有现代浏览器

## 未来改进

可能的功能增强：
- [ ] 支持段落级别格式（对齐、缩进等）
- [ ] 支持多次应用格式（不自动关闭）
- [ ] 快捷键支持
- [ ] 格式预览功能

## 许可证

Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.

