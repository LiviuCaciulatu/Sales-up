'use client';

import React from 'react';
import Start from './components/Start/Start';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleStart = () => {
    router.push('/game');
  };
  return (
    <>
      <Start onStart={handleStart} />
      <a href="/all-questions" style={{ display: 'none' }}>All Questions</a>
    </>
  );
}
