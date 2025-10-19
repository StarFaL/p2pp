import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';
import { useEffect, useRef, useState } from 'react';

const schema = yup.object({
  email: yup.string().email('Неверный email').required('Обязательно'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Обязательно'),
});

// Встроенный ScrollContainer
function ScrollContainer({ children, offset = 20 }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current || !cardRef.current) return;
      const cardBottom = cardRef.current.getBoundingClientRect().bottom;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const maxH = cardBottom - containerTop + offset;
      setMaxHeight(`${maxH}px`);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [offset]);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    const onScroll = () => {
      const minScroll = card.offsetTop - offset;
      const maxScroll = card.offsetTop + card.offsetHeight - container.clientHeight + offset;
      if (container.scrollTop < minScroll) container.scrollTop = minScroll;
      if (container.scrollTop > maxScroll) container.scrollTop = maxScroll;
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [offset]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center p-4 bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white overflow-y-auto"
      style={{ maxHeight }}
    >
      <div ref={cardRef} className="w-full sm:max-w-sm mt-6 mb-6 flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

export default function LoginScreen() {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    dispatch({ type: 'LOGIN', payload: { email: data.email } });
    navigate('/market');
  };

  return (
    <ScrollContainer offset={20}>
      <div className="bg-[#1a2338] p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <a href="/register" className="text-[#00a968] hover:text-[#00c57a] transition inline-block mt-1">
            Регистрация
          </a>
        </p>
      </div>
    </ScrollContainer>
  );
}
