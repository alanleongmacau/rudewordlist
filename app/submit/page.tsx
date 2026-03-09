"use client";

import React, { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SeverityLevel = "Red" | "Yellow" | "Green" | "";
type AudioTone = "angry" | "joking" | "casual" | "";
type TabooType =
  | "發音陷阱"
  | "手勢禁忌"
  | "語意差異"
  | "地區差異"
  | "其他"
  | "";

interface SubmitFormData {
  word: string;
  language: string;
  region: string;
  type: TabooType;
  severity_level: SeverityLevel;
  literal_meaning: string;
  misunderstood_as: string;
  cultural_context: string;
  audio_tone: AudioTone;
  audio_file: File | null;
}

type FormErrors = Partial<Record<keyof SubmitFormData, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const TABOO_TYPES: TabooType[] = [
  "發音陷阱",
  "手勢禁忌",
  "語意差異",
  "地區差異",
  "其他",
];

const SEVERITY_OPTIONS: {
  value: Exclude<SeverityLevel, "">;
  icon: string;
  label: string;
  sublabel: string;
  colors: { ring: string; bg: string; text: string; dot: string };
}[] = [
  {
    value: "Red",
    icon: "🔴",
    label: "Red",
    sublabel: "嚴重冒犯",
    colors: {
      ring: "ring-red-400",
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-400",
    },
  },
  {
    value: "Yellow",
    icon: "🟡",
    label: "Yellow",
    sublabel: "依情境而定",
    colors: {
      ring: "ring-yellow-400",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-400",
    },
  },
  {
    value: "Green",
    icon: "🟢",
    label: "Green",
    sublabel: "僅為玩笑",
    colors: {
      ring: "ring-green-400",
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-400",
    },
  },
];

const AUDIO_TONES: { value: Exclude<AudioTone, "">; label: string; emoji: string }[] = [
  { value: "angry", label: "生氣", emoji: "😠" },
  { value: "joking", label: "玩笑", emoji: "😄" },
  { value: "casual", label: "日常", emoji: "🗣️" },
];

const INITIAL_FORM: SubmitFormData = {
  word: "",
  language: "",
  region: "",
  type: "",
  severity_level: "",
  literal_meaning: "",
  misunderstood_as: "",
  cultural_context: "",
  audio_tone: "",
  audio_file: null,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 4a.75.75 0 0 0-1.5 0v3.25a.75.75 0 0 0 1.5 0V5zm-.75 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
      {message}
    </p>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400",
    "transition focus:outline-none focus:ring-2 focus:ring-offset-0",
    hasError
      ? "border-red-400 bg-red-50 focus:ring-red-300"
      : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-indigo-200",
  ].join(" ");
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubmitPage() {
  const [form, setForm] = useState<SubmitFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Field helpers ──

  const set = useCallback(
    <K extends keyof SubmitFormData>(key: K, value: SubmitFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  // ── Validation ──

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.word.trim()) e.word = "請填寫單字或發音";
    if (!form.language.trim()) e.language = "請填寫語言";
    if (!form.region.trim()) e.region = "請填寫至少一個適用地區";
    if (!form.type) e.type = "請選擇類別";
    if (!form.severity_level) e.severity_level = "請選擇嚴重程度";
    if (!form.literal_meaning.trim()) e.literal_meaning = "請填寫原意";
    if (!form.misunderstood_as.trim()) e.misunderstood_as = "請填寫易誤解為";
    if (!form.cultural_context.trim()) {
      e.cultural_context = "請填寫文化背景說明";
    } else if (form.cultural_context.trim().length < 20) {
      e.cultural_context = "文化背景說明至少需填寫 20 字";
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorKey)?.focus();
      return;
    }
    // Mock submission success
    setSubmitted(true);
  };

  // ── Drag & Drop handlers (UI only) ──

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) set("audio_file", file);
  };

  // ── Success state ──

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-10 text-center shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">投稿成功！</h2>
          <p className="mt-2 text-sm text-gray-500">
            感謝你的貢獻，我們的編輯團隊將盡快審核你的投稿。
          </p>
          <button
            onClick={() => { setForm(INITIAL_FORM); setSubmitted(false); }}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          >
            再次投稿
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      {/* Page header */}
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500">
          Community Contribution
        </p>
        <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
          投稿新禁忌詞彙
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          幫助其他人識別跨文化地雷。所有投稿將由編輯審核後發布。
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-md"
        aria-label="投稿禁忌詞彙表單"
      >
        {/* ── Section 1: 基本資料 ── */}
        <section aria-labelledby="section-basic">
          <SectionHeading
            step={1}
            title="基本資料"
            subtitle="詞彙的語言背景與分類"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Word */}
            <div>
              <FieldLabel htmlFor="word" required>
                單字或發音
              </FieldLabel>
              <input
                id="word"
                type="text"
                value={form.word}
                onChange={(e) => set("word", e.target.value)}
                placeholder="例：那個 (Nèi ge)"
                aria-required="true"
                aria-describedby={errors.word ? "word-error" : undefined}
                className={inputClass(!!errors.word)}
              />
              <FieldError id="word-error" message={errors.word} />
            </div>

            {/* Language */}
            <div>
              <FieldLabel htmlFor="language" required>
                語言
              </FieldLabel>
              <input
                id="language"
                type="text"
                value={form.language}
                onChange={(e) => set("language", e.target.value)}
                placeholder="例：Chinese (Mandarin)"
                aria-required="true"
                aria-describedby={errors.language ? "language-error" : undefined}
                className={inputClass(!!errors.language)}
              />
              <FieldError id="language-error" message={errors.language} />
            </div>

            {/* Region */}
            <div>
              <FieldLabel htmlFor="region" required>
                適用地區
              </FieldLabel>
              <input
                id="region"
                type="text"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                placeholder="例：China, Taiwan（逗號分隔）"
                aria-required="true"
                aria-describedby={errors.region ? "region-error" : undefined}
                className={inputClass(!!errors.region)}
              />
              <FieldError id="region-error" message={errors.region} />
            </div>

            {/* Type */}
            <div>
              <FieldLabel htmlFor="type" required>
                類別
              </FieldLabel>
              <div className="relative">
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as TabooType)}
                  aria-required="true"
                  aria-describedby={errors.type ? "type-error" : undefined}
                  className={[
                    inputClass(!!errors.type),
                    "cursor-pointer appearance-none pr-9",
                  ].join(" ")}
                >
                  <option value="" disabled>
                    請選擇類別…
                  </option>
                  {TABOO_TYPES.filter((t) => t !== "").map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
                </svg>
              </div>
              <FieldError id="type-error" message={errors.type} />
            </div>
          </div>
        </section>

        <hr className="my-7 border-gray-100" />

        {/* ── Section 2: 嚴重程度 ── */}
        <section aria-labelledby="section-severity">
          <SectionHeading
            step={2}
            title="嚴重程度"
            subtitle="此詞彙在跨文化情境中造成誤解的嚴重性"
          />

          <div
            role="radiogroup"
            aria-label="嚴重程度"
            aria-describedby={errors.severity_level ? "severity-error" : undefined}
            className="grid grid-cols-3 gap-3"
          >
            {SEVERITY_OPTIONS.map((opt) => {
              const isSelected = form.severity_level === opt.value;
              return (
                <label
                  key={opt.value}
                  className={[
                    "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition",
                    "select-none focus-within:ring-2 focus-within:ring-offset-2",
                    isSelected
                      ? `${opt.colors.bg} border-current ${opt.colors.text} ring-2 ${opt.colors.ring}`
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="severity_level"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => set("severity_level", opt.value)}
                    className="sr-only"
                    aria-label={`${opt.label} — ${opt.sublabel}`}
                  />
                  <span className="text-2xl leading-none">{opt.icon}</span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-xs opacity-70">{opt.sublabel}</span>
                  {isSelected && (
                    <span
                      className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full ${opt.colors.dot}`}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <FieldError id="severity-error" message={errors.severity_level} />
        </section>

        <hr className="my-7 border-gray-100" />

        {/* ── Section 3: 語意說明 ── */}
        <section aria-labelledby="section-meaning">
          <SectionHeading
            step={3}
            title="語意說明"
            subtitle="描述原意與跨文化誤解的對比"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Literal Meaning */}
            <div>
              <FieldLabel htmlFor="literal_meaning" required>
                原意
              </FieldLabel>
              <input
                id="literal_meaning"
                type="text"
                value={form.literal_meaning}
                onChange={(e) => set("literal_meaning", e.target.value)}
                placeholder="例：That / That one"
                aria-required="true"
                aria-describedby={errors.literal_meaning ? "literal-error" : undefined}
                className={inputClass(!!errors.literal_meaning)}
              />
              <FieldError id="literal-error" message={errors.literal_meaning} />
            </div>

            {/* Misunderstood As */}
            <div>
              <FieldLabel htmlFor="misunderstood_as" required>
                易被誤解為
              </FieldLabel>
              <input
                id="misunderstood_as"
                type="text"
                value={form.misunderstood_as}
                onChange={(e) => set("misunderstood_as", e.target.value)}
                placeholder="例：種族歧視詞彙"
                aria-required="true"
                aria-describedby={errors.misunderstood_as ? "misunderstood-error" : undefined}
                className={inputClass(!!errors.misunderstood_as)}
              />
              <FieldError id="misunderstood-error" message={errors.misunderstood_as} />
            </div>
          </div>

          {/* Cultural Context */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between">
              <FieldLabel htmlFor="cultural_context" required>
                文化避雷指南
              </FieldLabel>
              <span
                className={[
                  "text-xs tabular-nums",
                  form.cultural_context.length < 20
                    ? "text-gray-400"
                    : "text-green-600",
                ].join(" ")}
              >
                {form.cultural_context.length} / 20 字以上
              </span>
            </div>
            <textarea
              id="cultural_context"
              rows={4}
              value={form.cultural_context}
              onChange={(e) => set("cultural_context", e.target.value)}
              placeholder="請說明此詞彙在跨文化情境中造成誤解的原因、背景及建議注意事項……"
              aria-required="true"
              aria-describedby={errors.cultural_context ? "context-error" : undefined}
              className={[
                inputClass(!!errors.cultural_context),
                "resize-none leading-relaxed",
              ].join(" ")}
            />
            <FieldError id="context-error" message={errors.cultural_context} />
          </div>
        </section>

        <hr className="my-7 border-gray-100" />

        {/* ── Section 4: 語音上傳（UI 預留） ── */}
        <section aria-labelledby="section-audio">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
              4
            </span>
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                語音示範上傳{" "}
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  選填
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                上傳語音示範，協助理解發音陷阱（功能開發中）
              </p>
            </div>
          </div>

          {/* Tone selector */}
          <div className="mb-3">
            <p className="mb-2 text-sm font-medium text-gray-700">語氣選擇</p>
            <div className="flex flex-wrap gap-2">
              {AUDIO_TONES.map((tone) => {
                const isActive = form.audio_tone === tone.value;
                return (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() =>
                      set("audio_tone", isActive ? "" : tone.value)
                    }
                    aria-pressed={isActive}
                    className={[
                      "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1",
                      isActive
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <span>{tone.emoji}</span>
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & drop upload area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label="語音檔案上傳區域，點擊或拖曳上傳"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                document.getElementById("audio-file-input")?.click();
              }
            }}
            className={[
              "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition",
              "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
              isDragging
                ? "border-indigo-400 bg-indigo-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100",
            ].join(" ")}
            onClick={() => document.getElementById("audio-file-input")?.click()}
          >
            <input
              id="audio-file-input"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) set("audio_file", file);
              }}
              tabIndex={-1}
            />

            {form.audio_file ? (
              <>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-indigo-700">
                  {form.audio_file.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    set("audio_file", null);
                  }}
                  className="mt-1 text-xs text-gray-400 underline hover:text-red-500"
                >
                  移除檔案
                </button>
              </>
            ) : (
              <>
                <svg
                  className={[
                    "mb-3 h-8 w-8 transition",
                    isDragging ? "text-indigo-500" : "text-gray-400",
                  ].join(" ")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 3.75 3.75 0 0 1 3.015 3.82A4.5 4.5 0 0 1 17.25 19.5H6.75Z" />
                </svg>
                <p className="text-sm font-medium text-gray-600">
                  {isDragging ? "放開以上傳" : "拖曳語音檔案至此，或點擊選擇"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  支援 MP3、WAV、M4A（最大 10 MB）
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v8m0 0-3-3m3 3 3-3M3 13h10" />
                  </svg>
                  選擇檔案
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── Submit ── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            className="
              w-full rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white
              shadow-sm transition
              hover:bg-indigo-700 hover:shadow-md
              active:scale-[0.98] active:bg-indigo-800
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
            "
          >
            提交投稿
          </button>
          <p className="text-xs text-gray-400">
            標示{" "}
            <span className="text-red-500">*</span> 的欄位為必填。所有投稿均須通過人工審核。
          </p>
        </div>
      </form>
    </main>
  );
}
