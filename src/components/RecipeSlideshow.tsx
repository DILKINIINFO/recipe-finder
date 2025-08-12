// src/components/RecipeSlideshow.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Meal } from '../types/recipe';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade'; // CSS for the fade effect

// Import required Swiper modules
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';

interface RecipeSlideshowProps {
  recipes: Meal[];
}

const RecipeSlideshow: React.FC<RecipeSlideshowProps> = ({ recipes }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-xl mb-12">
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade" // Enable the fade transition
        spaceBetween={30}
        slidesPerView={1}
        navigation={true} // Enables Previous/Next arrows
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="mySwiper"
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.idMeal}>
            <Link to={`/recipe/${recipe.idMeal}`}>
              <div className="relative w-full h-72 md:h-96">
                {/* Background Image */}
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                {/* Recipe Title */}
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
                    {recipe.strMeal}
                  </h2>
                  <p className="text-amber-300 text-lg">{recipe.strArea}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecipeSlideshow;