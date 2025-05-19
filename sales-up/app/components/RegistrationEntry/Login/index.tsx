"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabaseClient';
import AuthForm from '../../AuthForm';
import style from './style.module.scss';

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // 1. Look up the email for the given username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', form.username)
      .single();
    if (userError || !user?.email) {
      setError('Invalid username or user not found');
      return;
    }
    // 2. Use the found email to sign in
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
      <h2 className={style.title}>Login</h2>
      <AuthForm
        mode="login"
        error={error}
        onSubmit={handleSubmit}
        buttonText="Login"
        renderFields={() => (
          <>
            <input className={style.input} name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input className={style.input} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </>
        )}
      />
      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};

export default Login;
