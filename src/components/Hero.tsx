import React from 'react';
import { Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 lg:pt-40 pb-8 px-4 lg:px-8">
      <div className="text-center mb-8 lg:mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-orange-500 mr-2" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 font-serif">
            Discover Heritage
          </h2>
        </div>
        <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
          Explore the rich cultural tapestry of Chhattisgarh through historical landmarks, 
          vibrant celebrations, and stories that shaped our heritage.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 lg:p-12 text-white text-center shadow-xl max-w-4xl mx-auto">
        <h3 className="text-2xl lg:text-3xl font-bold mb-2 font-serif">Featured This Week</h3>
        <p className="text-orange-100 mb-6 lg:text-lg">Bhilai Steel Plant Heritage Walk</p>
        <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg text-lg">
          Learn More
        </button>
      </div>
    </section>
  );
};

export default Hero;