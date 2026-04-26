const STORAGE_KEY = "te-vlog-player-state";
const SPEEDS = [0.75, 1, 1.25, 1.5];
const HIGHLIGHT_COLORS = ["yellow", "green", "pink"];

const lesson = {
  title: "Post-workout catch-up vlog",
  period: 2,
  video: {
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  segments: [
    {
      start: 0,
      end: 6,
      english: "I just got out of the shower and I am literally dead after this Pilates class.",
      chinese: "我刚洗完澡，这节普拉提课真的把我累趴了。",
      vocab: [
        { word: "got out of", meaning: "刚从...出来", color: "green" },
        { word: "literally", meaning: "真的、简直", color: "yellow" },
        { word: "Pilates", meaning: "普拉提", color: "pink" },
      ],
    },
    {
      start: 6,
      end: 11,
      english: "It was such a good burn and I'm excited for all of the upcoming classes.",
      chinese: "燃烧感太棒了，我很期待接下来的课程。",
      vocab: [
        { word: "burn", meaning: "燃脂感", color: "yellow" },
        { word: "upcoming", meaning: "即将到来的", color: "yellow" },
      ],
    },
    {
      start: 11,
      end: 15,
      english: "I'm probably gonna be so strong after this week.",
      chinese: "我感觉这周结束后我会变得超级壮。",
      vocab: [
        { word: "probably", meaning: "很可能", color: "green" },
        { word: "gonna", meaning: "going to 的口语形式", color: "pink" },
      ],
    },
    {
      start: 15,
      end: 24,
      english: "But we're meeting outside, we're having dinner and it's actually kind of cold when the sun goes down.",
      chinese: "但我们要在外面见面吃晚饭，太阳一落山其实有点冷。",
      vocab: [
        { word: "meeting outside", meaning: "在户外见面", color: "green" },
        { word: "sun goes down", meaning: "太阳下山", color: "yellow" },
      ],
    },
    {
      start: 24,
      end: 30,
      english: "So I'll have to layer up. I actually didn't bring a lot of jackets.",
      chinese: "所以我得多穿几层。其实我没带太多外套。",
      vocab: [
        { word: "layer up", meaning: "多穿几层", color: "pink" },
        { word: "jackets", meaning: "外套", color: "yellow" },
      ],
    },
    {
      start: 30,
      end: 36,
      english: "Thankfully I brought this fluffy sweater, so I think I'll be fine.",
      chinese: "还好我带了这件软绵绵的毛衣，所以我觉得应该没问题。",
      vocab: [
        { word: "Thankfully", meaning: "幸好", color: "green" },
        { word: "fluffy sweater", meaning: "软绵绵的毛衣", color: "pink" },
      ],
    },
  ],
};

const saved = readStorage();

const state = {
  segments: lesson.segments.map(normalizeSegment),
  index: 0,
  playbackRate: saved.playbackRate ?? 1,
  sentenceMode: saved.sentenceMode ?? true,
  repeatMode: saved.repeatMode ?? true,
  videoLoop: saved.videoLoop ?? true,
  favorites: new Set(saved.favorites ?? []),
  practiced: new Set(saved.practiced ?? []),
  abLoop: {
    enabled: false,
    start: null,
    end: null,
  },
  sourceMode: "sample",
};

state.index = clamp(saved.index ?? 2, 0, state.segments.length - 1);

const ui = {
  periodNumber: document.querySelector("#periodNumber"),
  episodeLabel: document.querySelector("#episodeLabel"),
  lessonTitle: document.querySelector("#lessonTitle"),
  progressLabel: document.querySelector("#progressLabel"),
  favoritesCount: document.querySelector("#favoritesCount"),
  sentenceModeBtn: document.querySelector("#sentenceModeBtn"),
  repeatBtn: document.querySelector("#repeatBtn"),
  loopVideoBtn: document.querySelector("#loopVideoBtn"),
  accentBtn: document.querySelector("#accentBtn"),
  markABBtn: document.querySelector("#markABBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  replayBtn: document.querySelector("#replayBtn"),
  playPauseBtn: document.querySelector("#playPauseBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  speedBtn: document.querySelector("#speedBtn"),
  singleBtn: document.querySelector("#singleBtn"),
  continueBtn: document.querySelector("#continueBtn"),
  setPointABtn: document.querySelector("#setPointABtn"),
  setPointBBtn: document.querySelector("#setPointBBtn"),
  clearABBtn: document.querySelector("#clearABBtn"),
  abStatusLabel: document.querySelector("#abStatusLabel"),
  video: document.querySelector("#lessonVideo"),
  segmentTimeLabel: document.querySelector("#segmentTimeLabel"),
  currentTimeLabel: document.querySelector("#currentTimeLabel"),
  durationLabel: document.querySelector("#durationLabel"),
  timelineRange: document.querySelector("#timelineRange"),
  focusEnglish: document.querySelector("#focusEnglish"),
  focusChinese: document.querySelector("#focusChinese"),
  transcriptList: document.querySelector("#transcriptList"),
  transcriptItemTemplate: document.querySelector("#transcriptItemTemplate"),
  vocabGrid: document.querySelector("#vocabGrid"),
  vocabCardTemplate: document.querySelector("#vocabCardTemplate"),
  stepLoad: document.querySelector("#stepLoad"),
  stepPractice: document.querySelector("#stepPractice"),
  stepReview: document.querySelector("#stepReview"),
  practiceHint: document.querySelector("#practiceHint"),
  reviewHint: document.querySelector("#reviewHint"),
  practicedCountLabel: document.querySelector("#practicedCountLabel"),
  remainingCountLabel: document.querySelector("#remainingCountLabel"),
  completionRateLabel: document.querySelector("#completionRateLabel"),
  startCurrentBtn: document.querySelector("#startCurrentBtn"),
  markPracticedBtn: document.querySelector("#markPracticedBtn"),
  jumpFavoriteBtn: document.querySelector("#jumpFavoriteBtn"),
  favoriteBtn: document.querySelector("#favoriteBtn"),
  summaryTitle: document.querySelector("#summaryTitle"),
  summaryPracticed: document.querySelector("#summaryPracticed"),
  summaryPracticedText: document.querySelector("#summaryPracticedText"),
  summaryFavorites: document.querySelector("#summaryFavorites"),
  summaryFavoritesText: document.querySelector("#summaryFavoritesText"),
  summaryAction: document.querySelector("#summaryAction"),
  summaryActionText: document.querySelector("#summaryActionText"),
  reviewList: document.querySelector("#reviewList"),
  reviewListHint: document.querySelector("#reviewListHint"),
  reviewItemTemplate: document.querySelector("#reviewItemTemplate"),
  restartPracticeBtn: document.querySelector("#restartPracticeBtn"),
  videoUrlInput: document.querySelector("#videoUrlInput"),
  applyVideoBtn: document.querySelector("#applyVideoBtn"),
  openLocalVideoBtn: document.querySelector("#openLocalVideoBtn"),
  localVideoInput: document.querySelector("#localVideoInput"),
  sourceStatusLabel: document.querySelector("#sourceStatusLabel"),
};

init();

function init() {
  ui.periodNumber.textContent = String(lesson.period);
  ui.episodeLabel.textContent = String(lesson.period);
  ui.lessonTitle.textContent = lesson.title;
  ui.video.src = lesson.video.src;
  ui.video.poster = lesson.video.poster;
  ui.video.playbackRate = state.playbackRate;
  ui.video.loop = state.videoLoop && !state.sentenceMode;
  ui.sourceStatusLabel.textContent = "当前使用示例视频 + 示例字幕";

  renderAll();
  syncUi();

  ui.video.addEventListener("loadedmetadata", () => {
    if (state.sourceMode === "auto-chunk") {
      rebuildSegmentsFromDuration(ui.video.duration);
      state.index = 0;
      renderAll();
    }
    ui.durationLabel.textContent = formatTime(ui.video.duration);
    jumpToSegment(state.index, false);
  });
  ui.video.addEventListener("timeupdate", onTimeUpdate);
  ui.playPauseBtn.addEventListener("click", togglePlayPause);
  ui.prevBtn.addEventListener("click", () => jumpToSegment(state.index - 1, true));
  ui.nextBtn.addEventListener("click", () => jumpToSegment(state.index + 1, true));
  ui.replayBtn.addEventListener("click", () => jumpToSegment(state.index, true));
  ui.speedBtn.addEventListener("click", cycleSpeed);
  ui.repeatBtn.addEventListener("click", toggleRepeatMode);
  ui.sentenceModeBtn.addEventListener("click", toggleSentenceMode);
  ui.singleBtn.addEventListener("click", toggleSentenceMode);
  ui.continueBtn.addEventListener("click", continuePlayback);
  ui.loopVideoBtn.addEventListener("click", toggleVideoLoop);
  ui.favoriteBtn.addEventListener("click", toggleFavoriteCurrent);
  ui.startCurrentBtn.addEventListener("click", () => jumpToSegment(state.index, true));
  ui.markPracticedBtn.addEventListener("click", markCurrentPracticed);
  ui.jumpFavoriteBtn.addEventListener("click", jumpToNextFavorite);
  ui.restartPracticeBtn.addEventListener("click", restartPractice);
  ui.timelineRange.addEventListener("input", onScrub);
  ui.applyVideoBtn.addEventListener("click", applyVideo);
  ui.accentBtn.addEventListener("click", () => flashButton(ui.accentBtn));
  ui.markABBtn.addEventListener("click", toggleABLoop);
  ui.setPointABtn.addEventListener("click", setABStart);
  ui.setPointBBtn.addEventListener("click", setABEnd);
  ui.clearABBtn.addEventListener("click", clearABLoop);
  ui.openLocalVideoBtn.addEventListener("click", () => ui.localVideoInput.click());
  ui.localVideoInput.addEventListener("change", importLocalVideo);
}

function renderAll() {
  renderTranscript();
  renderVocabulary();
  renderCurrent();
  updateABLabel();
  renderFlowState();
  renderSummary();
}

function renderTranscript() {
  ui.transcriptList.innerHTML = "";

  state.segments.forEach((segment, index) => {
    const node = ui.transcriptItemTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.index = String(index);
    node.querySelector(".line-index").textContent = String(index + 1);
    node.querySelector(".line-time").textContent = `${formatTime(segment.start)} - ${formatTime(segment.end)}`;
    node.querySelector(".transcript-en").innerHTML = highlightWords(segment.english, segment.vocab);
    node.querySelector(".transcript-zh").textContent = segment.chinese;
    node.addEventListener("click", () => jumpToSegment(index, true));
    ui.transcriptList.appendChild(node);
  });
}

function renderVocabulary() {
  ui.vocabGrid.innerHTML = "";

  state.segments.forEach((segment, index) => {
    segment.vocab.forEach((vocab) => {
      const card = ui.vocabCardTemplate.content.firstElementChild.cloneNode(true);
      card.querySelector(".vocab-word").textContent = vocab.word;
      card.querySelector(".vocab-meaning").textContent = vocab.meaning;
      card.querySelector(".vocab-context").textContent = `句子 ${index + 1}`;
      card.addEventListener("click", () => jumpToSegment(index, true));
      ui.vocabGrid.appendChild(card);
    });
  });
}

function renderCurrent() {
  const current = state.segments[state.index];
  if (!current) return;

  ui.focusEnglish.textContent = current.english;
  ui.focusChinese.textContent = current.chinese;
  ui.segmentTimeLabel.textContent = `句子 ${state.index + 1} / ${state.segments.length}`;

  [...ui.transcriptList.querySelectorAll(".transcript-item")].forEach((item, index) => {
    item.classList.toggle("active", index === state.index);
    const heart = item.querySelector(".mini-action");
    if (heart) {
      heart.textContent = state.favorites.has(index) ? "♥" : "♡";
      heart.classList.toggle("is-favorite", state.favorites.has(index));
    }
  });

  const favored = state.favorites.has(state.index);
  ui.favoriteBtn.setAttribute("aria-pressed", String(favored));
  ui.favoriteBtn.textContent = favored ? "已收藏本句" : "收藏本句";
  ui.favoritesCount.textContent = String(state.favorites.size);
  ui.progressLabel.textContent = `${Math.round(((state.index + 1) / state.segments.length) * 100)}%`;
  renderFlowState();
  renderSummary();
  persist();
}

function onTimeUpdate() {
  const t = ui.video.currentTime;
  ui.currentTimeLabel.textContent = formatTime(t);
  paintTimeline();

  const found = state.segments.findIndex((segment) => t >= segment.start && t < segment.end);
  if (found !== -1 && found !== state.index) {
    state.index = found;
    renderCurrent();
  }

  if (state.abLoop.enabled && state.abLoop.start !== null && state.abLoop.end !== null && t >= state.abLoop.end - 0.05) {
    ui.video.currentTime = state.abLoop.start;
    if (ui.video.paused) {
      ui.video.play().catch(() => {});
    }
    return;
  }

  const current = state.segments[state.index];
  if (!current) return;

  if (!state.abLoop.enabled && state.repeatMode && t >= current.end - 0.05) {
    ui.video.currentTime = current.start;
    if (ui.video.paused) {
      ui.video.play().catch(() => {});
    }
    return;
  }

  if (!state.abLoop.enabled && state.sentenceMode && !state.repeatMode && t >= current.end - 0.05) {
    ui.video.pause();
    ui.video.currentTime = current.end;
    syncUi();
  }
}

function togglePlayPause() {
  if (ui.video.paused) {
    ui.video.play().catch(() => {});
  } else {
    ui.video.pause();
  }
  syncUi();
}

function jumpToSegment(index, autoplay) {
  const nextIndex = clamp(index, 0, state.segments.length - 1);
  state.index = nextIndex;
  ui.video.currentTime = state.segments[nextIndex].start;
  renderCurrent();
  paintTimeline();
  scrollCurrentIntoView();

  if (autoplay) {
    ui.video.play().catch(() => {});
  }
  syncUi();
}

function cycleSpeed() {
  const currentIndex = SPEEDS.indexOf(state.playbackRate);
  state.playbackRate = SPEEDS[(currentIndex + 1) % SPEEDS.length];
  ui.video.playbackRate = state.playbackRate;
  syncUi();
  persist();
}

function toggleRepeatMode() {
  state.repeatMode = !state.repeatMode;
  syncUi();
  persist();
}

function toggleSentenceMode() {
  state.sentenceMode = !state.sentenceMode;
  ui.video.loop = state.videoLoop && !state.sentenceMode;
  syncUi();
  persist();
}

function continuePlayback() {
  state.sentenceMode = false;
  state.repeatMode = false;
  ui.video.loop = state.videoLoop;
  syncUi();
  ui.video.play().catch(() => {});
  persist();
}

function toggleVideoLoop() {
  state.videoLoop = !state.videoLoop;
  ui.video.loop = state.videoLoop && !state.sentenceMode;
  ui.loopVideoBtn.classList.toggle("active", state.videoLoop);
  persist();
}

function toggleFavoriteCurrent() {
  if (state.favorites.has(state.index)) {
    state.favorites.delete(state.index);
  } else {
    state.favorites.add(state.index);
  }
  renderCurrent();
}

function markCurrentPracticed() {
  state.practiced.add(state.index);
  renderFlowState();
  renderSummary();
  persist();
}

function jumpToNextFavorite() {
  if (!state.favorites.size) return;
  const favoriteIndexes = [...state.favorites].sort((a, b) => a - b);
  const next = favoriteIndexes.find((value) => value > state.index) ?? favoriteIndexes[0];
  jumpToSegment(next, false);
}

function restartPractice() {
  state.practiced = new Set();
  state.favorites = new Set();
  state.index = 0;
  clearABLoop();
  renderAll();
  jumpToSegment(0, false);
}

function onScrub(event) {
  const percent = Number(event.target.value);
  const duration = ui.video.duration || getTotalDuration();
  ui.video.currentTime = (percent / 100) * duration;
}

function paintTimeline() {
  const duration = ui.video.duration || getTotalDuration();
  const percent = duration ? (ui.video.currentTime / duration) * 100 : 0;
  ui.timelineRange.value = String(percent);
  ui.timelineRange.style.background = `linear-gradient(90deg, var(--yellow) ${percent}%, #e8edf7 ${percent}%)`;
}

function applyVideo() {
  const src = ui.videoUrlInput.value.trim();
  if (!src) return;
  loadVideoSource(src, "链接视频已载入", true);
}

function toggleABLoop() {
  if (state.abLoop.start === null || state.abLoop.end === null) {
    flashButton(ui.markABBtn);
    return;
  }
  state.abLoop.enabled = !state.abLoop.enabled;
  syncUi();
  updateABLabel();
}

function setABStart() {
  state.abLoop.start = ui.video.currentTime;
  if (state.abLoop.end !== null && state.abLoop.end <= state.abLoop.start) {
    state.abLoop.end = null;
    state.abLoop.enabled = false;
  }
  updateABLabel();
  syncUi();
}

function setABEnd() {
  if (state.abLoop.start === null) {
    state.abLoop.start = ui.video.currentTime;
  } else if (ui.video.currentTime <= state.abLoop.start + 0.2) {
    state.abLoop.end = state.abLoop.start + 2;
  } else {
    state.abLoop.end = ui.video.currentTime;
  }

  if (state.abLoop.end !== null && state.abLoop.start !== null && state.abLoop.end > state.abLoop.start) {
    state.abLoop.enabled = true;
  }
  updateABLabel();
  syncUi();
}

function clearABLoop() {
  state.abLoop = {
    enabled: false,
    start: null,
    end: null,
  };
  updateABLabel();
  syncUi();
}

function updateABLabel() {
  if (state.abLoop.start === null && state.abLoop.end === null) {
    ui.abStatusLabel.textContent = "未设置";
    return;
  }

  if (state.abLoop.start !== null && state.abLoop.end === null) {
    ui.abStatusLabel.textContent = `A ${formatTime(state.abLoop.start)} · 等待 B 点`;
    return;
  }

  ui.abStatusLabel.textContent = `${state.abLoop.enabled ? "循环中" : "已设置"} ${formatTime(state.abLoop.start)} - ${formatTime(state.abLoop.end)}`;
}

function importLocalVideo(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const objectUrl = URL.createObjectURL(file);
  loadVideoSource(objectUrl, `本地视频：${file.name}`, true);
  event.target.value = "";
}

function syncUi() {
  const paused = ui.video.paused;
  ui.playPauseBtn.classList.toggle("play", !paused);
  ui.playPauseBtn.querySelector(".tool-icon").textContent = paused ? "▶" : "❚❚";
  ui.playPauseBtn.querySelector(".tool-text").textContent = paused ? "播放" : "暂停";
  ui.speedBtn.querySelector(".tool-icon").textContent = `${trimSpeed(state.playbackRate)}x`;
  ui.repeatBtn.setAttribute("aria-pressed", String(state.repeatMode));
  ui.repeatBtn.classList.toggle("active", state.repeatMode);
  ui.sentenceModeBtn.setAttribute("aria-pressed", String(state.sentenceMode));
  ui.sentenceModeBtn.textContent = state.sentenceMode ? "单" : "连";
  ui.singleBtn.classList.toggle("active", state.sentenceMode);
  ui.continueBtn.classList.toggle("active", !state.sentenceMode && !state.repeatMode);
  ui.loopVideoBtn.classList.toggle("active", state.videoLoop);
  ui.markABBtn.classList.toggle("active", state.abLoop.enabled);
}

function highlightWords(text, vocab) {
  let output = escapeHtml(text);
  vocab.forEach((item) => {
    const escaped = item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    output = output.replace(regex, (match) => `<span class="highlight ${item.color}">${match}</span>`);
  });
  return output;
}

function scrollCurrentIntoView() {
  ui.transcriptList
    .querySelector(`.transcript-item[data-index="${state.index}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function flashButton(button) {
  button.classList.add("active");
  window.setTimeout(() => button.classList.remove("active"), 700);
}

function buildAutoVocab(english) {
  const words = [...new Set((english.match(/[A-Za-z']+/g) || []).filter((word) => word.length >= 5))].slice(0, 3);
  return words.map((word, index) => ({
    word,
    meaning: "待补充释义",
    color: HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length],
  }));
}

function normalizeSegment(segment) {
  return {
    start: Number(segment.start) || 0,
    end: Number(segment.end) || 0,
    english: segment.english?.trim() || "",
    chinese: segment.chinese?.trim() || "",
    vocab: Array.isArray(segment.vocab) ? segment.vocab : [],
  };
}

function getTotalDuration() {
  return state.segments[state.segments.length - 1]?.end || 0;
}

function loadVideoSource(src, statusText, autoChunk) {
  ui.video.pause();
  ui.video.src = src;
  ui.video.load();
  ui.sourceStatusLabel.textContent = autoChunk ? `${statusText} · 自动分段练习` : statusText;
  state.sourceMode = autoChunk ? "auto-chunk" : "sample";
  state.index = 0;
  state.favorites = new Set();
  state.practiced = new Set();
  clearABLoop();
}

function rebuildSegmentsFromDuration(duration) {
  if (!Number.isFinite(duration) || duration <= 0) return;

  const chunkSize = chooseChunkSize(duration);
  const total = Math.max(1, Math.ceil(duration / chunkSize));
  state.segments = Array.from({ length: total }, (_, index) => {
    const start = index * chunkSize;
    const end = Math.min(duration, start + chunkSize);
    const chunkLabel = `Chunk ${index + 1}`;
    return normalizeSegment({
      start,
      end,
      english: `${chunkLabel}: Listen, shadow, and repeat this part of your vlog.`,
      chinese: `第 ${index + 1} 段自动练习片段，适合先精听、跟读、再做 A-B 循环。`,
      vocab: buildAutoVocab(`listen shadow repeat vlog chunk ${index + 1}`),
    });
  });
  state.practiced = new Set();
}

function chooseChunkSize(duration) {
  if (duration <= 60) return 5;
  if (duration <= 180) return 6;
  if (duration <= 480) return 8;
  return 10;
}

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      index: state.index,
      playbackRate: state.playbackRate,
      sentenceMode: state.sentenceMode,
      repeatMode: state.repeatMode,
      videoLoop: state.videoLoop,
      favorites: [...state.favorites],
      practiced: [...state.practiced],
    }),
  );
}

function renderFlowState() {
  const practicedCount = state.practiced.size;
  const total = state.segments.length;
  const remaining = Math.max(0, total - practicedCount);
  const completion = total ? Math.round((practicedCount / total) * 100) : 0;
  const currentPracticed = state.practiced.has(state.index);
  const hasFavorites = state.favorites.size > 0;

  ui.practicedCountLabel.textContent = String(practicedCount);
  ui.remainingCountLabel.textContent = String(remaining);
  ui.completionRateLabel.textContent = `${completion}%`;

  ui.stepLoad.className = `flow-step ${state.sourceMode === "sample" ? "" : "done"}`.trim();
  ui.stepPractice.className = `flow-step ${currentPracticed ? "done" : "active"}`.trim();
  ui.stepReview.className = `flow-step ${hasFavorites || practicedCount > 0 ? "active" : ""}`.trim();

  ui.practiceHint.textContent = currentPracticed
    ? `当前第 ${state.index + 1} 段已练过，可以继续重播或切到下一段。`
    : `当前第 ${state.index + 1} 段还没标记完成，建议先播放并用循环练习。`;
  ui.reviewHint.textContent = hasFavorites
    ? `你有 ${state.favorites.size} 条收藏，点击“跳到下一收藏”可以集中复习。`
    : "还没有收藏难句，遇到卡壳的句子可以先收藏起来。";

  ui.markPracticedBtn.textContent = currentPracticed ? "本段已完成" : "标记本段已练";
  ui.markPracticedBtn.disabled = currentPracticed;
  ui.jumpFavoriteBtn.disabled = !hasFavorites;
}

function renderSummary() {
  const total = state.segments.length;
  const practicedCount = state.practiced.size;
  const favoriteCount = state.favorites.size;
  const isDone = total > 0 && practicedCount === total;

  ui.summaryTitle.textContent = isDone ? "Practice Complete" : "Practice Snapshot";
  ui.summaryPracticed.textContent = `${practicedCount} / ${total}`;
  ui.summaryPracticedText.textContent = isDone
    ? "这一轮已经全部练完了，可以回看收藏句做二刷。"
    : `当前还剩 ${Math.max(0, total - practicedCount)} 段没有标记完成。`;
  ui.summaryFavorites.textContent = String(favoriteCount);
  ui.summaryFavoritesText.textContent = favoriteCount
    ? `你已收藏 ${favoriteCount} 句，建议最后集中复习这些卡点。`
    : "还没有收藏句子，遇到难句时记得收藏。";
  ui.summaryAction.textContent = isDone ? "去复习收藏" : practicedCount > 0 ? "继续下一段" : "开始第一段";
  ui.summaryActionText.textContent = isDone
    ? "点击“跳到下一收藏”或直接点下面的复习清单，开始二刷。"
    : practicedCount > 0
      ? "继续保持这个节奏，一段一段完成会更有成就感。"
      : "建议先点击“开始练当前段”，然后用单句循环完成第一段。";

  renderReviewList();
}

function renderReviewList() {
  ui.reviewList.innerHTML = "";
  const favoriteIndexes = [...state.favorites].sort((a, b) => a - b);

  if (!favoriteIndexes.length) {
    const empty = document.createElement("div");
    empty.className = "review-item";
    empty.innerHTML = `
      <span class="review-index">0</span>
      <div class="review-copy">
        <p class="review-en">No saved lines yet.</p>
        <p class="review-zh">还没有收藏句子，收藏后会自动出现在这里，方便二刷复习。</p>
      </div>
    `;
    ui.reviewList.appendChild(empty);
    ui.reviewListHint.textContent = "收藏后会出现在这里";
    return;
  }

  ui.reviewListHint.textContent = `共 ${favoriteIndexes.length} 条收藏，点击可跳转`;

  favoriteIndexes.forEach((index) => {
    const segment = state.segments[index];
    if (!segment) return;
    const node = ui.reviewItemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".review-index").textContent = String(index + 1);
    node.querySelector(".review-en").textContent = segment.english;
    node.querySelector(".review-zh").textContent = segment.chinese || "这段当前没有中文提示。";
    node.addEventListener("click", () => jumpToSegment(index, false));
    ui.reviewList.appendChild(node);
  });
}

function formatTime(seconds) {
  const n = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(n / 60);
  const secs = n % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function trimSpeed(speed) {
  return Number(speed).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
