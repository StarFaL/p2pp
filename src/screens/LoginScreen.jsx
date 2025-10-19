import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';

const schema = yup.object({
  email: yup.string().email('Неверный email').required('Обязательно'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательно'),
});

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const containerRef = useRef(null);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  // Динамическая высота с использованием visualViewport
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      setScreenHeight(newHeight);
    };

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Скролл к инпуту при фокусе
  useEffect(() => {
    if (!containerRef.current) return;

    const inputs = containerRef.current.querySelectorAll('input, textarea');
    const focusHandler = (e) => {
      setTimeout(() => {
        const input = e.target;
        const rect = input.getBoundingClientRect();
        const keyboardHeight = window.innerHeight - (window.visualViewport?.height || window.innerHeight);
        const offset = Math.max(100, keyboardHeight + 20);
        const scrollY = window.scrollY + rect.top - (window.visualViewport?.height || window.innerHeight) + offset;
        window.scrollTo({ top: scrollY, behavior: 'smooth' });
      }, 150);
    };

    inputs.forEach(input => input.addEventListener('focus', focusHandler));
    return () => inputs.forEach(input => input.removeEventListener('focus', focusHandler));
  }, []);

  // Инициализация Telegram WebApp: расширение на весь экран
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      // Уведомляем, что приложение готово (убирает плейсхолдер)
      window.Telegram.WebApp.ready();

      // Расширяем до максимальной высоты, если не расширено
      if (!window.Telegram.WebApp.isExpanded) {
        window.Telegram.WebApp.expand();
      }

      // Отключаем вертикальные свайпы для предотвращения сжатия
      window.Telegram.WebApp.disableVerticalSwipes();

      // Стабилизируем высоту viewport
      if (window.Telegram.WebApp.setViewportStableHeight) {
        window.Telegram.WebApp.setViewportStableHeight();
      }

      // Добавляем слушатель события viewportChanged
      window.Telegram.WebApp.onEvent('viewportChanged', (event) => {
        if (event.isStateStable) {
          console.log('Расширение завершено, стабильная высота:', window.Telegram.WebApp.viewportStableHeight);
        }
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: `${screenHeight}px`, position: 'relative' }}
      className="w-full bg-[#0b1120] text-white flex flex-col items-center justify-end p-4"
    >
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          maxHeight: `calc(${screenHeight}px - 60px)`,
          overflowY: 'auto',
        }}
        className="w-full sm:max-w-sm bg-[#24304a] p-6 rounded-2xl shadow-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Вход</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              {...register('email')}
              className="mt-1 w-full bg-[#1a2338] p-3 rounded-xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full bg-[#1a2338] p-3 rounded-xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите пароль"
            />
            <ErrorMessage message={errors.password?.message} />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-3 rounded-xl font-bold text-white text-base"
          >
            Войти
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          Нет аккаунта?{' '}
          <a
            href="/register"
            className="text-[#00a968] hover:text-[#00c57a] transition inline-block mt-1"
          >
            Регистрация
          </a>
        </p>
      </div>
    </div>
  );
}