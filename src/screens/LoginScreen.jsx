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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  // Обновление высоты клавиатуры с увеличенным debounce
  useEffect(() => {
    let timeoutId;
    const updateHeight = () => {
      clearTimeout(timeoutId);
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const newKeyboardHeight = Math.max(0, windowHeight - viewportHeight);
      setIsKeyboardOpen(newKeyboardHeight > 50);
      // Обновляем только при значительных изменениях с увеличенным порогом
      if (Math.abs(newKeyboardHeight - keyboardHeight) > 30) {
        timeoutId = setTimeout(() => setKeyboardHeight(newKeyboardHeight), 200);
      }
    };

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timeoutId);
    };
  }, [keyboardHeight]);

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
          position: isKeyboardOpen ? 'absolute' : 'relative',
          bottom: isKeyboardOpen ? `${Math.max(0, keyboardHeight + 18.9 * (window.devicePixelRatio || 1))}px` : 'auto', // 0.5 см
          maxHeight: isKeyboardOpen ? `calc(100vh - ${Math.max(0, keyboardHeight + 18.9 * (window.devicePixelRatio || 1))}px)` : 'auto',
          width: '100%',
          maxWidth: 'sm:max-w-sm', // Оставляем адаптивность
          transition: 'bottom 0.8s ease', // Увеличенная задержка для сглаживания
        }}
        className="bg-[#24304a] p-4 rounded-2xl shadow-md" // Уменьшен p-6 до p-4
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Вход</h1> {/* Уменьшен размер и отступ */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> {/* Уменьшен space-y-6 до space-y-4 */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              name="email"
              {...register('email')}
              className="mt-1 w-full bg-[#1a2338] p-2 rounded-xl text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition" // Уменьшен p-3 до p-2, text-base до text-sm
              placeholder="Введите email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              name="password"
              type="password"
              {...register('password')}
              className="mt-1 w-full bg-[#1a2338] p-2 rounded-xl text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition" // Уменьшен p-3 до p-2, text-base до text-sm
              placeholder="Введите пароль"
            />
            <ErrorMessage message={errors.password?.message} />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-2 rounded-xl font-semibold text-sm text-white" // Уменьшен py-3 до py-2, text-base до text-sm
          >
            Войти
          </button>
        </form>

        <p className="text-center mt-3 text-xs text-gray-400"> {/* Уменьшен mt-4 до mt-3, text-sm до text-xs */}
          Нет аккаунта?{' '}
          <a
            href="/register"
            className="text-[#00a968] hover:text-[#00c57a] transition inline-block"
          >
            Регистрация
          </a>
        </p>
      </div>
    </div>
  );
}