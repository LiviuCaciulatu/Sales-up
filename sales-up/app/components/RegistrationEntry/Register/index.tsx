"use client";

import React, { useState } from "react";
import { supabase } from '../../../../utils/supabaseClient';
import AuthForm from '../../AuthForm';
import style from './style.module.scss';
import { useTranslation } from '../../../context/useTranslation';

const Register = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    date_of_birth: '',
    country: '',
    company: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Registration failed');
      return;
    }
    // Insert user profile data into the database (order: first_name, last_name, username, date_of_birth, country, company, email)
    const { error: profileError } = await supabase.from('users').insert([
      {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        date_of_birth: form.date_of_birth,
        country: form.country,
        company: form.company || null,
        email: form.email,
      },
    ]);
    if (profileError) {
      setError(profileError.message);
      return;
    }
    window.location.href = '/registration';
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>{t('register')}</h2>
      <AuthForm
        error={error}
        onSubmit={handleSubmit}
        buttonText={t('register')}
        renderFields={() => (
          <>
            <input className={style.input} name="first_name" placeholder={t('first_name')} value={form.first_name} onChange={handleChange} required />
            <input className={style.input} name="last_name" placeholder={t('last_name')} value={form.last_name} onChange={handleChange} required />
            <input className={style.input} name="username" placeholder={t('username')} value={form.username} onChange={handleChange} required />
            <input className={style.input} name="date_of_birth" type="date" placeholder={t('date_of_birth')} value={form.date_of_birth} onChange={handleChange} required />
            <input className={style.input} name="country" placeholder={t('country')} value={form.country} onChange={handleChange} required />
            <input className={style.input} name="company" placeholder={t('company_optional')} value={form.company} onChange={handleChange} />
            <input className={style.input} name="email" type="email" placeholder={t('email')} value={form.email} onChange={handleChange} required />
            <input className={style.input} name="password" type="password" placeholder={t('password')} value={form.password} onChange={handleChange} required />
          </>
        )}
        formClassName={style.form}
        buttonClassName={style.btn}
      />
      <button className={style.btn} style={{ marginTop: 16 }} onClick={() => window.location.href = '/'}>{t('back')}</button>
      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};

export default Register;
