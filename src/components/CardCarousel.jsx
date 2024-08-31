import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';
import { CartItemSContext } from '@/Context';
import { formatToIndianCurrency } from '@/utils/formatUtils';
import renderStars from './common/renderStars';

const CardCarousel = ({ products }) => {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const { addToCart } = useContext(CartItemSContext);

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 480) setSlidesToShow(1);
      else if (window.innerWidth < 768) setSlidesToShow(2);
      else if (window.innerWidth < 1024) setSlidesToShow(3);
      else setSlidesToShow(4);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    setProgress((currentSlide + slidesToShow) / products.length * 100);
  }, [currentSlide, slidesToShow, products.length]);

  const productCarouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    afterChange: (current) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const imageSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: dots => (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          padding: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  const handlePrev = useCallback(() => {
    sliderRef.current?.slickPrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.slickNext();
  }, []);

  const isBeginning = currentSlide === 0;
  const isEnd = currentSlide === products.length - slidesToShow;

  const memoizedHandleAddCard = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...productCarouselSettings}>
        {products.map((product) => (
          <div key={product.id} className="px-0">
            <div className="p-4 pt-0">
              <div className="relative">
                <Slider {...imageSliderSettings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="relative h-[340px] overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="hover:scale-110 transition-all duration-700 ease-in-out"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              <h3 className="text-lg font-semibold mb-1 mt-4">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.brief}</p>
              <div className="flex mb-2">{renderStars(product.review)}</div>
              <div className="flex items-center mb-4">
                <span className="text-lg font-bold mr-2">{formatToIndianCurrency(product.price)}</span>
                {product.mrp && product.mrp !== product.price && (
                  <span className="text-sm text-gray-500 line-through">{formatToIndianCurrency(product.mrp)}</span>
                )}
              </div>
              <button
                className={`w-full py-2 px-4 ${product.stock > 0
                  ? 'bg-black text-white'
                  : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                disabled={product.stock === 0}
                onClick={() => memoizedHandleAddCard(product)}
              >
                {product.stock > 0 ? 'Add to cart' : 'Sold out'}
              </button>
            </div>
          </div>
        ))}
      </Slider>
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={handlePrev}
          className={`mr-4 ${isBeginning ? 'text-gray-300 cursor-not-allowed' : 'text-black'}`}
          disabled={isBeginning}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300 ease-in-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button
          onClick={handleNext}
          className={`ml-4 ${isEnd ? 'text-gray-300 cursor-not-allowed' : 'text-black'}`}
          disabled={isEnd}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CardCarousel;