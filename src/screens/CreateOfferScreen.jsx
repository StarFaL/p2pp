import { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import BottomNav from '../components/BottomNav';

const schema = yup.object({
  sell: yup.string().required(),
  currency: yup.string().required(),
  rate: yup.number().positive().required(),
  limits: yup.string().required(),
  paymentMethod: yup.string().required(),
  comments: yup.string(),
});

export default function CreateOfferScreen() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Select payment');
  const dropdownRef = useRef(null);
  const paymentMethods = ['PayPal', 'Bank'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (method) => {
    setSelected(method);
    setValue('paymentMethod', method);
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/offers', data);
      dispatch({ type: 'SET_OFFERS', payload: [...state.offers, response.data] });
      navigate('/market');
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create offer' });
    }
  };

  // Автоскролл к полю ввода
  useEffect(() => {
    const handleFocus = (e) => {
      setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    };
    const inputs = containerRef.current.querySelectorAll('input, textarea');
    inputs.forEach(input => input.addEventListener('focus', handleFocus));
    return () => inputs.forEach(input => input.removeEventListener('focus', handleFocus));
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) containerRef.current.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inset-0 bg-gradient-to-b from-[#0b1120] to-[#151b2c] overflow-auto flex flex-col items-center justify-start p-4"
    >
      <div className="w-full sm:max-w-sm bg-[#1a2338] p-5 rounded-2xl shadow-md flex-shrink-0">

        <h1 className="text-xl font-semibold text-center mb-6 tracking-wide text-white">Create Offer</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sell / Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">You Sell</label>
              <input
                {...register('sell')}
                defaultValue="BTC"
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition"
              />
              <ErrorMessage message={errors.sell?.message} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Currency</label>
              <input
                {...register('currency')}
                defaultValue="USD"
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition"
              />
              <ErrorMessage message={errors.currency?.message} />
            </div>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-xs font-medium mb-1">Exchange Rate</label>
            <input
              {...register('rate')}
              defaultValue="36782.32"
              inputMode="decimal"
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition"
            />
            <ErrorMessage message={errors.rate?.message} />
          </div>

          {/* Limits */}
          <div>
            <label className="block text-xs font-medium mb-1">Limits</label>
            <input
              {...register('limits')}
              defaultValue="50-1000"
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition"
            />
            <ErrorMessage message={errors.limits?.message} />
          </div>

          {/* Payment Method */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-medium mb-1">Payment Method</label>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full bg-[#24304a] p-3 rounded-xl flex justify-between items-center text-sm text-gray-300 focus:ring-2 focus:ring-accent outline-none transition"
            >
              <span>{selected}</span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <div className={`absolute w-full bg-[#1a2338] border border-gray-700 mt-1 rounded-xl overflow-hidden transition-all duration-300 z-10 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  onClick={() => handleSelect(method)}
                  className="px-4 py-3 hover:bg-[#24304a] hover:text-accent cursor-pointer text-sm"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
          <ErrorMessage message={errors.paymentMethod?.message} />

          {/* Comments */}
          <div>
            <label className="block text-xs font-medium mb-1">Comments</label>
            <textarea
              {...register('comments')}
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-accent outline-none transition resize-none"
              rows="4"
            />
          </div>

          <button type="submit" className="w-full bg-accent hover:bg-green-600 transition py-3 rounded-xl font-bold text-sm text-white active:scale-[0.98]">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
