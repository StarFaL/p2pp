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
    resolver: yupResolver(schema),
  });

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  useEffect(() => {
    // Следим за изменением визуального viewport (при открытии клавиатуры)
    const handleResize = () => {
      const visualHeight = window.visualViewport?.height || window.innerHeight;
      const diff = window.innerHeight - visualHeight;

      // если клавиатура реально открыта (разница больше 150px)
      if (diff > 150) {
        setKeyboardVisible(true);
        setViewportHeight(visualHeight);
      } else {
        setKeyboardVisible(false);
        setViewportHeight(window.innerHeight);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        height: `${viewportHeight}px`,
        width: '100%',
        backgroundColor: '#0b1120',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: keyboardVisible ? 'flex-end' : 'center',
        paddingBottom: keyboardVisible ? '3mm' : 0, // 🔹 отступ 3 мм от клавиатуры
        transition: 'all 0.2s ease-in-out',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      <div
        className="w-[88%] max-w-sm bg-[#24304a] p-6 rounded-2xl shadow-md"
        style={{
          transform: keyboardVisible ? 'scale(0.95)' : 'scale(0.96)',
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">Вход</h1>

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
