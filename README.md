# deepseek娘 DeepSeek Harness 桌寵

一個給 DeepSeek Harness Web UI 使用的開源 Cordis 桌寵外掛。她會待在介面右下角，依照目前 Session 狀態切換動畫，也會用 16 個方向跟著滑鼠看。

> 實際在 DeepSeek Harness 中使用的畫面：
>
> ![deepseek娘在 DeepSeek Harness 中待機、追視與放大](assets/deepseek-girl-harness-demo.gif)

> 這是社群製作的非官方外掛，不會修改 Session 資料、對話記錄或 DeepSeek Harness 核心原始碼。

## 功能

- DeepSeek Harness 原生 Cordis 外掛與 `shell.overlay` 擴充槽
- 待機時拿著簡體「区」的板子，對話框文字維持「凶」
- Harness 執行任務時切換至工作動畫
- Session 等待互動時切換至等待動畫
- 完整 16 方向滑鼠追視，每 22.5 度一格
- 滑鼠停止 1.1 秒後回到拿板子的待機動畫
- 點擊桌寵可在一般與放大尺寸間切換
- 支援 `prefers-reduced-motion`
- Codex pet v2 圖集：1536 × 2288 WebP、8 × 11、每格 192 × 208

## 相容性

| 外掛版本 | 需要的 DeepSeek Harness |
|---|---|
| 0.2.0 | `0.1.2-alpha.1`（含）以後 |
| 0.1.1 | `0.1.0-rc.6` ～ `0.1.1-rc.2` |

0.2.0 起改用 `dsh-client-ui-renderer`／`dsh-client-ui-session` 取得 slots 與 Session 狀態，並改讀獨立的 `useSessionPendingInteraction` snapshot——官方在 `0.1.2-alpha.1` 移除了舊的 `dsh-client-runtime` 套件，並把 pending interaction 從 session summary 移到獨立的 snapshot map。

桌寵與其他 web profile 外掛可以同時安裝。已用官方 `cordis-plugin-include` 對 `dsh-base` + `dsh-web-app` + `@linxin666/dsh-web-all`（dsh-web 全家桶）+ 本外掛 + `dsh-plugin-verified-search` 的五層疊層做過組合驗證：169 個 entries、零重複 id、零缺漏、零警告；dsh-web 各套件的 HTTP 路由也與本外掛的 spritesheet 路由無碰撞。

注意：dsh-web 內建桌寵（`@linxin666/dsh-pet`）預設出現在右下角（可拖曳、可在「Web 插件 → 桌寵」設定隱藏），與本桌寵的預設位置會有視覺重叠；兩者 API 層互不衝突，擇一顯示或拖開即可。

## 安裝

### 一行安裝

```powershell
dsh plugin --profile web add github:f0909172434/dsh-deepseek-girl-pet
```

安裝後重新啟動 Harness：

```powershell
# 先在原本執行 dsh web 的視窗按 Ctrl+C，確認 3080 已停止，再執行：
dsh web
```

如果看到 `EADDRINUSE: address already in use 127.0.0.1:3080`，代表舊的 Harness 還在執行，不是安裝失敗。請先回到原本的 Harness 終端按 `Ctrl+C`，再重新執行 `dsh web`；最後在瀏覽器按 `Ctrl+F5` 強制重新載入。

安裝時出現 `Issues with peer dependencies found` 是 profile 中其他外掛的 peer dependency 警告；只要後面顯示 `Done`，桌寵套件就已安裝。可用下列指令確認：

```powershell
dsh --profile web --dump-config | Select-String deepseek-girl-pet
```

然後開啟 [http://127.0.0.1:3080/](http://127.0.0.1:3080/)。

### 從原始碼安裝

```powershell
git clone https://github.com/f0909172434/dsh-deepseek-girl-pet.git
cd dsh-deepseek-girl-pet
npm pack
dsh plugin --profile web add .\dsh-deepseek-girl-pet-0.1.1.tgz
```

## 狀態映射

| Harness 狀態 | 桌寵表現 |
|---|---|
| Idle | 拿著「区」板子待機，對話框顯示「凶」 |
| Running | 工作動畫 |
| Pending interaction | 等待互動動畫 |
| Pointer movement | 16 方向追視 |

外掛直接讀取 Harness 的 Session summary state，不會用脆弱的 DOM 文字掃描猜測狀態。

## 技術方式

- Host plugin 只在 `/deepseek-girl-pet/spritesheet.webp` 提供固定 WebP 圖集
- Client plugin 只註冊 `shell.overlay` slot
- 不修改 DeepSeek Harness 核心檔案
- 不讀取或寫入對話內容
- 不依賴外部 CDN 或追蹤服務

## 驗證

- `node --check lib/index.js`
- `node --check lib/client.js`
- Hatch Pet deterministic v2 atlas validation：PASS
- 圖集 SHA-256：`234F24A97C18195A00C6093DA0090773E675993C169E92E7E13A24C37B323FA2`
- DeepSeek Harness 首頁、client module 與 spritesheet route：HTTP 200

## 授權與聲明

本專案採用 [MIT License](LICENSE)。

這是社群製作的非官方專案，與 DeepSeek、OpenAI 或 Codex 沒有從屬、合作或背書關係。`DeepSeek`、`Codex` 與相關名稱及標誌仍屬其各自權利人所有。
