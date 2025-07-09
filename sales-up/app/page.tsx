'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import LanguageSelector from "./components/LanguageSelector";
import { useTranslation } from "./context/useTranslation";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/menu');
      }
    });
  }, [router]);

  return (
    <>
      <LanguageSelector />
      <button
        style={{ display: 'block', margin: '24px auto', padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}
        onClick={() => router.push('/registration')}
      >
        {t('register_or_login')}
      </button>
      <a href="/all-questions" style={{ display: 'none' }}>All Questions</a>
    </>
  );
}
