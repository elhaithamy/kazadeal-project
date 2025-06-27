
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const retailers = [
  {
    name: 'Carrefour Egypt',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Carrefour_logo.svg/200px-Carrefour_logo.svg.png',
    offerDate: '25 Apr 2025'
  },
  {
    name: 'Beit El Gomla',
    logo: 'https://pbs.twimg.com/profile_images/1364549142055309315/4mTBrKdz_400x400.jpg',
    offerDate: '30 Apr 2025'
  },
  {
    name: 'Spinneys',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Spinneys_logo.svg/200px-Spinneys_logo.svg.png',
    offerDate: '22 Apr 2025'
  },
  {
    name: 'Panda',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Panda_Retail_Company_logo.svg/200px-Panda_Retail_Company_logo.svg.png',
    offerDate: '28 Apr 2025'
  },
  {
    name: 'Fathallah Market',
    logo: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=FM',
    offerDate: '23 Apr 2025'
  },
  {
    name: 'Zahran Market',
    logo: 'https://via.placeholder.com/100x100/FF5722/FFFFFF?text=ZM',
    offerDate: '21 Apr 2025'
  }
];

const Header = () => {
  const [colorTheme, setColorTheme] = useState<'soft-blue' | 'navy-sky' | 'warm-green' | 'purple-lavender' | 'coral-orange'>('soft-blue');

  // Color theme configurations
  const themes = {
    'soft-blue': {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'bg-cyan-50',
      accent: 'bg-blue-100',
      text: 'text-blue-700',
      logo: 'from-blue-500 to-cyan-400',
      buttonBg: 'bg-blue-500',
      buttonText: 'text-blue-500',
      buttonBorder: 'border-blue-500'
    },
    'navy-sky': {
      primary: 'from-blue-900 to-sky-500',
      secondary: 'bg-blue-50',
      accent: 'bg-sky-100',
      text: 'text-blue-900',
      logo: 'from-blue-900 to-sky-400',
      buttonBg: 'bg-blue-900',
      buttonText: 'text-blue-900',
      buttonBorder: 'border-blue-900'
    },
    'warm-green': {
      primary: 'from-green-600 to-emerald-500',
      secondary: 'bg-green-50',
      accent: 'bg-emerald-100',
      text: 'text-green-800',
      logo: 'from-green-600 to-emerald-400',
      buttonBg: 'bg-green-600',
      buttonText: 'text-green-600',
      buttonBorder: 'border-green-600'
    },
    'purple-lavender': {
      primary: 'from-purple-600 to-indigo-500',
      secondary: 'bg-purple-50',
      accent: 'bg-indigo-100',
      text: 'text-purple-800',
      logo: 'from-purple-600 to-indigo-400',
      buttonBg: 'bg-purple-600',
      buttonText: 'text-purple-600',
      buttonBorder: 'border-purple-600'
    },
    'coral-orange': {
      primary: 'from-orange-500 to-red-500',
      secondary: 'bg-orange-50',
      accent: 'bg-red-100',
      text: 'text-orange-800',
      logo: 'from-orange-500 to-red-400',
      buttonBg: 'bg-orange-500',
      buttonText: 'text-orange-500',
      buttonBorder: 'border-orange-500'
    }
  };

  const currentTheme = themes[colorTheme];

  return (
    <header className="bg-white font-spacegrotesk text-white">
      {/* Theme Selector for Preview */}
      <div className="flex flex-wrap justify-center gap-2 py-3 bg-gray-100">
        <button 
          onClick={() => setColorTheme('soft-blue')}
          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
            colorTheme === 'soft-blue' 
              ? `${themes['soft-blue'].buttonBg} text-white shadow-md` 
              : `bg-white ${themes['soft-blue'].buttonText} border ${themes['soft-blue'].buttonBorder}`
          }`}
        >
          Soft Blue
        </button>
        <button 
          onClick={() => setColorTheme('navy-sky')}
          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
            colorTheme === 'navy-sky' 
              ? `${themes['navy-sky'].buttonBg} text-white shadow-md` 
              : `bg-white ${themes['navy-sky'].buttonText} border ${themes['navy-sky'].buttonBorder}`
          }`}
        >
          Navy Sky
        </button>
        <button 
          onClick={() => setColorTheme('warm-green')}
          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
            colorTheme === 'warm-green' 
              ? `${themes['warm-green'].buttonBg} text-white shadow-md` 
              : `bg-white ${themes['warm-green'].buttonText} border ${themes['warm-green'].buttonBorder}`
          }`}
        >
          Warm Green
        </button>
        <button 
          onClick={() => setColorTheme('purple-lavender')}
          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
            colorTheme === 'purple-lavender' 
              ? `${themes['purple-lavender'].buttonBg} text-white shadow-md` 
              : `bg-white ${themes['purple-lavender'].buttonText} border ${themes['purple-lavender'].buttonBorder}`
          }`}
        >
          Purple
        </button>
        <button 
          onClick={() => setColorTheme('coral-orange')}
          className={`px-3 py-2 rounded text-xs font-medium transition-all ${
            colorTheme === 'coral-orange' 
              ? `${themes['coral-orange'].buttonBg} text-white shadow-md` 
              : `bg-white ${themes['coral-orange'].buttonText} border ${themes['coral-orange'].buttonBorder}`
          }`}
        >
          Coral Orange
        </button>
      </div>

      <div className={`flex justify-center items-center py-2 bg-gradient-to-tr ${currentTheme.primary}`}>
        <div className="flex items-center gap-2 font-spacegrotesk select-none">
          <span 
            className={`text-4xl drop-shadow-md bg-gradient-to-br ${currentTheme.logo} rounded-full px-2 py-1 animate-bounce`}
            aria-label="Deals Tank Logo"
          >🚀</span>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Deals Tank
          </span>
        </div>
      </div>
      
      <div className={`flex justify-center items-center py-2 ${currentTheme.secondary} ${currentTheme.text} text-center text-base font-bold`}>
        <div className="text-center">
          <div className="text-lg font-black">Savings Tip 💡</div>
          <div className="text-sm opacity-80 mt-1">Real discounts? Yes. Best price? Not always.</div>
        </div>
      </div>

      <div className={`flex overflow-x-auto gap-4 py-2 px-2 bg-white border-b border-gray-100`}>
        {retailers.map((retailer, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-1 text-gray-700 whitespace-nowrap flex-shrink-0 min-w-[72px]"
          >
            <img
              src={retailer.logo}
              alt={retailer.name}
              className={`h-10 w-10 object-contain ${currentTheme.accent} rounded-xl`}
            />
            <span className="text-xs font-semibold">{retailer.name}</span>
            <span className="text-[10px] text-gray-500">{retailer.offerDate}</span>
          </div>
        ))}
      </div>
      <div className={`bg-gradient-to-r ${currentTheme.primary} h-20 flex items-center justify-center rounded-b-2xl shadow-md`}>
        <div className="text-center text-white p-2">
          <h1 className="text-xl font-black font-spacegrotesk">Find the Best Deals ✨</h1>
          <p className="text-sm opacity-90">
            Compare prices across stores & save on every purchase!
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
