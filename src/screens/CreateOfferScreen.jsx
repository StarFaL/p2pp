import { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Select payment');
  const dropdownRef = useRef(null);

  const paymentMethods = ['PayPal', 'Bank'];

  // закрытие при клике вне
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
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create offer' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white flex flex-col items-center p-6 pb-24">
      <div className="w-full max-w-sm">

        {/* Заголовок по центру */}
        <div className="flex items-center justify-center mb-6 relative">
          
        
          <h1 className="text-lg font-bold text-center">Create Offer</h1>
        </div>

        {/* Форма */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#1a2338] p-6 rounded-2xl shadow-md space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">You Sell</label>
              <input
                {...register('sell')}
                defaultValue="BTC"
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              />
              <ErrorMessage message={errors.sell?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">&nbsp;</label>
              <input
                {...register('currency')}
                defaultValue="USD"
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              />
              <ErrorMessage message={errors.currency?.message} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Exchange Rate</label>
            <input
              {...register('rate')}
              defaultValue="36782.32"
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
            />
            <ErrorMessage message={errors.rate?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Limits</label>
            <input
              {...register('limits')}
              defaultValue="50-1000"
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm  placeholder-[#24304a] focus:ring-2 focus:ring-[#00a968] outline-none transition"
            />
            <ErrorMessage message={errors.limits?.message} />
          </div>

          {/* Payment Method выпадающий */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full bg-[#24304a] p-3 rounded-xl text-left flex justify-between items-center text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
            >
              <span>{selected}</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`absolute w-full bg-[#1a2338] border border-gray-700  mt-1 rounded-xl overflow-hidden transition-all duration-300 z-10 ${
                open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  onClick={() => handleSelect(method)}
                  className="px-4 py-3 hover:bg-[#24304a] hover:text-[#00a968] cursor-pointer text-sm"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
          <ErrorMessage message={errors.paymentMethod?.message} />

          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              {...register('comments')}
              className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              rows="4"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-3 rounded-xl font-bold text-sm"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
