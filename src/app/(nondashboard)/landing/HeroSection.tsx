"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Plataform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center text-center"
      >
        <div className="mx-auto max-w-4xl px-16 sm:px-12">
          <h1 className="mb:4 text-5xl font-bold text-white">
            Start your journey to find the perfect place to call home
          </h1>
          <p className="mb-8 text-xl text-white">
            Explore our wide range of rental properties to fit your lifestyle
            and needs!
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              value="search query"
              onChange={() => {}}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
            />
            <Button
              onClick={() => {}}
              className="bg-secondary-500 hover:bg-secondary-600 h-12 rounded-none rounded-r-xl border-none text-white"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
