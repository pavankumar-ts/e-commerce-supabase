import React from 'react';
import Image from 'next/image';
import { BsArrowRight } from "react-icons/bs";

const Hero = () => {
    return (
        <div className="container flex flex-col md:flex-row items-center">
            {/* Product Images */}
            <div className="md:w-2/3 h-[90vh] mb-8 md:mb-0">
                <Image
                    src="/assets/hero-banner.avif"
                    alt="Minimalist Skincare Products"
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                    loading='eager'
                />
            </div>

            {/* Text Content */}
            <div className="md:w-1/3 md:pl-12">
                <h2 className="text-sm uppercase tracking-wide text-gray-600 mb-2">Build Your</h2>
                <h1 className="text-4xl md:text-4xl  font-thin text-gray-900 mb-4">
                    Personalized Skincare Routine
                </h1>
                <p className="text-xsm text-gray-700 mb-6">
                    Get your personalized routine by just answering a simple 2-minute quiz.
                    Our professionals will review and evaluate your concerns and we will create
                    the most suitable regimen for you.
                </p>
                <button className="group w-[160px] flex items-center justify-center bg-black text-white  py-2 transition duration-300">
                    <span className="">Build Now</span>
                    <BsArrowRight className="w-0 opacity-0 transition-all text-xlg duration-300 ease-in-out group-hover:w-5 group-hover:opacity-100 group-hover:ml-1" />
                </button>
            </div>
        </div>
    );
};

export default Hero;