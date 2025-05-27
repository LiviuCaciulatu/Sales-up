import React, { useState } from 'react';
import styles from './Navigation.module.scss';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/context/useTranslation';
import { supabase } from '@/utils/supabaseClient';

interface NavigationProps {
  goToSlide38: () => void;
  onRestartGame: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ goToSlide38, onRestartGame }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    setOpen(false);
    await supabase.auth.signOut();
    router.push('/registration');
  };

  return (
    <>
      <button
        className={styles.menuButton}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className={styles.hamburger} />
      </button>
      {open && <div className={styles.menuOverlay} onClick={() => setOpen(false)} />}
      <nav className={`${styles.menu} ${open ? styles.menuOpen : ''}`} aria-hidden={!open}>
        <div className={styles.menuHeader}>
          <button
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', fontSize: 28, color: '#1976d2', cursor: 'pointer' }}
            onClick={() => setOpen(false)}
            type="button"
          >
            &times;
          </button>
        </div>
        <div className={styles.menuButtonList}>
          <button className={styles.menuBtn} onClick={() => { setOpen(false); goToSlide38(); }}>
            {t('end_game')}
          </button>
          <button className={styles.menuBtn} onClick={() => { setOpen(false); onRestartGame(); }}>
            {t('restart_game')}
          </button>
          <button className={styles.menuBtn} onClick={() => { setOpen(false); router.push('/menu'); }}>
            {t('menu')}
          </button>
          <button className={styles.menuBtn} onClick={() => { setOpen(false); router.push('/userProfile'); }}>
            {t('profile')}
          </button>
          <button className={styles.menuBtn} onClick={handleLogout}>
            {t('logout')}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
