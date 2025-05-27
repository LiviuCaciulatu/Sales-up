"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabaseClient';
import AuthForm from '../../AuthForm';
import style from './style.module.scss';
import { useTranslation } from '../../../context/useTranslation';

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', form.username)
      .single();
    if (userError || !user?.email) {
      setError('Invalid username or user not found');
      return;
    }
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.password,
    });
    if (loginError) {
      setError(loginError.message);
    } else {
      router.push('/menu');
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>{t('login')}</h2>
      <AuthForm
        error={error}
        onSubmit={handleSubmit}
        buttonText={t('login')}
        renderFields={() => (
          <>
            <input className={style.input} name="username" placeholder={t('username')} value={form.username} onChange={handleChange} required />
            <input className={style.input} name="password" type="password" placeholder={t('password')} value={form.password} onChange={handleChange} required />
          </>
        )}
        formClassName={style.form}
        buttonClassName={style.btn}
      />
      <button className={style.btn} style={{ marginTop: 16 }} onClick={() => router.push('/')}>{t('back')}</button>
      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};

export default Login;
