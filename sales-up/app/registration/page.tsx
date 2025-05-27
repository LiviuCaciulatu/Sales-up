"use client";

import React from "react";
import RegistrationEntry from "../components/RegistrationEntry";
import LanguageSelector from "../components/LanguageSelector";

const RegistrationPage = () => (
  <>
    <LanguageSelector />
    <RegistrationEntry />
  </>
);

export default RegistrationPage;
