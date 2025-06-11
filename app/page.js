import HeroSection from "@/components/hero";
import { features } from "@/components/data/features";
import { howItWorks } from "@/components/data/howItWorks";
import { faqs } from "@/components/data/faqs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center space-y-6 md:space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Powerful Features for Your <span className="text-indigo-600 dark:text-indigo-400">Career Growth</span>
          </h2>
          <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore intelligent tools designed to help you stand out and succeed in your job search.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="transition duration-300 hover:shadow-lg hover:-translate-y-1 group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              >
                <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-indigo-600 dark:text-indigo-400 text-2xl sm:text-3xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bragging Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 text-center">
          {[
            { number: "60+", label: "Fields Covered" },
            { number: "100+", label: "Career Roles" },
            { number: "1000+", label: "Interview Questions" },
            { number: "24/7", label: "Access Anywhere" },
            { number: "99%", label: "User Satisfaction" },
          ].map((item, index) => (
            <div
              key={index}
              className="group p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all duration-300 bg-white dark:bg-gray-900 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-indigo-700 hover:shadow-md sm:hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold transition-all duration-300 text-indigo-600 dark:text-white">
                {item.number}
              </h3>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2 transition-all duration-300 text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center space-y-6 md:space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how ElevatePath helps you navigate your career path with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
            {howItWorks.map((item, index) => (
              <Card
                key={index}
                className="transition duration-300 hover:shadow-lg hover:-translate-y-1 group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition">
                    {item.icon}
                  </div>
                  <div className="text-xs sm:text-sm uppercase font-semibold tracking-wide text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                    Step {index + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers to help you get the most out of ElevatePath.
          </p>

          <Accordion type="single" collapsible className="w-full text-left mt-6 sm:mt-8">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left cursor-pointer text-sm sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Elevate Your Career?
          </h2>
          <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Be part of the future of career development. Join us today and take the first step towards your dream job!
          </p>
          <Link href="/dashboard">
            <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white transition text-sm sm:text-base">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}