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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedField(e.target.name);
  };

  const handleBlur = () => {
    setFocusedField(null);
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
    // Registration successful, prompt user to log in
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
            {/* First Name */}
            {focusedField === 'first_name' && (
              <label className={style.label} htmlFor="first_name">{t('first_name')}</label>
            )}
            <input
              className={style.input}
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'first_name' ? t('first_name') : ''}
            />
            {/* Last Name */}
            {focusedField === 'last_name' && (
              <label className={style.label} htmlFor="last_name">{t('last_name')}</label>
            )}
            <input
              className={style.input}
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'last_name' ? t('last_name') : ''}
            />
            {/* Username */}
            {focusedField === 'username' && (
              <label className={style.label} htmlFor="username">{t('username')}</label>
            )}
            <input
              className={style.input}
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'username' ? t('username') : ''}
            />
            {/* Date of Birth */}
            {focusedField === 'date_of_birth' && (
              <label className={style.label} htmlFor="date_of_birth">{t('date_of_birth')}</label>
            )}
            <input
              className={style.input}
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'date_of_birth' ? t('date_of_birth') : ''}
            />
            {/* Country */}
            {focusedField === 'country' && (
              <label className={style.label} htmlFor="country">{t('country')}</label>
            )}
            <input
              className={style.input}
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'country' ? t('country') : ''}
            />
            {/* Company */}
            {focusedField === 'company' && (
              <label className={style.label} htmlFor="company">{t('company_optional')}</label>
            )}
            <input
              className={style.input}
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={focusedField !== 'company' ? t('company_optional') : ''}
            />
            {/* Email */}
            {focusedField === 'email' && (
              <label className={style.label} htmlFor="email">{t('email')}</label>
            )}
            <input
              className={style.input}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'email' ? t('email') : ''}
            />
            {/* Password */}
            {focusedField === 'password' && (
              <label className={style.label} htmlFor="password">{t('password')}</label>
            )}
            <input
              className={style.input}
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              placeholder={focusedField !== 'password' ? t('password') : ''}
            />
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
