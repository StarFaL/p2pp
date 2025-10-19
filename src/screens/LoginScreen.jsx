import { useContext, useEffect, useRef } from 'react';
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
    resolver: yupResolver(schema)
  });

  const containerRef = useRef(null);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  // Настройка высоты и отступа 3 мм от клавиатуры
  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        const keyboardPaddingPx = 11; // 3 мм ≈ 11 пикселей
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        containerRef.current.style.height = `${viewportHeight}px`;
        containerRef.current.style.paddingBottom = `${keyboardPaddingPx}px`;
      }
    };
    window.visualViewport?.addEventListener('resize', resizeHandler);
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => {
      window.visualViewport?.removeEventListener('resize', resizeHandler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#0b1120] text-white flex justify-center items-center p-4 overscroll-none overflow-hidden"
    >
      <div className="w-full max-w-md bg-[#1a2338] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Вход</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              {...register('email')}
              className="mt-1 w-full bg-[#24304a] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full bg-[#24304a] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите пароль"
            />
            <ErrorMessage message={errors.password?.message} />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-4 rounded-2xl font-bold text-white text-base"
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