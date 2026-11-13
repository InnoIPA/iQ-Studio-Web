# iQ-Studio Web

iQ-Studio 官方網站與技術文件(Docs)的靜態網頁原始碼。

每個頁面都是完整、獨立的 `.dc.html` 檔,不需要打包或伺服器:直接雙擊、用 `file://` 開啟,或放到任何靜態主機都能運作。

## 頁面

| 類別 | 頁面 |
|---|---|
| 主要頁面 | Home (`iQ-Studio Home A Datasheet`)、Get Started、Benchmarks、Architecture、In the News |
| Docs | `iQ-Studio Docs.dc.html` 為入口,內容包含 Q911 Quick Start / Image Flashing、Windows Flashing、Qualcomm OTA、Applications、SDKs、Model Deploy、Benchmark、AVL(攝影機與廠商清單) |

Docs 側邊欄的頁面清單定義在 [iq-pages.js](iq-pages.js)。

## 專案結構

```
*.dc.html          各頁面(檔名開頭皆為 "iQ-Studio ")
shared/            共用區塊:nav.html(導覽列)、footer.html(頁尾)
assets/logo/       Logo 與 favicon
iq-tokens.css/js   設計 token(色彩、字型、間距)
iq-shell.css       導覽列、頁尾等外框樣式
iq-docs.css/js     Docs 版面與互動
iq-family.css      首頁架構圖樣式
iq-family-data.js  iQ-Studio 產品家族資料(首頁與 Architecture 頁共用)
iq-pages.js        Docs 側邊欄頁面清單
docs-search.js     站內搜尋(索引由 build.js 自動產生)
iq-theme.js        亮/暗色主題切換
iq-a11y.js         無障礙輔助
code-hl.js         程式碼高亮
copy-btn.js        程式碼複製按鈕
image-slot.js      圖片槽元件
support.js         頁面支援腳本
build.js           同步共用區塊與搜尋索引的建置腳本
```

## 開發流程

需要 [Node.js](https://nodejs.org/)(`build.js` 只使用內建模組,不需 `npm install`)。

### 修改導覽列或頁尾

不要直接改單一頁面。請編輯 `shared/nav.html` 或 `shared/footer.html`,再執行:

```bash
node build.js
```

腳本會把共用內容寫回每個頁面中 `<!-- @shared:名稱 --> … <!-- @end:名稱 -->` 標記的區塊,並自動標出各頁面目前所在的導覽項目。

### `build.js` 還會做的事

- **首頁架構圖**:依 `iq-family-data.js` 重新產生 `<!-- @family --> … <!-- @end:family -->` 區塊。要改架構圖,請改資料檔,不要手動改首頁 HTML。
- **搜尋索引**:依 `iq-pages.js` 與各頁的 `const TOC = [...]` 重建 `docs-search.js` 內的 `INDEX`。

### 檢查是否過期

```bash
node build.js --check
```

只回報哪些檔案過期、不會修改任何檔案;有過期項目時 exit code 為 1,適合在推送前或 CI 使用。

## 新增 Docs 頁面

1. 複製一個既有的 Docs 頁面(檔名需符合 `iQ-Studio <名稱>.dc.html`),修改內容與 `const TOC`。
2. 在 [iq-pages.js](iq-pages.js) 的側邊欄清單加入該頁。
3. 執行 `node build.js`,同步導覽列、頁尾與搜尋索引。

## Commit 規範

格式為 `type: subject`,type 可為:`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`、`revert`、`merge`。
