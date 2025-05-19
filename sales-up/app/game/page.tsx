"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import RegistrationEntry from '../components/RegistrationEntry';
import Game from '../components/Game/Game';
import type { Session } from '@supabase/supabase-js';

const GamePage = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      // If not logged in, redirect to registration page instead of homepage
      if (!session) router.push('/registration');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push('/registration');
    });
    return () => listener?.subscription.unsubscribe();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!session) return <RegistrationEntry />;

  return <Game />;
};

export default GamePage;
