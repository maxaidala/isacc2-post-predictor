# ISACC2 Dubs Predictor

A browser extension for ISACC2 that shows you live forum activity without having to refresh the page.

## What it does

A small overlay appears in the bottom-right corner of any ISACC2 forum page. It shows:

- The number of the latest post and what the next post number will be
- The number of the latest comment and what the next comment number will be
- Who made the most recent post, and a link to it
- Who made the most recent comment, what thread it was in, a preview of what they said, and a link to jump straight to it
- How many posts, comments, and users the forum has in total, and how many people are online right now

The overlay updates automatically every 10 seconds. Click `+` to expand it and `−` to collapse it.

---

## API

The extension pulls data from `https://www.isacc2.com/forums/thread_api.php`. The fields it uses are:

| Field | Used for |
|-------|----------|
| `last_thread_id` | Latest post # and next post # |
| `last_post_id` | Latest comment # and next comment # |
| `latest_thread.title` | Title of the most recent post |
| `latest_thread.absolute_url` | Link to the most recent post |
| `latest_thread.author.username` | Author of the most recent post |
| `latest_thread.author.color` | Author's forum colour |
| `latest_thread.subforum.name` | Subforum of the most recent post |
| `latest_thread.subforum.color` | Subforum colour |
| `latest_post.content_excerpt` | Preview of the most recent comment |
| `latest_post.absolute_url` | Direct link to the most recent comment |
| `latest_post.author.username` | Author of the most recent comment |
| `latest_post.author.color` | Author's forum colour |
| `latest_post.thread.title` | Thread the most recent comment is in |
| `latest_post.subforum.name` | Subforum of the most recent comment |
| `latest_post.subforum.color` | Subforum colour |
| `site_statistics.total_threads` | Total post count |
| `site_statistics.total_posts` | Total comment count |
| `site_statistics.total_users` | Total user count |
| `site_statistics.online_users` | Currently online users |

Note: the API uses the term "threads" for what ISACC2 users call posts, and "posts" for what ISACC2 users call comments. The extension labels everything using the ISACC2 convention.

---

## Installing from source

Clone the repo:

```bash
git clone https://github.com/yourusername/isacc2-dubs-predictor.git
```

### Firefox

**Temporary (for development):**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json` from the cloned folder

**Permanent (signed):**
1. Zip the contents of the repo (the zip should contain `manifest.json` at its root, not a subfolder)
2. Submit the zip at [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) and choose **On your own**
3. Mozilla will sign it and return a `.xpi` file
4. In Firefox, go to `about:addons` → gear icon → **Install Add-on From File** → select the `.xpi`

### Chrome
1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select the cloned folder


---

## File structure

```
isacc2-dubs-predictor/
├── manifest.json       # Extension manifest (MV3, Chrome + Firefox)
└── src/
    ├── content.js      # Fetches API, builds and updates the overlay
    └── overlay.css     # Overlay styles (matrix green-on-black theme)
```
