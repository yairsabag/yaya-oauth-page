'use client'
import React, { useState, useEffect } from 'react'
import { MessageCircle, Check } from 'lucide-react'
import { useRegistration } from '../contexts/RegistrationContext'

// Phone Mockup Component - מותאם למובייל
function PhoneMockup({ messages }: { messages: Array<{ text: string; sender: 'user' | 'yaya'; time?: string }> }) {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < messages.length) {
          return prev + 1
        } else {
          setTimeout(() => setVisibleMessages(0), 3000)
          return prev
        }
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [messages.length, visibleMessages])

  return (
    <div className="w-[280px] h-[420px] mx-auto bg-black rounded-[30px] p-2 shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
      {/* Phone Screen */}
      <div className="w-full h-full bg-[#f0f2f5] rounded-[22px] overflow-hidden relative">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white px-4 py-[15px] flex items-center gap-3">
          <div className="w-[35px] h-[35px] bg-whatsapp rounded-full flex items-center justify-center text-lg font-bold">
            Y
          </div>
          <div>
            <div className="text-base font-medium">Yaya Assistant</div>
            <div className="text-xs opacity-80">online</div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 h-[calc(100%-130px)] overflow-y-auto flex flex-col gap-2">
          {messages.slice(0, visibleMessages).map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-message`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className={`${
                message.sender === 'user' ? 'bg-[#dcf8c6]' : 'bg-white'
              } text-[#333] px-3 py-2 ${
                message.sender === 'user' ? 'rounded-[18px_18px_4px_18px]' : 'rounded-[18px_18px_18px_4px]'
              } max-w-[80%] text-[13px] leading-[1.3] shadow-sm relative break-words whitespace-pre-wrap`}>
                {message.text}
                <div className="text-[11px] text-[#667781] mt-1 text-right flex items-center justify-end gap-0.5">
                  {message.time || '2:47 PM'}
                  {message.sender === 'user' && (
                    <div className="text-[#4fc3f7] flex">
                      <Check size={12} />
                      <Check size={12} className="-ml-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#f0f2f5] px-4 py-2 border-t border-[#e4e6ea]">
          <div className="bg-white rounded-[20px] px-4 py-2 text-xs text-[#667781]">
            Type a message...
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced WhatsApp Button Component
function WhatsAppButton({ planType, text, message }: {
  planType: 'basic' | 'executive' | 'ultimate'
  text: string
  message: string
}) {
  const { registrationCode } = useRegistration()

  const whatsappUrl = registrationCode
    ? `https://api.whatsapp.com/send/?phone=972559943649&text=My code: ${registrationCode}. ${message}&type=phone_number&app_absent=0`
    : `https://api.whatsapp.com/send/?phone=972559943649&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-whatsapp text-white px-6 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(37,211,102,0.25)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(37,211,102,0.35)] relative overflow-hidden group"
    >
      {/* WhatsApp Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        className="flex-shrink-0"
      >
        <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.38 0 .02 5.38 0 12c0 2.11.55 4.18 1.6 6.03L0 24l6.28-1.63A11.98 11.98 0 0 0 12 24c6.63 0 12-5.38 12-12 0-3.2-1.26-6.2-3.48-8.52ZM12 22a9.94 9.94 0 0 1-5.14-1.4l-.37-.22-3.72.97.99-3.63-.24-.37A9.95 9.95 0 0 1 2 12c0-5.53 4.48-10 10-10s10 4.47 10 10-4.48 10-10 10Zm5.44-7.57c-.3-.15-1.77-.88-2.05-.98s-.48-.15-.69.15-.79.98-.96 1.18-.36.22-.66.07c-.3-.15-1.26-.47-2.39-1.51-.88-.79-1.47-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.51-.07-.15-.69-1.67-.95-2.29-.25-.61-.5-.52-.69-.53-.18 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46 0 1.45 1.07 2.85 1.22 3.05.15.2 2.11 3.22 5.12 4.51.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>

      <span className="text-white font-semibold">{text}</span>

      {/* Shine effect */}
      <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine pointer-events-none" />
    </a>
  )
}

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [billingType, setBillingType] = useState('monthly')

  const { registrationCode, getUrlWithCode } = useRegistration()

  const heroTexts = [
    'calendar.',
    'todo list.',
    'reminders.',
  ]

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    })

    const elements = document.querySelectorAll('.animate-on-scroll')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="font-system">
      <style jsx global>{`
        @keyframes slideInMessage {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .animate-slide-in-message {
          opacity: 0;
          animation: slideInMessage 0.5s ease-out forwards;
        }
        
        .animate-shine {
          animation: shine 3s infinite;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .slide-in-left {
          transform: translateX(-50px);
        }
        
        .slide-in-right {
          transform: translateX(50px);
        }
        
        .slide-in-left.animate-in,
        .slide-in-right.animate-in {
          transform: translateX(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll {
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Header - Mobile Optimized */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-[10px] border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src="/yaya-logo.png"
                alt="Yaya Assistant Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
              />
              <span className="text-xl sm:text-2xl font-semibold text-yaya-green">Yaya</span>
            </div>
            
            {/* CTA Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Badge - Hidden on very small screens */}
              <span className="hidden sm:flex bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium items-center gap-1">
                Multi-Calendar Support 📅
              </span>
              
              {/* Get Started Button */}
              <a
                href={getUrlWithCode('/payment')}
                className="bg-yaya-green text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-opacity-90"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-[#faf5f0] to-[#f7f3ed] text-[#2d3748] pt-24 sm:pt-32 pb-12 sm:pb-16 lg:pb-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="animate-on-scroll text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light mb-2 leading-tight text-[#1a202c] tracking-tight">
            Save your time, text your
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 sm:mb-8 leading-tight min-h-[3rem] sm:min-h-[4rem] lg:min-h-[5rem] text-[#1a202c] tracking-tight">
            <span className="bg-[#e6f4ea] px-3 py-1.5 rounded-xl text-yaya-green">
              {isClient ? heroTexts[currentTextIndex] : heroTexts[0]}
            </span>
          </h1>

          <div className="animate-on-scroll bg-white/70 backdrop-blur-[10px] border border-black/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center gap-2 text-sm sm:text-base text-[#4a5568] mb-6 sm:mb-8 font-normal">
            Your executive assistant in <strong>WhatsApp</strong>
            <MessageCircle size={18} className="text-whatsapp" />
          </div>

          <div className="animate-on-scroll">
            <a
              href={registrationCode
                ? `https://wa.me/972559943649?text=My code: ${registrationCode}`
                : "https://wa.me/972559943649"
              }
              className="inline-flex items-center gap-2 bg-whatsapp text-white px-6 py-3 rounded-full text-base font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
                <path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.38 0 .02 5.38 0 12c0 2.11.55 4.18 1.6 6.03L0 24l6.28-1.63A11.98 11.98 0 0 0 12 24c6.63 0 12-5.38 12-12 0-3.2-1.26-6.2-3.48-8.52ZM12 22a9.94 9.94 0 0 1-5.14-1.4l-.37-.22-3.72.97.99-3.63-.24-.37A9.95 9.95 0 0 1 2 12c0-5.53 4.48-10 10-10s10 4.47 10 10-4.48 10-10 10Zm5.44-7.57c-.3-.15-1.77-.88-2.05-.98s-.48-.15-.69.15-.79.98-.96 1.18-.36.22-.66.07c-.3-.15-1.26-.47-2.39-1.51-.88-.79-1.47-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.51-.07-.15-.69-1.67-.95-2.29-.25-.61-.5-.52-.69-.53-.18 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46 0 1.45 1.07 2.85 1.22 3.05.15.2 2.11 3.22 5.12 4.51.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
              </svg>
              Start Here
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="animate-on-scroll text-3xl sm:text-4xl lg:text-5xl font-light mb-8 sm:mb-12 lg:mb-16 text-[#1a202c] text-center tracking-tight">
            Save 3 hours a week with Yaya
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {/* Feature 1 */}
            <div className="animate-on-scroll slide-in-left text-center">
              <h3 className="text-xl sm:text-2xl font-normal mb-3 sm:mb-4 text-[#2d3748] tracking-tight">
                Create hundreds of events, in seconds
              </h3>
              <p className="text-[#718096] mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed font-normal">
                Modify an event with a voice message. Search multiple calendars, instantly.
                Yaya knows when you're busy or free and organizes your weekly schedule.
              </p>
              <div className="mb-4 sm:mb-6 text-sm sm:text-base">
                <div className="text-[#4a5568] mb-2">We support:</div>
                <div className="text-yaya-green font-medium">• Outlook Calendar</div>
                <div className="text-yaya-green font-medium">• Google Calendar</div>
              </div>

              <div className="scale-75 sm:scale-90 lg:scale-100">
                <PhoneMockup
                  messages={[
                    { text: "Add lunch with Sarah tomorrow at 1pm", sender: "user" },
                    { text: "I've created an event on your calendar for tomorrow at 1:00 PM - Lunch with Sarah ✅", sender: "yaya" }
                  ]}
                />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="animate-on-scroll text-center">
              <h3 className="text-xl sm:text-2xl font-normal mb-3 sm:mb-4 text-[#2d3748] tracking-tight">
                Stop forgetting your small tasks
              </h3>
              <p className="text-[#718096] mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed font-normal">
                Create single or repeating reminders in your own language!
                Yaya can even send reminders to your friends, so you don't have to.
              </p>

              <div className="scale-75 sm:scale-90 lg:scale-100">
                <PhoneMockup
                  messages={[
                    { text: "Remind me to call mom every Sunday at 6pm", sender: "user" },
                    { text: "Perfect! I'll remind you to call mom every Sunday at 6:00 PM 📞", sender: "yaya" },
                    { text: "🔔 Reminder: Call mom", sender: "yaya" }
                  ]}
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="animate-on-scroll slide-in-right text-center">
              <h3 className="text-xl sm:text-2xl font-normal mb-3 sm:mb-4 text-[#2d3748] tracking-tight">
                Your ToDo list in WhatsApp
              </h3>
              <p className="text-[#718096] mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed font-normal">
                No app download required. Your ToDo list, gift ideas list, or grocery list
                are easily accessible with Yaya. Ask Yaya to create and check your lists.
              </p>

              <div className="scale-75 sm:scale-90 lg:scale-100">
                <PhoneMockup
                  messages={[
                    { text: "Add milk, eggs, and bread to my shopping list", sender: "user" },
                    { text: "Added to your Shopping List! 🛒\n\n✓ Milk\n✓ Eggs\n✓ Bread", sender: "yaya" }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="animate-on-scroll text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 text-[#1a202c] tracking-tight">
            Yaya learns from you and gets smarter over time
          </h2>
          <p className="animate-on-scroll text-base sm:text-lg lg:text-xl text-[#718096] leading-relaxed font-normal">
            Send in a voice note and Yaya will understand you, across 100 languages.
            You can even send in an image and Yaya will understand. Tell Yaya what you prefer,
            and Yaya will listen to you!
          </p>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="animate-on-scroll text-4xl sm:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6 text-yaya-brown tracking-tight">
            Simple Pricing
          </h2>

          {/* Billing Toggle */}
          <div className="animate-on-scroll flex gap-1 justify-center mb-8 sm:mb-12 bg-[#f7fafc] rounded-lg p-1 w-fit mx-auto cursor-pointer">
            <span
              onClick={() => setBillingType('yearly')}
              className={`${
                billingType === 'yearly'
                  ? 'bg-white text-yaya-brown shadow-sm'
                  : 'bg-transparent text-gray-400'
              } px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base lg:text-lg font-medium transition-all duration-200`}
            >
              Yearly Billing
            </span>
            <span
              onClick={() => setBillingType('monthly')}
              className={`${
                billingType === 'monthly'
                  ? 'bg-white text-yaya-brown shadow-sm'
                  : 'bg-transparent text-gray-400'
              } px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base lg:text-lg font-medium transition-all duration-200`}
            >
              Monthly Billing
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Basic Plan */}
            <div className="animate-on-scroll bg-yaya-bg rounded-[20px] p-6 sm:p-8 lg:p-10 text-left border border-[#E5DDD5] transition-all duration-300">
              <div className="text-sm font-medium mb-2 text-yaya-brown uppercase tracking-wider">
                BASIC PLAN
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-yaya-brown mb-6 sm:mb-8 leading-none">
                FREE
              </div>

              <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited messages
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited one-time reminders
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100+ languages supported
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  ChatGPT
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  5 Voice Notes / Month
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Shopping List
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Receive reminders from friends
                </div>
              </div>

              <WhatsAppButton
                planType="basic"
                text="Continue with Assistant"
                message="היי Yaya, אני מעוניין להתחיל עם המסלול החינמי"
              />
            </div>

            {/* Executive Plan */}
            <div className="animate-on-scroll bg-yaya-bg rounded-[20px] p-6 sm:p-8 lg:p-10 text-left relative border-2 border-yaya-brown transition-all duration-300">
              <div className="absolute top-4 right-4 bg-yaya-brown text-white px-3 py-1 rounded-xl text-xs font-medium">
                7 DAY TRIAL
              </div>
              <div className="text-sm font-medium mb-2 text-yaya-brown uppercase tracking-wider">
                EXECUTIVE PLAN
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-yaya-brown mb-2 leading-none flex items-baseline gap-2">
                ${billingType === 'yearly' ? '4' : '5'}<span className="text-base sm:text-lg font-normal">/MONTH</span>
              </div>

              <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited messages
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited one-time reminders
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100+ languages supported
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  ChatGPT
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100 Voice Notes / Month
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Create Lists
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Send/Receive reminders with friends
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Google Calendar
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Expense tracking
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Repeat reminders
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  20 Image Analysis / Month
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  20 Internet Searches
                </div>
              </div>

              <WhatsAppButton
                planType="executive"
                text="Continue with Assistant"
                message="היי Yaya, אני מעוניין במסלול Executive עם ניסיון חינם למשך 7 ימים"
              />

              <div className="text-center text-sm text-yaya-brown font-normal mt-4">
                4,100+ users loving this plan
              </div>
            </div>

            {/* Ultimate Plan */}
            <div className="animate-on-scroll bg-yaya-bg rounded-[20px] p-6 sm:p-8 lg:p-10 text-left relative border border-[#E5DDD5] transition-all duration-300">
              <div className="absolute top-4 right-4 bg-yaya-brown text-white px-3 py-1 rounded-xl text-xs font-medium">
                7 DAY TRIAL
              </div>
              <div className="text-sm font-medium mb-2 text-yaya-brown uppercase tracking-wider">
                ULTIMATE PLAN
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-light text-yaya-brown mb-2 leading-none flex items-baseline gap-2">
                ${billingType === 'yearly' ? '13' : '14'}<span className="text-base sm:text-lg font-normal">/MONTH</span>
              </div>

              <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited messages
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Unlimited one-time reminders
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100+ languages supported
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  ChatGPT
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  500 Voice Notes / Month
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Create Lists
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Send/Receive reminders with friends
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Google Calendar
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Expense tracking
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Repeat reminders
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  Food Tracking (Calories)
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100 Image Analysis / Month
                </div>
                <div className="text-yaya-brown text-sm sm:text-base flex items-start gap-2">
                  <span className="text-yaya-brown">•</span>
                  100 Internet Searches
                </div>
              </div>

              <WhatsAppButton
                planType="ultimate"
                text="Continue with Assistant"
                message="היי Yaya, אני מעוניין במסלול Ultimate עם ניסיון חינם למשך 7 ימים"
              />
            </div>
          </div>

          <div className="animate-on-scroll text-base sm:text-lg text-yaya-brown mt-8">
            Want a custom bot just for you? Contact us!
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a202c] text-[#a0aec0] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 sm:mb-8">
            <span className="text-2xl font-medium text-white">Yaya</span>
          </div>
          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap text-sm">
            <a href={getUrlWithCode('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={getUrlWithCode('/terms-of-service')} className="hover:text-white transition-colors">Terms of Service</a>
            <a href={getUrlWithCode('/posts')} className="hover:text-white transition-colors">Blog</a>
            <a href="https://discord.gg/BRxAAq47xv" className="hover:text-white transition-colors">Discord</a>
            <a href="https://x.com/yayagent" className="hover:text-white transition-colors">X/Twitter</a>
            <a href="mailto:info@yayagent.com" className="hover:text-white transition-colors">info@yayagent.com</a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        title="Chat with Yaya on WhatsApp"
        href={registrationCode
          ? `https://wa.me/972559943649?text=My code: ${registrationCode}`
          : "https://wa.me/972559943649"
        }
        className="fixed bottom-6 right-6 bg-whatsapp text-white rounded-full w-14 h-14 flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.4)] z-50 transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
