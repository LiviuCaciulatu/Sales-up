import React from "react";
import style from "./style.module.scss";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/context/useTranslation";
import { supabase } from '@/utils/supabaseClient';

const Start = ({ onStart }: { onStart: () => void }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>{t('sales_up')}</h1>
      <button
        className={style.btn}
        onClick={() => {
          onStart();
          router.push("/game");
        }}
      >
        {t('start_game')}
      </button>
      <button
        className={style.btn}
        style={{ marginTop: 16 }}
        onClick={() => router.push('/userProfile')}
      >
        {t('user_profile')}
      </button>
      <button
        className={style.btn}
        style={{ marginTop: 16 }}
        onClick={handleLogout}
      >
        {t('logout')}
      </button>
    </div>
  );
};

export default Start;
