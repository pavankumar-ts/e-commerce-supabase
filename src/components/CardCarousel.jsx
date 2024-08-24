import React, { useState, useRef, useEffect } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from 'next/image';

const CardCarousel = ({ products }) => {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setSlidesToShow(1);
      else if (window.innerWidth < 768) setSlidesToShow(2);
      else if (window.innerWidth < 1024) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setProgress((slidesToShow / products.length) * 100);
  }, [slidesToShow, products.length]);

  function renderStars(rating) {
    return Array(5).fill(0).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-300' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const productCarouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    afterChange: (current) => {
      setCurrentSlide(current);
      const newProgress = ((current + slidesToShow) / products.length) * 100;
      setProgress(Math.min(newProgress, 100));
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

  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const isBeginning = currentSlide === 0;
  const isEnd = currentSlide === products.length - slidesToShow;

  return (
    <div className="container relative">
      <Slider ref={sliderRef} {...productCarouselSettings}>
        {products.map((product) => (
          <div key={product.id} className="px-0">
            <div className="p-4 pt-0">
              <div className="relative">
                <Slider {...imageSliderSettings}>
                  {product.images.map((image, index) => (
                    <div key={index} className="relative h-[340px]">
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              <h3 className="text-lg font-semibold mb-1 mt-4">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.brief}</p>
              <div className="flex mb-2">{renderStars(product.review)}</div>
              <div className="flex items-center mb-4">
                <span className="text-lg font-bold mr-2">₹{product.price}</span>
                {product.mrp && product.mrp !== product.price && (
                  <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                )}
              </div>
              <button
                className={`w-full py-2 px-4 ${product.stock > 0
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                disabled={product.stock === 0}
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
  )
}

export default CardCarousel