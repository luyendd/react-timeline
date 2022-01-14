import styles from 'styles/Header.module.css';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const darkDefault = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window?.matchMedia('(prefers-color-scheme: dark)').matches,
    []
  );
  return (
    <header>
      <input
        className={styles.toggleThemeInput}
        type='checkbox'
        id='toggleThemeInput'
        checked={theme !== 'system' ? theme === 'light' : !darkDefault}
        readOnly
      />

      <label
        className={`${styles.btnToggle} bg-gray-300 dark:bg-gray-900`}
        id='btnToggle'
        htmlFor='toggleThemeInput'
        onClick={() =>
          setTheme(
            theme === 'system'
              ? darkDefault
                ? 'light'
                : 'dark'
              : theme === 'dark'
              ? 'light'
              : 'dark'
          )
        }
      >
        <div className={styles.knob} id='knob'></div>
        <div className={styles.lightMode}>Light</div>
        <div className={styles.darkMode}>
          {theme === 'system' && !darkDefault ? 'Dark' : `eh? alright`}
        </div>
      </label>
    </header>
  );
};
export default Header;
