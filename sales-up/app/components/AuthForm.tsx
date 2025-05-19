'use client';

import React from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
  error?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonText: string;
  renderFields: () => React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, error, onSubmit, buttonText, renderFields }) => {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={onSubmit}>
        {renderFields()}
        {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', marginTop: 12 }}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
