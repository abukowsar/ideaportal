"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locale";

export default function LanguageSwitch({ current }: { current: Locale }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(current);
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    setLocaleState(next);
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language / ভাষা">
      <button type="button" className={locale === "bn" ? "active" : ""} onClick={() => switchTo("bn")}>
        বাং
      </button>
      <button type="button" className={locale === "en" ? "active" : ""} onClick={() => switchTo("en")}>
        EN
      </button>
    </div>
  );
}
