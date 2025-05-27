"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ro", label: "Română" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value)}
      style={{ padding: "0.5rem 1rem", borderRadius: 8, margin: "1rem 0" }}
    >
      {LANGS.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
