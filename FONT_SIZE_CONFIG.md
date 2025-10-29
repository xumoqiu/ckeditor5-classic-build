# 字体大小配置说明

## ✅ 已完成更新

字体大小选项已从预设名称（tiny/small/default/big/huge）改为具体的像素值。

## 📐 新的字体大小选项

### 配置的像素值：

| 显示 | 像素值 | 说明 |
|-----|--------|------|
| 9 | 9px | 极小字体 |
| 11 | 11px | 很小字体 |
| 13 | 13px | 小字体 |
| **Default** | 默认 | 浏览器默认大小 |
| 17 | 17px | 稍大字体 |
| 19 | 19px | 中等字体 |
| 21 | 21px | 较大字体 |
| 24 | 24px | 大字体 |
| 28 | 28px | 很大字体 |
| 32 | 32px | 超大字体 |
| 36 | 36px | 巨大字体 |
| 48 | 48px | 最大字体 |

## 🎯 使用方法

1. 在编辑器工具栏中点击 **Font Size** 下拉菜单
2. 现在会显示具体的像素值（如：**9**, **11**, **13** 等）
3. 选择任意大小应用到文本

## 🖌️ 格式刷中的显示

现在当您使用格式刷时，控制台会显示：

### 之前（预设名称）：
```
格式刷：已复制格式 [["fontSize","huge"]]
```

### 现在（像素值）：
```
格式刷：已复制格式 [["fontSize","48px"]]
或
格式刷：已复制格式 [["fontSize","24px"]]
```

更直观易懂！

## ⚙️ 配置详情

在 `src/ckeditor.js` 中添加了以下配置：

```javascript
fontSize: {
    options: [
        9,      // 9px
        11,     // 11px
        13,     // 13px
        'default',  // 保留默认选项
        17,     // 17px
        19,     // 19px
        21,     // 21px
        24,     // 24px
        28,     // 28px
        32,     // 32px
        36,     // 36px
        48      // 48px
    ],
    supportAllValues: true  // 支持任意自定义值
}
```

## 🔧 自定义字体大小

### 添加更多选项

如果需要其他字体大小，编辑 `src/ckeditor.js`：

```javascript
fontSize: {
    options: [
        8,
        10,
        12,
        14,
        'default',
        16,
        18,
        20,
        22,
        24,
        26,
        28,
        30,
        36,
        48,
        60,
        72
    ],
    supportAllValues: true
}
```

### 使用预设名称 + 像素值混合

```javascript
fontSize: {
    options: [
        'tiny',     // 预设名称
        'small',
        'default',
        'big',
        'huge',
        24,         // 具体像素值
        36,
        48
    ]
}
```

### 使用 pt 单位

```javascript
fontSize: {
    options: [
        { title: '8pt', model: '8pt' },
        { title: '10pt', model: '10pt' },
        { title: '12pt', model: '12pt' },
        'default',
        { title: '14pt', model: '14pt' },
        { title: '16pt', model: '16pt' },
        { title: '18pt', model: '18pt' }
    ],
    supportAllValues: true
}
```

## 📝 注意事项

1. **`supportAllValues: true`** 允许用户输入任意字体大小值
2. **`'default'`** 选项保持浏览器默认字体大小
3. 修改配置后需要运行 `npm run build` 重新构建
4. 像素值会自动转换为 `px` 单位（如：`24` → `24px`）

## 🧪 测试新配置

1. 刷新 `sample/index.html` （Ctrl+F5）
2. 选中文本
3. 点击 **Font Size** 下拉菜单
4. 查看是否显示具体像素值
5. 选择不同大小测试效果

## 🔄 恢复到预设名称（可选）

如果想恢复到原来的预设名称，修改配置为：

```javascript
fontSize: {
    options: [
        'tiny',
        'small',
        'default',
        'big',
        'huge'
    ]
}
```

然后重新构建：`npm run build`

## ✅ 格式刷完全支持

格式刷完全支持新的字体大小配置：
- ✅ 复制像素值字体大小
- ✅ 应用像素值字体大小
- ✅ 在控制台显示实际像素值
- ✅ 与其他格式（粗体、颜色等）组合使用

---

**配置位置**: `src/ckeditor.js` 第 172-188 行
**构建状态**: ✅ 已构建成功
**构建时间**: 2025-10-29 15:19:04

