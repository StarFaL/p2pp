import { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../contexts/AppContext';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create offer' });
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0b1120] to-[#151b2c] text-white overflow-auto flex flex-col p-4">
      
      {/* Контент */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-md sm:max-w-sm mt-6 sm:mt-0">
          <h1 className="text-xl font-semibold text-center mb-6 tracking-wide">
            Create Offer
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#1a2338] p-5 rounded-2xl shadow-md space-y-4 w-full"
          >
            {/* Sell / Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">You Sell</label>
                <input
                  {...register('sell')}
                  defaultValue="BTC"
                  className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
                />
                <ErrorMessage message={errors.sell?.message} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Currency</label>
                <input
                  {...register('currency')}
                  defaultValue="USD"
                  className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
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
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              />
              <ErrorMessage message={errors.rate?.message} />
            </div>

            {/* Limits */}
            <div>
              <label className="block text-xs font-medium mb-1">Limits</label>
              <input
                {...register('limits')}
                defaultValue="50-1000"
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              />
              <ErrorMessage message={errors.limits?.message} />
            </div>

            {/* Payment Method */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-medium mb-1">Payment Method</label>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-[#24304a] p-3 rounded-xl flex justify-between items-center text-sm text-gray-300 focus:ring-2 focus:ring-[#00a968] outline-none transition"
              >
                <span>{selected}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`absolute w-full bg-[#1a2338] border border-gray-700 mt-1 rounded-xl overflow-hidden transition-all duration-300 z-10 ${
                  open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
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

            {/* Comments */}
            <div>
              <label className="block text-xs font-medium mb-1">Comments</label>
              <textarea
                {...register('comments')}
                className="w-full bg-[#24304a] p-3 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#00a968] outline-none transition resize-none"
                rows="4"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#00a968] hover:bg-[#00c67a] transition py-3 rounded-xl font-bold text-sm active:scale-[0.98]"
            >
              Create
            </button>
          </form>
        </div>
      </div>

      {/* Нижняя навигация */}
      <div className="mt-4">
        <BottomNav />
      </div>
    </div>
  );
}
