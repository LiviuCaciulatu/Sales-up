"use client";

import React from "react";

interface AuthFormProps {
  error?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonText: string;
  renderFields: () => React.ReactNode;
  formClassName?: string;
  buttonClassName?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  error,
  onSubmit,
  buttonText,
  renderFields,
  formClassName,
  buttonClassName,
}) => {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <form onSubmit={onSubmit} className={formClassName}>
        {renderFields()}
        {error && (
          <div style={{ color: "red", margin: "8px 0" }}>{error}</div>
        )}
        <button
          type="submit"
          style={{ width: "100%", marginTop: 12 }}
          className={buttonClassName}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
