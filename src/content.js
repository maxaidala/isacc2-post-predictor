// ISACC2 Dubs Predictor — content.js

(async () => {

  function getThreadId() {
    const match = window.location.href.match(/[?&]id=(\d+)/i);
    return match ? match[1] : null;
  }

  async function fetchLatest() {
    const resp = await fetch("https://www.isacc2.com/forums/thread_api.php", {
      credentials: "include",
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (data.status !== "success") throw new Error(`API: ${data.status}`);
    return data;
  }

  // Safe DOM helpers — never use innerHTML with API data
  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  function text(tag, className, content) {
    const e = el(tag, className);
    e.textContent = content;
    return e;
  }

  function link(className, href, content) {
    const a = el("a", className);
    a.href = href;
    a.target = "_blank";
    a.textContent = content;
    return a;
  }

  function stat(label, value, next = false, valueClass = null) {
    const div = el("div", next ? "icp-stat icp-next" : "icp-stat");
    div.appendChild(text("label", null, label));
    const strong = text("strong", null, value);
    if (valueClass) strong.className = valueClass;
    div.appendChild(strong);
    return div;
  }

  function divider() {
    return el("div", "icp-divider");
  }

  function buildOverlay(d) {
    const lp    = d.latest_post;
    const lt    = d.latest_thread;
    const stats = d.site_statistics;

    const root = el("div");
    root.id = "icp-overlay";

    // ── Header ──
    const header = el("div", "icp-header");
    header.appendChild(text("span", "icp-title", "ISACC2 DUBS PREDICTOR"));
    const toggle = el("button", "icp-toggle");
    toggle.title = "Expand";
    toggle.textContent = "+";
    header.appendChild(toggle);
    root.appendChild(header);

    // ── Body (hidden by default) ──
    const body = el("div", "icp-body");
    body.style.display = "none";

    // Post numbers
    const postRow = el("div", "icp-row");
    postRow.appendChild(stat("Latest Post #", d.last_thread_id.toLocaleString(), false, "icp-post-latest"));
    postRow.appendChild(stat("Next Post #", (d.last_thread_id + 1).toLocaleString(), true, "icp-post-next"));
    body.appendChild(postRow);

    // Comment numbers
    const commentRow = el("div", "icp-row");
    commentRow.appendChild(stat("Latest Comment #", d.last_post_id.toLocaleString(), false, "icp-comment-latest"));
    commentRow.appendChild(stat("Next Comment #", (d.last_post_id + 1).toLocaleString(), true, "icp-comment-next"));
    body.appendChild(commentRow);

    body.appendChild(divider());

    // ── Latest post block ──
    const latestPostBlock = el("div", "icp-latest-block");
    latestPostBlock.appendChild(text("div", "icp-latest-label", "Latest post"));

    const ltMeta = el("div", "icp-latest-meta");
    const ltUser = text("span", "icp-user icp-lt-user", lt.author.username);
    ltUser.style.color = lt.author.color;
    ltMeta.appendChild(ltUser);
    ltMeta.appendChild(text("span", "icp-sep", " in "));
    const ltSub = text("span", "icp-lt-sub", lt.subforum.name);
    ltSub.style.color = lt.subforum.color ?? "#00cc44";
    ltMeta.appendChild(ltSub);
    latestPostBlock.appendChild(ltMeta);

    const ltLink = link("icp-jump icp-lt-link", lt.absolute_url, lt.title + " →");
    latestPostBlock.appendChild(ltLink);
    body.appendChild(latestPostBlock);

    body.appendChild(divider());

    // ── Latest comment block ──
    const latestCommentBlock = el("div", "icp-latest-block");
    latestCommentBlock.appendChild(text("div", "icp-latest-label", "Latest comment"));

    const lpMeta = el("div", "icp-latest-meta");
    const lpUser = text("span", "icp-user icp-lp-user", lp.author.username);
    lpUser.style.color = lp.author.color;
    lpMeta.appendChild(lpUser);
    lpMeta.appendChild(text("span", "icp-sep", " in "));
    const lpThreadLink = link("icp-link icp-lp-thread", lp.absolute_url, lp.thread.title);
    lpMeta.appendChild(lpThreadLink);
    latestCommentBlock.appendChild(lpMeta);

    const lpSub = text("div", "icp-latest-meta icp-subforum icp-lp-sub", lp.subforum.name);
    lpSub.style.color = lp.subforum.color ?? "#005522";
    latestCommentBlock.appendChild(lpSub);

    latestCommentBlock.appendChild(text("div", "icp-quote icp-lp-excerpt", lp.content_excerpt));
    latestCommentBlock.appendChild(link("icp-jump icp-lp-jump", lp.absolute_url, "Jump to comment →"));
    body.appendChild(latestCommentBlock);

    body.appendChild(divider());

    // ── Site stats ──
    const statsRow = el("div", "icp-stats-row");
    statsRow.appendChild(text("span", "icp-stat-threads", stats.total_threads.toLocaleString() + " posts"));
    statsRow.appendChild(text("span", "icp-stat-posts", stats.total_posts.toLocaleString() + " comments"));
    statsRow.appendChild(text("span", "icp-stat-users", stats.total_users.toLocaleString() + " users"));
    statsRow.appendChild(text("span", "icp-online icp-stat-online", stats.online_users + " online"));
    body.appendChild(statsRow);

    // ── Footer ──
    const footer = el("div", "icp-footer");
    const refreshBtn = el("button", "icp-refresh");
    refreshBtn.textContent = "↻ Refresh";
    footer.appendChild(refreshBtn);
    body.appendChild(footer);

    root.appendChild(body);
    return root;
  }

  function attachEvents(el) {
    const toggleBtn  = el.querySelector(".icp-toggle");
    const body       = el.querySelector(".icp-body");
    const refreshBtn = el.querySelector(".icp-refresh");

    toggleBtn.addEventListener("click", () => {
      const collapsed = body.style.display === "none";
      body.style.display = collapsed ? "" : "none";
      toggleBtn.textContent = collapsed ? "−" : "+";
    });

    refreshBtn.addEventListener("click", async () => {
      refreshBtn.textContent = "…";
      refreshBtn.disabled = true;
      await run();
      // Look up the button fresh in case the overlay was rebuilt
      const btn = document.querySelector("#icp-overlay .icp-refresh");
      if (btn) {
        btn.textContent = "✓ Done";
        btn.disabled = false;
        setTimeout(() => { btn.textContent = "↻ Refresh"; }, 1000);
      }
    });
  }

  function showLoading() {
    let overlay = document.getElementById("icp-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "icp-overlay";
      document.body.appendChild(overlay);
    }
    // Loading state is static markup only — no API data involved
    const header = document.createElement("div");
    header.className = "icp-header";
    const title = document.createElement("span");
    title.className = "icp-title";
    title.textContent = "ISACC2 DUBS PREDICTOR";
    const status = document.createElement("span");
    status.className = "icp-status";
    status.textContent = "Loading…";
    header.appendChild(title);
    header.appendChild(status);
    overlay.replaceChildren(header);
  }

  function showError(msg) {
    const overlay = document.getElementById("icp-overlay");
    if (!overlay) return;
    const header = document.createElement("div");
    header.className = "icp-header";
    const title = document.createElement("span");
    title.className = "icp-title";
    title.textContent = "ISACC2 DUBS PREDICTOR";
    const closeBtn = document.createElement("button");
    closeBtn.className = "icp-toggle";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => overlay.remove());
    header.appendChild(title);
    header.appendChild(closeBtn);
    const body = document.createElement("div");
    body.className = "icp-body icp-error";
    body.textContent = "⚠️ " + msg;
    overlay.replaceChildren(header, body);
  }

  function updateBody(overlay, d) {
    const lp    = d.latest_post;
    const lt    = d.latest_thread;
    const stats = d.site_statistics;

    const body = overlay.querySelector(".icp-body");

    // Post numbers
    body.querySelector(".icp-post-latest").textContent = d.last_thread_id.toLocaleString();
    body.querySelector(".icp-post-next").textContent   = (d.last_thread_id + 1).toLocaleString();

    // Comment numbers
    body.querySelector(".icp-comment-latest").textContent = d.last_post_id.toLocaleString();
    body.querySelector(".icp-comment-next").textContent   = (d.last_post_id + 1).toLocaleString();

    // Latest post
    const ltUser = body.querySelector(".icp-lt-user");
    ltUser.textContent = lt.author.username;
    ltUser.style.color = lt.author.color;
    const ltSub = body.querySelector(".icp-lt-sub");
    ltSub.textContent = lt.subforum.name;
    ltSub.style.color = lt.subforum.color ?? "#00cc44";
    const ltLink = body.querySelector(".icp-lt-link");
    ltLink.textContent = lt.title + " →";
    ltLink.href = lt.absolute_url;

    // Latest comment
    const lpUser = body.querySelector(".icp-lp-user");
    lpUser.textContent = lp.author.username;
    lpUser.style.color = lp.author.color;
    const lpThread = body.querySelector(".icp-lp-thread");
    lpThread.textContent = lp.thread.title;
    lpThread.href = lp.absolute_url;
    const lpSub = body.querySelector(".icp-lp-sub");
    lpSub.textContent = lp.subforum.name;
    lpSub.style.color = lp.subforum.color ?? "#005522";
    body.querySelector(".icp-lp-excerpt").textContent = lp.content_excerpt;
    body.querySelector(".icp-lp-jump").href = lp.absolute_url;

    // Stats
    body.querySelector(".icp-stat-threads").textContent  = stats.total_threads.toLocaleString() + " posts";
    body.querySelector(".icp-stat-posts").textContent    = stats.total_posts.toLocaleString() + " comments";
    body.querySelector(".icp-stat-users").textContent    = stats.total_users.toLocaleString() + " users";
    body.querySelector(".icp-stat-online").textContent   = stats.online_users + " online";
  }

  async function run() {
    try {
      const data    = await fetchLatest();
      const overlay = document.getElementById("icp-overlay");

      if (!overlay || !overlay.querySelector(".icp-body")) {
        // First load or loading state — build the full overlay and attach events
        const fresh = buildOverlay(data);
        if (overlay) overlay.replaceWith(fresh);
        else document.body.appendChild(fresh);
        attachEvents(fresh);
      } else {
        // Subsequent updates — just update the content in place
        updateBody(overlay, data);
      }
    } catch (err) {
      console.error("[ISACC2]", err);
      showError(err.message);
    }
  }

  showLoading();
  await run();
  setInterval(() => { if (document.getElementById("icp-overlay")) run(); }, 10_000);

})();
