'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/game');
      }
    });
  }, [router]);

  return (
    <>
      <button
        style={{ display: 'block', margin: '24px auto', padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}
        onClick={() => router.push('/registration')}
      >
        Înregistrează-te sau autentifică-te
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <select
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: 8, border: '1px solid #bbb', background: '#f5f7fa', color: '#222', minWidth: 180 }}
          defaultValue={navigator.language?.slice(0,2) || 'en'}
          onChange={e => {
            const lang = e.target.value;
            window.location.search = `?lang=${lang}`;
          }}
        >
          <option value="en">English</option>
          <option value="ro">Română</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
      <a href="/all-questions" style={{ display: 'none' }}>All Questions</a>
    </>
  );
}
