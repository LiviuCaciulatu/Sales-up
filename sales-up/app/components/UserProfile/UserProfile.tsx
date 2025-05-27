"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/context/useTranslation';
import { supabase } from '@/utils/supabaseClient';
import style from '../Start/style.module.scss';

// Supabase Auth user (from supabase.auth.getUser())
interface AuthUser {
  id: string;
  email: string;
  // ...other fields if needed
}

// users table
interface UserProfileData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  date_of_birth: string | null;
  country: string;
  company?: string | null;
  email: string;
}

// Structure of a single answered question in game_summary
interface UserAnswer {
  slideId: number;
  question: string;
  selectedAnswer: string;
  category: string;
  points: number;
}

// user_sessions table
interface UserSession {
  id: number;
  user_id: string;
  date: string;
  duration: number | null;
  score: {
    greeting: number;
    proposal: number;
    closing: number;
    csus: number;
    calificare: number;
    total: number;
  };
  rating: string;
  sales_made: number | null;
  game_summary: UserAnswer[];
}

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user as AuthUser);
      if (user) {
        const { data: profileData, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, username, date_of_birth, country, company, email')
          .eq('email', user.email)
          .limit(1)
          .single();
        if (error) {
          console.error('Supabase error:', error);
        }
        setProfile(profileData as UserProfileData);
        if (profileData) {
          // Fetch user sessions (user_id is uuid, so use user.id from auth)
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
          if (sessionsError) {
            console.error('Supabase sessions error:', sessionsError);
          }
          setSessions((sessionsData || []) as UserSession[]);
        }
      }
    };
    fetchUserAndProfile();
  }, []);

  return (
    <div className={style.container}>
      <button className={style.btn} onClick={() => router.push('/menu')}>{t('back_to_menu')}</button>
      <h1 className={style.title}>{t('user_profile')}</h1>
      {user && (
        <div style={{ marginBottom: 24 }}>
          {profile && (
            <>
              <p><strong>{t('full_name')}:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>{t('username')}:</strong> {profile.username}</p>
              <p><strong>{t('age')}:</strong> {profile.date_of_birth ? Math.floor((new Date().getTime() - new Date(profile.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : '-'}</p>
              <p><strong>{t('country')}:</strong> {profile.country}</p>
              {profile.company && (
                <p><strong>{t('company')}:</strong> {profile.company}</p>
              )}
              <p><strong>{t('email')}:</strong> {profile.email}</p>
            </>
          )}
        </div>
      )}
      {sessions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2>{t('session_history') || 'Session History'}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {sessions.map((session) => (
              <li key={session.id} style={{ marginBottom: 8 }}>
                <button
                  className={style.btn}
                  onClick={() => setSelectedSession(session)}
                >
                  {new Date(session.date).toLocaleString()}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 24,
            minWidth: 320,
            maxWidth: 800,
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            zIndex: 1001
          }}>
            <h3>{t('session_details') || 'Session Details'} ({new Date(selectedSession.date).toLocaleString()})</h3>
            <p><strong>{t('duration') || 'Duration'}:</strong> {selectedSession.duration ? `${Math.floor(selectedSession.duration / 60)}:${(selectedSession.duration % 60).toString().padStart(2, '0')}` : '-'}</p>
            <p><strong>{t('score') || 'Score'}:</strong> {selectedSession.score ? selectedSession.score.total : '-'}</p>
            <p><strong>{t('rating') || 'Rating'}:</strong> {selectedSession.rating || '-'}</p>
            <h4 style={{ marginTop: 16 }}>{t('answered_questions') || 'Answered Questions'}:</h4>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('slide')}</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('question')}</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('answer')}</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('category')}</th>
                  <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('points')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedSession.game_summary) && selectedSession.game_summary.map((ua) => (
                  <tr key={ua.slideId}>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.slideId}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.question}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.selectedAnswer}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.category}</td>
                    <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={style.btn} style={{ marginTop: 16 }} onClick={() => setSelectedSession(null)}>
              {t('close') || 'Close'}
            </button>
          </div>
          {/* Blur background */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            pointerEvents: 'none',
          }} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
