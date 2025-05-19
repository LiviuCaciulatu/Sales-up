"use client";

import React, { useState } from "react";
import { supabase } from '../../../../utils/supabaseClient';
import AuthForm from '../../AuthForm';
import style from './style.module.scss';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Register user with Supabase Auth (only email and password)
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
    window.location.href = '/menu';
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Register</h2>
      <AuthForm
        mode="register"
        error={error}
        onSubmit={handleSubmit}
        buttonText="Register"
        renderFields={() => (
          <>
            <input className={style.input} name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
            <input className={style.input} name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
            <input className={style.input} name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input className={style.input} name="date_of_birth" type="date" placeholder="Date of Birth" value={form.date_of_birth} onChange={handleChange} required />
            <input className={style.input} name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
            <input className={style.input} name="company" placeholder="Company (optional)" value={form.company} onChange={handleChange} />
            <input className={style.input} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className={style.input} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </>
        )}
      />
      {error && <div className={style.error}>{error}</div>}
    </div>
  );
};

export default Register;
