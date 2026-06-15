# Changelog

## 1.0.5
- Polling interval reduced to 500ms for near real-time updates
- Removed manual refresh button

## 1.0.4
- Fixed refresh button losing its event listener after the first press
- Refresh button now shows "…" while fetching, then "✓ Done" briefly before resetting

## 1.0.3
- Fixed overlay body collapsing on every auto-refresh by updating content in place rather than rebuilding the overlay element
- Fixed refresh button not working after the first press

## 1.0.2
- Extension ID changed to `isacc2-dubs-predictor@extension` for public AMO listing
- Submitted for public listing on addons.mozilla.org

## 1.0.1
- Removed unsafe `innerHTML` usage — all API data is now rendered via DOM methods to prevent XSS
- Added `data_collection_permissions` to manifest (nested inside `gecko`) for Mozilla validation
- Added `gecko_android.strict_min_version: 142.0` to resolve Firefox for Android compatibility warning
- Renamed extension title to "ISACC2 DUBS PREDICTOR"
- Overlay now starts minimised by default
- Polling interval increased from 60s to 10s

## 1.0.0
- Initial release
- Overlay shows latest post #, next post #, latest comment #, next comment #
- Latest post block with author, subforum, thread title link
- Latest comment block with author, subforum, quoted excerpt, jump link
- Site stats bar showing total posts, comments, users, and online count
- Author and subforum names rendered in their forum colours
- Matrix green-on-black theme with monospace font
- Auto-refreshes every 60 seconds
- Collapse/expand toggle, state preserved across refreshes
- Firefox and Chrome support via Manifest V3
