
import React from "react";
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the United States. Express shipping takes 1-2 business days. International shipping times vary by location. Please refer to our Shipping Policy for more details."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns of unused, undamaged items in their original packaging within 30 days of delivery. Please refer to our Return Policy for detailed instructions on how to initiate a return."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to Canada, UK, Australia, and select European countries. International shipping rates and delivery times vary by location. All duties, taxes, and customs fees are the responsibility of the customer."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you will receive a shipping confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "Can I modify or cancel my order after it's been placed?",
      answer: "You can modify or cancel your order within 1 hour of placing it. After that, the order enters our processing system and cannot be modified or canceled. Please contact customer service immediately if you need to make changes."
    },
    {
      question: "Do your products come with a warranty?",
      answer: "Yes, all our strength equipment comes with a 10-year warranty against manufacturing defects. Accessories typically have a 1-year warranty. Electronics have a 2-year warranty. Warranty details are included with each product."
    },
    {
      question: "How do I assemble my equipment?",
      answer: "Each product comes with detailed assembly instructions. For larger items, we offer professional assembly services for an additional fee. You can add this service during checkout. Video tutorials are also available on our website."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer financing through our partner, FlexPay. Qualified customers can spread payments over 3, 6, or 12 months. Interest rates vary based on your credit score and chosen payment term. Apply during checkout to see your options."
    },
    {
      question: "How do I care for and maintain my fitness equipment?",
      answer: "Regular maintenance will extend the life of your equipment. Wipe down surfaces after use, tighten bolts monthly, and lubricate moving parts as recommended in your product manual. Detailed care instructions are included with each product."
    },
    {
      question: "What if I receive a damaged or defective item?",
      answer: "If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or refund at our expense. Do not attempt to use damaged equipment."
    }
  ];

  return (
    <Layout>
      <div className="max-container py-16">
        <h1 className="text-3xl font-display font-bold mb-8">Frequently Asked Questions</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="mb-4">
            If you couldn't find the answer to your question, please don't hesitate to contact our customer support team.
          </p>
          <a href="/contact" className="text-primary hover:underline font-medium">Contact Us →</a>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
