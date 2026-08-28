# Changelog

本專案的所有對外可見變更都記錄在這裡。格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本遵循語意化版本。日期使用 UTC。

## [0.2.0] - 2026-08-28

### Changed

- Client manifest 的 `dsh.client.inject` 從已刪除的 `@deepseek-ai/dsh-client-runtime` 改為
  `@deepseek-ai/dsh-client-ui-layout` + `@deepseek-ai/dsh-client-ui-renderer`（提供 `slots`
  服務）+ `@deepseek-ai/dsh-client-ui-session`（提供 session hooks），客戶端模組圖在
  DeepSeek Harness `0.1.2-alpha.1` 起可正常解析，桌寵恢復掛載。
- 等待動畫改讀官方新增的 `useSessionPendingInteraction` snapshot map——官方已把 pending
  interaction 從 `SessionSummary` 移到獨立 snapshot，原 `state.byId[id].pendingInteraction`
  讀法在 `0.1.2-alpha.1` 上永遠取不到值。
- README 新增相容性對照表（0.2.0 需要 `0.1.2-alpha.1`+；0.1.1 涵蓋 `0.1.0-rc.6` ～
  `0.1.1-rc.2`）、與 `dsh-web` 全家桶共存的說明，以及雙桌寵預設位置重叠的處理方式。

### 相容性

- 本版**需要** DeepSeek Harness `0.1.2-alpha.1`（含）以上；`0.1.0-rc.6` ～ `0.1.1-rc.2`
  請繼續使用 0.1.1。
- 與 `@linxin666/dsh-web-all`（dsh-web 生態全家桶）、`dsh-plugin-verified-search` 可同時
  安裝於同一個 `web` profile：已用官方 `@deepseek-ai/cordis-plugin-include` 1.0.6 對
  `dsh-base` + `dsh-web-app` + 三個外掛的疊層做組合驗證（169 個 entries，零重複 id、
  零缺漏、零警告），HTTP 路由無碰撞。

## [0.1.1] - 2026-08-14

### Added

- 首個發布版本：DeepSeek Harness 原生 Cordis 桌寵外掛。
- Host 端在 `/deepseek-girl-pet/spritesheet.webp` 提供固定 WebP 圖集；client 端註冊
  `shell.overlay` slot。
- 依 Session 狀態切換待機／工作／等待互動動畫；16 方向滑鼠追視（每 22.5° 一格），滑鼠
  停止 1.1 秒後回到待機。
- 點擊切換一般／放大尺寸；支援 `prefers-reduced-motion`。
- Codex pet v2 圖集：1536 × 2288 WebP、8 × 11、每格 192 × 208，圖集 SHA-256
  `234F24A97C18195A00C6093DA0090773E675993C169E92E7E13A24C37B323FA2`。
- 適用 DeepSeek Harness `0.1.0-rc.6` ～ `0.1.1-rc.2`。

[0.2.0]: https://github.com/f0909172434/dsh-deepseek-girl-pet/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/f0909172434/dsh-deepseek-girl-pet/releases/tag/v0.1.1
