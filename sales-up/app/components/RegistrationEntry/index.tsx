"use client";

import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import style from "./style.module.scss";
import { useTranslation } from '../../context/useTranslation';

const RegistrationEntry = () => {
  const [showForm, setShowForm] = useState<"login" | "register" | null>(null);
  const { t } = useTranslation();

  if (!showForm) {
    return (
      <div className={style.container}>
        <h2 className={style.title}>{t('welcome')}</h2>
        <button className={style.btn} onClick={() => setShowForm("login")}> 
          {t('login')}
        </button>
        <button className={style.btn} onClick={() => setShowForm("register")}> 
          {t('register')}
        </button>
      </div>
    );
  }

  if (showForm === "login") return <Login />;
  if (showForm === "register") return <Register />;
};

export default RegistrationEntry;
