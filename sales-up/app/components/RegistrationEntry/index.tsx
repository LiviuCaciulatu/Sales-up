"use client";

import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import style from "./style.module.scss";

const RegistrationEntry = () => {
  const [showForm, setShowForm] = useState<"login" | "register" | null>(null);

  if (!showForm) {
    return (
      <div className={style.container}>
        <h2 className={style.title}>Bine ai venit!</h2>
        <button className={style.btn} onClick={() => setShowForm("login")}>
          Login
        </button>
        <button className={style.btn} onClick={() => setShowForm("register")}>
          Register
        </button>
      </div>
    );
  }

  if (showForm === "login") return <Login />;
  if (showForm === "register") return <Register />;
};

export default RegistrationEntry;
