import { useContext, useEffect, useState } from 'react';
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

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [bottomOffset, setBottomOffset] = useState(0);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  useEffect(() => {
    const handleResize = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      const keyboardHeight = window.innerHeight - vh;

      // Отступ 3 мм (~11 px)
      const offset = keyboardHeight > 0 ? 11 : 0;

      setViewportHeight(vh);
      setBottomOffset(offset);
    };

    handleResize();
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        height: `${viewportHeight}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: `${bottomOffset}px`,
        backgroundColor: '#0b1120',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
      }}
    >
      <div className="card bg-[#24304a] p-6 rounded-2xl shadow-md transform scale-[0.95] transition-transform duration-300 ease-out">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
          Вход
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              {...register('email')}
              className="mt-1 w-full bg-[#1a2338] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Пароль</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full bg-[#1a2338] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
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
