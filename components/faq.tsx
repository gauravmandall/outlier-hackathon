"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  id: string
  question: string
  answer: string
}

const FAQ = () => {
  // Sample FAQ data - replace with actual FAQs
  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "What is a hackathon?",
      answer: "A hackathon is a collaborative event where programmers, designers, and other tech enthusiasts come together to build innovative projects within a limited timeframe. Our hackathon brings together the brightest minds to solve challenging problems and create groundbreaking solutions."
    },
    {
      id: "2",
      question: "Who can participate?",
      answer: "Anyone with a passion for technology can participate! Whether you're a seasoned developer, a UX/UI designer, a product manager, or even a student just starting your tech journey, there's a place for you at our hackathon. We welcome participants of all skill levels and backgrounds."
    },
    {
      id: "3",
      question: "Do I need a team to participate?",
      answer: "It's an individual event. You can participate as an individual from anywhere in the world. However, there are some restrictions on the number of participants."
    },
    {
      id: "4",
      question: "Is there a participation fee?",
      answer: "No, participation in our hackathon is completely free! We believe in making innovation accessible to everyone, so there are no registration fees or hidden costs to join the event."
    },
    {
      id: "5",
      question: "What are the prizes?",
      answer: "Prizes include a MacBook M4 Pro for 1st place, a PlayStation 5 for 2nd place, and Ray-Ban Meta Glasses for 3rd place. Categories include Best Technical Implementation, Most Innovative Solution, and Best UI/UX. Additionally, freelance work opportunities are available for the top 1% of participants."
    },
    {
      id: "6",
      question: "What resources will be provided?",
      answer: "Participants will have access to AI tools and can use Vibe coding to help them build their projects. If you have any questions, please email us at uihacks25@outlier.ai."
    },
    {
      id: "7",
      question: "How are projects judged?",
      answer: "Projects will be evaluated by a panel of industry experts and tech leaders based on innovation, technical complexity, practicality, presentation quality, and potential impact. Each category will have specific judging criteria provided before the event."
    },
    {
      id: "8",
      question: "Can I use someone else's code?",
      answer: "All code must be written by you. You retain the intellectual property rights to your creation. You can use open-source libraries and frameworks, but any code that is not written by you must be properly attributed."
    }
]

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-eb-garamond mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about the Frontend UI hackathon
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item) => (
              <AccordionItem
                value={item.id}
                key={item.id}
                className="bg-black has-focus-visible:border-white/30 has-focus-visible:ring-white/20 rounded-md border border-white/10 px-4 py-1 outline-none last:border-b has-focus-visible:ring-[3px]"
              >
                <AccordionTrigger className="py-3 text-xl font-semibold leading-6 hover:no-underline focus-visible:ring-0">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4 pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Help */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-300 mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:hi@grvx.dev"
            className="inline-block px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
