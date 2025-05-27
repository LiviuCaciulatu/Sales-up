"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import RegistrationEntry from '../components/RegistrationEntry';
import Game from '../components/Game/Game';
import { useTranslation } from '../context/useTranslation';
import type { Session } from '@supabase/supabase-js';

const GamePage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) router.push('/');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push('/');
    });
    return () => listener?.subscription.unsubscribe();
  }, [router]);

  if (loading) return <div>{t('loading')}...</div>;
  if (!session) return <RegistrationEntry />;

  return (
    <>
      <Game />
    </>
  );
};

export default GamePage;
