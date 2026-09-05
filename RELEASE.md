# 0.2.0 安裝包與回復方式

本版的來源介面是 DeepSeek Harness **0.1.2-alpha.1**。更高版本需要重新驗證，
不由版本號推定相容。`0.1.1` 的舊相容範圍保留在歷史文件，不冒用未知 commit 補標舊 tag。

## 固定版本安裝

從 [v0.2.0 release](https://github.com/f0909172434/dsh-deepseek-girl-pet/releases/tag/v0.2.0)
下載 `dsh-deepseek-girl-pet-0.2.0.tgz` 與 `SHA256SUMS`，比對檔案雜湊後安裝：

```powershell
Get-FileHash .\dsh-deepseek-girl-pet-0.2.0.tgz -Algorithm SHA256
dsh plugin --profile web add .\dsh-deepseek-girl-pet-0.2.0.tgz
```

先保留目前可用的安裝包與 web profile 設定備份。重新啟動 Harness 後，
確認設定中有本外掛、畫面載入圖集、工作與等待狀態能切換。安裝指令的 `Done`
只代表套件管理步驟完成。若有 peer dependency 警告，應逐一檢查警告的套件與版本。

## 還原

若新版本無法載入，先停止 Harness，使用同一個 `dsh plugin --profile web add`
指令重新加入你事先保留的可用 TGZ，再還原對應 profile 備份並重啟。
宿主升版引起的不相容需要同時還原相容的宿主版本；單獨換圖集不能修復 API 差異。

## 重現與證據

Node 22 或 24、npm；本專案沒有需要安裝的 npm 開發依賴：

```sh
node --check lib/index.js
node --check lib/client.js
node scripts/verify.mjs
npm test
```

`npm test` 校驗圖集、測試損壞 bytes 的拒絕路徑，並連續 `npm pack` 兩次，
核對封裝白名單與 bytes。輸出包與包的 `SHA256SUMS` 位於 `dist/`。
根目錄的 `SHA256SUMS` 只綁定圖集，release 的校驗檔則綁定整個 TGZ。

CI 在 Ubuntu／Windows 與 Node 22／24 執行。這是封裝及語法驗證，
不會啟動真正的 Harness 工作階段。README 的宿主 GIF、組合驗證與 HTTP 200
屬於先前的實測紀錄；本版新增的包裝驗證沒有重新產生那些宿主觀察。
