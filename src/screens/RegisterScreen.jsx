import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';

const schema = yup.object({
  username: yup.string().min(3, 'Минимум 3 символа').required('Обязательно'),
  email: yup.string().email('Неверный email').required('Обязательно'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательно'),
});

export default function RegisterScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { username: data.username, email: data.email } });
    navigate('/market');
  };

  // Подстройка высоты под WebView Telegram
  useEffect(() => {
    const resizeHandler = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] flex flex-col items-center justify-center p-4">
      <div className="w-full sm:max-w-sm bg-[#1a2338] p-6 sm:p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">Регистрация</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300">Имя пользователя</label>
            <input
              {...register('username')}
              className="mt-1 w-full bg-[#24304a] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите имя"
            />
            <ErrorMessage message={errors.username?.message} />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300">Email</label>
            <input
              {...register('email')}
              className="mt-1 w-full bg-[#24304a] p-4 rounded-2xl text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              placeholder="Введите email"
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-300">Пароль</label>
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
            Зарегистрироваться
          </button>
        </form>

        <p className="text-center mt-4 text-sm sm:text-base text-gray-400">
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-[#00a968] hover:text-[#00c57a] transition">
            Вход
          </a>
        </p>
      </div>
    </div>
  );
}
