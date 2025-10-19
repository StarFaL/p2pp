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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  // Обновление высоты клавиатуры
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const newKeyboardHeight = Math.max(0, windowHeight - viewportHeight);
      if (newKeyboardHeight > 50 && !isExpanded) {
        setIsExpanded(true); // Фиксируем увеличение при первом открытии
      }
      setKeyboardHeight(newKeyboardHeight);
    };

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, [isExpanded]);

  // Скролл к инпуту при фокусе
  useEffect(() => {
    if (!containerRef.current) return;

    const inputs = containerRef.current.querySelectorAll('input, textarea');
    const focusHandler = (e) => {
      if (!hasFocused) {
        setTimeout(() => {
          const input = e.target;
          const rect = input.getBoundingClientRect();
          const minOffsetFromTop = 150;
          const offset = Math.max(minOffsetFromTop, keyboardHeight + 20);
          const scrollY = window.scrollY + rect.top - (window.visualViewport?.height || window.innerHeight) * 0.4 + offset;
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
          setHasFocused(true); // Устанавливаем флаг после первого фокуса
        }, 250);
      }
    };

    inputs.forEach(input => input.addEventListener('focus', focusHandler));
    return () => inputs.forEach(input => input.removeEventListener('focus', focusHandler));
  }, [keyboardHeight, hasFocused]);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      if (!window.Telegram.WebApp.isExpanded) {
        window.Telegram.WebApp.expand();
      }
      window.Telegram.WebApp.disableVerticalSwipes();
      if (window.Telegram.WebApp.setViewportStableHeight) {
        window.Telegram.WebApp.setViewportStableHeight();
      }

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
      style={{ position: 'relative', height: '100vh' }}
      className="w-full bg-[#0b1120] text-white flex items-center justify-center p-4 overflow-hidden"
    >
      <div
        style={{
          position: isExpanded ? 'fixed' : 'relative',
          bottom: isExpanded ? `${Math.max(20, keyboardHeight + 20)}px` : 'auto',
          maxHeight: isExpanded ? `calc(100vh - ${Math.max(60, keyboardHeight + 20)}px)` : 'auto',
          width: '100%',
          maxWidth: 'sm:max-w-sm',
          transition: 'bottom 0.5s ease',
        }}
        className="bg-[#24304a] p-6 rounded-2xl shadow-md"
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