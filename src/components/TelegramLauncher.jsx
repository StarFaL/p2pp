import { useEffect } from 'react';

export default function TelegramLauncher() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return null;
}
