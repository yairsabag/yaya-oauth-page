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
    // Mark as client-side after hydration
    setIsClient(true);

    // Hero text animation - changes every 2 seconds
    const heroInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textOptions.length);
    }, 2000);

    // Chat bubble animation - changes every 5.5 seconds (slower)
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
          <Image
            src="/yaya-logo-complete.svg"
            alt="Yaya Logo"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <span className="text-2xl lg:text-3xl font-bold text-primary">Yaya</span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden lg:flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-border shadow-sm" suppressHydrationWarning>
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
      <section className="px-4 py-8 lg:px-12 lg:py-12 flex justify-center">
        <div className="relative">
          {/* iPhone with Original Chat Image */}
          <div className="relative">
            <Image
              src="https://ext.same-assets.com/3449976750/446438419.png"
              alt="iPhone WhatsApp Chat"
              width={280}
              height={560}
              className="w-[280px] h-[560px] object-contain drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
              }}
            />

            {/* Text Overlay for Yaya AI branding */}
            <div className="absolute top-[82px] left-[72px]">
              <div className="text-white font-medium text-[16px] leading-tight tracking-normal">
                Yaya AI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 lg:px-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-16">
            Save 3 hours a week with Yaya
          </h2>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Create hundreds of events, in seconds
              </h3>
              <p className="text-muted mb-6">
                Modify an event with a voice message. Search multiple calendars, instantly.
                Yaya knows when you're busy or free and organizes your weekly schedule. We support:
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-primary">📅</span>
                  <span>Outlook Calendar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary">📅</span>
                  <span>Google Calendar</span>
                </div>
              </div>
              <a href="/calendar" className="text-primary hover:text-primary/80 font-medium mt-4 inline-block">
                Learn More →
              </a>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-secondary/20 rounded-lg p-3 mb-3" suppressHydrationWarning>
                <span className="text-sm">
                  {isClient ? (
                    currentChat === 0 ? "Add lunch with Sarah tomorrow at 1pm" :
                    currentChat === 1 ? "Schedule my dentist appointment" :
                    currentChat === 2 ? "Block 2 hours for project review Friday" :
                    "Set up weekly team meeting"
                  ) : "Add lunch with Sarah tomorrow at 1pm"}
                </span>
              </div>
              <div className="bg-secondary text-white rounded-lg p-3" suppressHydrationWarning>
                {isClient ? (
                  currentChat === 0 ? "I've created an event on your calendar." :
                  currentChat === 1 ? "Scheduled for next Tuesday at 3pm!" :
                  currentChat === 2 ? "Added to your calendar for Friday 2-4pm." :
                  "Set up every Monday at 10am ✅"
                ) : "I've created an event on your calendar."}
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-white rounded-2xl p-6 shadow-lg order-2 md:order-1">
              <div className="bg-secondary/20 rounded-lg p-3 mb-3" suppressHydrationWarning>
                <span className="text-sm">
                  {isClient ? (
                    currentChat === 0 ? "Remind me to call mom every Sunday" :
                    currentChat === 1 ? "Daily water reminder at 2pm" :
                    currentChat === 2 ? "Remind me about the presentation tomorrow" :
                    "Set reminder to pay rent monthly"
                  ) : "Remind me to call mom every Sunday"}
                </span>
              </div>
              <div className="bg-secondary text-white rounded-lg p-3" suppressHydrationWarning>
                {isClient ? (
                  currentChat === 0 ? "I'll remind you every Sunday at 6pm!" :
                  currentChat === 1 ? "Set! Daily reminder at 2pm 💧" :
                  currentChat === 2 ? "I'll remind you tomorrow at 9am ⏰" :
                  "Monthly reminder set for the 1st!"
                ) : "I'll remind you every Sunday at 6pm!"}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Stop forgetting your small tasks
              </h3>
              <p className="text-muted mb-6">
                Create single or repeating reminders in your own language!
                Yaya can even send reminders to your friends, so you don't have to.
              </p>
              <a href="/reminders" className="text-primary hover:text-primary/80 font-medium">
                Learn More →
              </a>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Your ToDo list in WhatsApp
              </h3>
              <p className="text-muted mb-6">
                No app download required. Your ToDo list, gift ideas list, or grocery list
                are easily accessible with Yaya. Ask Yaya to create and check your lists.
                You can even check your lists on the Dashboard.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="bg-secondary/20 rounded-lg p-3 mb-3" suppressHydrationWarning>
                <span className="text-sm">
                  {isClient ? (
                    currentChat === 0 ? "Add milk, eggs, and bread to my shopping list" :
                    currentChat === 1 ? "What are the best museums in Paris? Add them to my travel list" :
                    currentChat === 2 ? "Create a gift ideas list for Sarah's birthday" :
                    "Add workout gear to my fitness list"
                  ) : "Add milk, eggs, and bread to my shopping list"}
                </span>
              </div>
              <div className="bg-secondary text-white rounded-lg p-3" suppressHydrationWarning>
                {isClient ? (
                  currentChat === 0 ? "Added to your Shopping List! 🛒" :
                  currentChat === 1 ? "Done. I created a new 'Travel List' for you!" :
                  currentChat === 2 ? "Created 'Gift Ideas' list for Sarah 🎁" :
                  "Added to your Fitness List! 💪"
                ) : "Added to your Shopping List! 🛒"}
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg order-2 md:order-1">
              <div className="bg-secondary/20 rounded-lg p-3 mb-3" suppressHydrationWarning>
                <span className="text-sm">
                  {isClient ? (
                    currentChat === 0 ? "Be more casual in your responses" :
                    currentChat === 1 ? "Remember I prefer morning workouts" :
                    currentChat === 2 ? "Use more emojis when you reply" :
                    "Always ask before scheduling meetings"
                  ) : "Be more casual in your responses"}
                </span>
              </div>
              <div className="bg-secondary text-white rounded-lg p-3" suppressHydrationWarning>
                {isClient ? (
                  currentChat === 0 ? "Got it! I'll keep things more relaxed 😊" :
                  currentChat === 1 ? "Noted! I'll suggest mornings for workouts 🌅" :
                  currentChat === 2 ? "Perfect! I'll use more emojis from now 😊🎉" :
                  "Understood! I'll always check first ✅"
                ) : "Got it! I'll keep things more relaxed 😊"}
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <Image
                  src="/yaya-logo-complete.svg"
                  alt="Yaya"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Yaya learns from you and gets smarter over time
              </h3>
              <p className="text-muted mb-6">
                Send in a voice note and Yaya will understand you, across 100 languages.
                You can even send in an image and Yaya will understand. Tell Yaya what you prefer,
                and Yaya will listen to you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-12 lg:px-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 lg:mb-12">
            FAQ
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                How do I start?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Just text{' '}
                <a href="https://wa.me/972559943649" className="text-primary font-medium hover:text-primary/80">
                  +972 55-994-3649
                </a>{' '}
                on WhatsApp to begin. No signup required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                Is Yaya free?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Unlimited messages and reminders are free. More features on our Executive Plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                What is the Dashboard?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                The Dashboard is where you can see your reminders, lists, calendar settings, and subscription options. Text Yaya to login to the dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                How can I upgrade/cancel?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Log in to your Dashboard to manage your subscription.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                Does Yaya work in Group Chats?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Not yet. WhatsApp does not currently allow this.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                What is the difference between Reminders and Events?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Reminders will be sent as WhatsApp messages at the set reminder time. Reminders are not tied or associated with your calendar events. Reminders are great for things like "remind me to drink water in 20 minutes".
                <br /><br />
                Events are always added to your calendar. Events have multiple fields including: start & end times, attendee lists, titles, descriptions, and location.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                Can I send reminders to my friends?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Users who upgrade can send reminders to other people by adding them as a contact. You can add someone as a contact by texting Yaya their name and (international) phone number or by logging into the Dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                Is my Data Safe?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Our company places the highest priority on keeping user data as secure as possible.
                <br /><br />
                We have in place a comprehensive list of measures to secure and encrypt user data, both at transit and rest. Employees not have access to any user data without explicit permission from the user.
                <br /><br />
                For more information, please refer to our{' '}
                <a href="/privacy-policy" className="text-primary font-medium hover:text-primary/80">
                  Privacy Policy
                </a>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="bg-white rounded-lg border border-border">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold hover:no-underline">
                How can I leave feedback?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted">
                Join our{' '}
                <a href="https://discord.gg/BRxAAq47xv" className="text-primary font-medium hover:text-primary/80">
                  Discord
                </a>{' '}
                or email us at info@textcoco.com
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>



      {/* Pricing Section */}
      <section className="px-4 py-12 lg:px-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
              Simple Pricing
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-muted">Yearly Billing</span>
              <span className="text-primary font-medium">Monthly Billing</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-background rounded-2xl p-8 border border-border relative">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                  BASIC PLAN
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">FREE</span>
                </div>
                <ul className="space-y-3 text-sm text-muted text-left">
                  <li>• Unlimited messages</li>
                  <li>• Unlimited one-time reminders</li>
                  <li>• 100+ languages supported</li>
                  <li>• ChatGPT</li>
                  <li>• 5 Voice Notes / Month</li>
                  <li>• 5 Image Analysis / Month</li>
                  <li>• Receive reminders from friends</li>
                </ul>
              </div>
            </div>

            {/* Executive Plan */}
            <div className="bg-background rounded-2xl p-8 border border-border relative transform scale-105 shadow-lg">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                7 DAY TRIAL
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                  EXECUTIVE PLAN
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">$5</span>
                  <span className="text-muted">/MONTH</span>
                </div>
                <ul className="space-y-3 text-sm text-muted text-left mb-6">
                  <li>• Unlimited messages</li>
                  <li>• Unlimited one-time reminders</li>
                  <li>• 100+ languages supported</li>
                  <li>• ChatGPT</li>
                  <li>• Repeat reminders</li>
                  <li>• Google / Outlook Calendar</li>
                  <li>• 100 Voice Notes / Month</li>
                  <li>• 20 Image Analysis / Month</li>
                  <li>• 20 Internet Searches</li>
                  <li>• Send/Receive reminders with friends</li>
                  <li>• AI Memory of You</li>
                  <li>• Create Lists</li>
                </ul>
                <p className="text-xs text-muted font-medium">
                  4,100+ users loving this plan
                </p>
              </div>
            </div>

            {/* Ultimate Plan */}
            <div className="bg-background rounded-2xl p-8 border border-border relative">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                7 DAY TRIAL
              </div>
              <div className="text-center mt-4">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
                  ULTIMATE PLAN
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">$14</span>
                  <span className="text-muted">/MONTH</span>
                </div>
                <ul className="space-y-3 text-sm text-muted text-left">
                  <li>• Unlimited messages</li>
                  <li>• Unlimited one-time reminders</li>
                  <li>• 100+ languages supported</li>
                  <li>• ChatGPT</li>
                  <li>• Repeat reminders</li>
                  <li>• Google / Outlook Calendar</li>
                  <li>• 500 Voice Notes / Month</li>
                  <li>• 100 Image Analysis / Month</li>
                  <li>• 100 Internet Searches</li>
                  <li>• Send/Receive reminders with friends</li>
                  <li>• AI Memory of You</li>
                  <li>• Create Lists</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted mb-4">Need Yaya for your Team?</p>
            <a
              href="mailto:info@textcoco.com?subject=Yaya%20AI%20for%20my%20Team"
              className="text-primary font-medium hover:text-primary/80"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 lg:px-12 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Image
                src="/yaya-logo-complete.svg"
                alt="Yaya Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-primary">Yaya</span>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <a href="/privacy-policy" className="text-muted hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-muted hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="/posts" className="text-muted hover:text-primary transition-colors">
                Blog
              </a>
              <a href="https://discord.gg/BRxAAq47xv" className="text-muted hover:text-primary transition-colors">
                Discord
              </a>
              <a href="https://x.com/textcoco" className="text-muted hover:text-primary transition-colors">
                X/Twitter
              </a>
              <a href="https://www.tiktok.com/@textcoco" className="text-muted hover:text-primary transition-colors">
                TikTok
              </a>
              <a href="mailto:info@textcoco.com?subject=New%20Enquiry" className="text-muted hover:text-primary transition-colors">
                info@textcoco.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/972559943649"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          aria-label="Contact us on WhatsApp"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.585"/>
          </svg>
        </a>
      </div>
    </main>
  );
}
