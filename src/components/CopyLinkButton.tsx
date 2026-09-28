"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function CopyLinkButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (insecure context or permissions); the address bar still works.
    }
  }

  return (
    <button type="button" className="btn btn-outline btn-sm" onClick={copy} aria-live="polite">
      <Icon name={copied ? "check" : "share"} size={15} />
      {copied ? copiedLabel : label}
    </button>
  );
}
