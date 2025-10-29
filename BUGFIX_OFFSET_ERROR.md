# 格式刷错误修复说明

## 🐛 问题描述

### 错误信息：
```
Uncaught CKEditorError: model-nodelist-offset-out-of-bounds
Given offset cannot be found in the node list.
{"offset":7,"nodeList":[{"data":"Sample"}]}
```

### 原因分析：

这个错误发生在格式刷尝试复制格式时。原因是：
- "Sample" 文本只有 6 个字符（索引 0-5）
- 但代码尝试访问 offset 7，超出了范围
- 在直接遍历 `firstRange.getItems()` 时可能访问到超出边界的位置

## ✅ 修复方案

### 修改内容：

我重写了 `copyFormat()` 方法，使用更安全的方式：

#### 修改前（有问题）：
```javascript
// 直接遍历items，可能导致越界
for (const item of firstRange.getItems()) {
    if (item.is('textProxy') || item.is('text')) {
        // 处理...
    }
}
```

#### 修改后（安全）：
```javascript
// 使用Walker安全遍历
const walker = firstRange.getWalker({
    ignoreElementEnd: true,
    shallow: true
});

for (const { item } of walker) {
    if (item.is('$textProxy') || item.is('$text')) {
        // 处理...
    }
}
```

### 主要改进：

1. **使用 Walker API**：
   - CKEditor 5 推荐的安全遍历方式
   - 自动处理边界检查
   - 避免直接访问可能不存在的位置

2. **错误捕获**：
   ```javascript
   try {
       // 复制格式逻辑
   } catch (error) {
       console.error('格式刷：复制格式时出错', error);
       this.copiedAttributes = new Map();
   }
   ```

3. **更新节点类型检查**：
   - 从 `'textProxy'` 改为 `'$textProxy'`
   - 从 `'text'` 改为 `'$text'`
   - 符合 CKEditor 5 最新的 API 规范

4. **双重保险机制**：
   - 方法1：直接从 selection 获取属性（最安全）
   - 方法2：使用 walker 遍历（备用方案）

## 🧪 测试

修复后，请测试以下场景：

### 测试 1: 短文本
```
文本：Sample
操作：选中后点击格式刷
预期：不再报错，正常复制格式
```

### 测试 2: 标题文本
```
文本：<h2>Sample</h2>
操作：选中标题后点击格式刷
预期：正常复制格式（如果有）
```

### 测试 3: 空选区边缘
```
文本：Sample|（光标在末尾）
操作：尝试使用格式刷
预期：按钮禁用或不执行操作
```

### 测试 4: 带格式的短文本
```
文本：Sample（粗体+红色）
操作：选中后复制格式到其他文本
预期：成功复制和应用格式
```

## 📝 技术细节

### Walker API 参数：

```javascript
firstRange.getWalker({
    ignoreElementEnd: true,  // 忽略元素结束标记
    shallow: true            // 浅层遍历（不深入子元素）
})
```

### 节点类型检查：

CKEditor 5 v20.0.0 中：
- ✅ 使用 `item.is('$textProxy')`
- ✅ 使用 `item.is('$text')`
- ❌ 不要使用 `item.is('textProxy')` （旧语法）

## 🔍 如何验证修复

1. **打开页面**：`sample/index.html`（Ctrl+F5 刷新）
2. **打开控制台**：F12
3. **执行操作**：
   - 输入 "Sample"
   - 选中文本
   - 点击格式刷按钮
4. **查看结果**：
   - ✅ 控制台没有红色错误
   - ✅ 显示 `格式刷：已复制格式 [...]`
   - ✅ 按钮正常激活

## ⚠️ 注意事项

### 如果还是报错：

1. **清除缓存**：强制刷新页面（Ctrl+Shift+R）
2. **检查构建**：确认使用的是最新构建的 ckeditor.js
3. **查看错误详情**：截图控制台完整错误信息

### 正常的控制台输出：

```
格式刷：按钮被点击，开始复制格式
格式刷：按钮已设置为激活状态
格式刷：已复制格式 []  或  [...属性列表...]
```

如果是空数组 `[]`，说明源文本没有格式，这是正常的。

## 📊 构建信息

- **修复文件**: `src/format-painter/src/format-painter-command.js`
- **修改行**: 第 34-99 行
- **构建状态**: ✅ 成功
- **构建时间**: 2025-10-29 15:24:45
- **文件大小**: 816 KB

## 🎯 总结

这个修复使格式刷功能更加稳定和安全：

1. ✅ 避免了 offset 越界错误
2. ✅ 使用了推荐的 API
3. ✅ 添加了错误处理
4. ✅ 保持了原有功能

现在格式刷应该可以在各种情况下正常工作，不会再出现 `model-nodelist-offset-out-of-bounds` 错误！

