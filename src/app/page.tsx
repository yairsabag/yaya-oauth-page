'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const [currentText, setCurrentText] = useState(0);
  const [currentChat, setCurrentChat] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const textOptions = [
    'calendar.',
    'todo list.',
    'reminders.',
    'travel plans.'
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textOptions.length);
    }, 2000);

    const chatInterval = setInterval(() => {
      setCurrentChat((prev) => (prev + 1) % textOptions.length);
    }, 5500);

    return () => {
      clearInterval(heroInterval);
      clearInterval(chatInterval);
    };
  }, [textOptions.length]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 lg:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            Y
          </div>
          <span className="text-2xl lg:text-3xl font-bold text-primary">Yaya</span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden lg:flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-border shadow-sm">
            <span className="text-sm font-medium">Introducing Multi-Calendar Support</span>
            <Image
              src="https://ext.same-assets.com/3449976750/707008856.png"
              alt="Google Calendar"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>
          
          <a
            href="https://wa.me/972559943649"
            className="bg-primary text-white px-4 md:px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm md:text-base"
          >
            Get Started
          </a>
          
          <a
            href="http://app.textcoco.com"
            className="text-primary font-medium hover:text-primary/80 transition-colors text-sm md:text-base"
          >
            Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-8 lg:px-12 lg:py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary mb-4 lg:mb-6 leading-tight">
            Save your time,{' '}
            <span className="font-bold">text your</span>
          </h1>
          
          <div className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary mb-6 lg:mb-8 h-16 lg:h-20 flex items-center justify-center" suppressHydrationWarning>
            <span className="transition-all duration-500 ease-in-out">
              {isClient ? textOptions[currentText] : textOptions[0]}
            </span>
          </div>
          
          <p className="text-base lg:text-lg text-muted mb-6 lg:mb-8 max-w-2xl mx-auto">
            Your executive assistant in{' '}
            <span className="font-bold italic">WhatsApp</span>
          </p>
          
          <div className="flex flex-col items-center space-y-4 lg:space-y-6">
            <a
              href="https://wa.me/972559943649"
              className="text-lg lg:text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              +972 55-994-3649
            </a>
            
            {/* Example conversations */}
            <div className="w-full max-w-sm lg:max-w-md space-y-2 text-sm lg:text-base">
              <div className="bg-secondary/10 rounded-lg p-3 text-left border border-secondary/20">
                Add a 7pm dinner this week with Eva
              </div>
              <div className="bg-secondary/10 rounded-lg p-3 text-left border border-secondary/20">
                Put amazon return on my ToDo
              </div>
              <div className="bg-secondary/10 rounded-lg p-3 text-left border border-secondary/20">
                Remind me about bills every thursday night
              </div>
            </div>
            
            <a
              href="https://wa.me/972559943649"
              className="bg-primary text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full font-medium hover:bg-primary/90 transition-colors text-base lg:text-lg shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* iPhone Mockup Section */}
      <section className="px-4 py-8 lg:px-12
