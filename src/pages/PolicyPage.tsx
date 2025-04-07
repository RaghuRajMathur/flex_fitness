
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

const PolicyPage = () => {
  const { type } = useParams<{ type: string }>();
  const location = useLocation();
  
  // Extract policy type from either param or direct path
  let policyType = type;
  if (!policyType) {
    // If accessed directly via /shipping-policy, /return-policy, etc.
    const path = location.pathname.substring(1); // remove leading slash
    if (["shipping-policy", "return-policy", "privacy-policy", "terms-of-service"].includes(path)) {
      policyType = path;
    }
  }
  
  const policyContent = {
    "shipping-policy": {
      title: "Shipping Policy",
      content: [
        {
          heading: "Shipping Methods",
          text: "We offer the following shipping methods for all orders within the United States:",
          items: [
            "Standard Shipping (3-5 business days): $8.95 or FREE on orders over $100",
            "Express Shipping (1-2 business days): $12.95",
            "Next Day Delivery (order by 12pm EST): $24.95"
          ]
        },
        {
          heading: "International Shipping",
          text: "We currently ship to Canada, UK, Australia, and select European countries. International shipping rates and delivery times vary by location. All duties, taxes, and customs fees are the responsibility of the customer and are not included in the shipping cost."
        },
        {
          heading: "Order Processing",
          text: "Orders are typically processed within 1-2 business days. Once your order ships, you will receive a shipping confirmation email with tracking information. Please note that tracking information may take up to 24 hours to update after shipment."
        },
        {
          heading: "Shipping Restrictions",
          text: "Some larger items may have shipping restrictions to certain regions or may require additional shipping fees. These will be clearly indicated on the product page."
        },
        {
          heading: "Delivery Issues",
          text: "If your package appears damaged upon delivery, please refuse the shipment or note the damage when signing. Contact our customer service team immediately with photos of the damaged package."
        }
      ]
    },
    "return-policy": {
      title: "Return Policy",
      content: [
        {
          heading: "Return Eligibility",
          text: "We accept returns of unused, undamaged items in their original packaging within 30 days of delivery. The following conditions apply:",
          items: [
            "Item must be in original condition with all tags, manuals, and accessories",
            "Original packaging must be intact and undamaged",
            "Proof of purchase (order number or receipt) is required",
            "Personalized or custom-made items cannot be returned unless defective"
          ]
        },
        {
          heading: "Return Process",
          text: "To initiate a return, please follow these steps:",
          items: [
            "Contact our customer service team to obtain a Return Merchandise Authorization (RMA) number",
            "Package the item securely in its original packaging",
            "Include the RMA number and your order information",
            "Ship the package to the address provided by customer service"
          ]
        },
        {
          heading: "Refunds",
          text: "Once we receive and inspect your return, we will process your refund. Refunds are issued to the original payment method and typically take 5-10 business days to appear on your statement. Shipping costs are non-refundable unless the return is due to our error or a defective product."
        },
        {
          heading: "Exchanges",
          text: "If you wish to exchange an item for a different size or model, please indicate this when requesting your RMA. We will provide instructions for the exchange process."
        },
        {
          heading: "Damaged or Defective Items",
          text: "If you receive a damaged or defective item, please contact us within 48 hours of delivery. We will arrange for a replacement or refund at our expense."
        }
      ]
    },
    "privacy-policy": {
      title: "Privacy Policy",
      content: [
        {
          heading: "Information We Collect",
          text: "We collect the following types of information when you use our website or services:",
          items: [
            "Personal Information: Name, email address, shipping/billing address, phone number",
            "Payment Information: Credit card details (processed securely through our payment processor)",
            "Account Information: Login credentials, purchase history, product preferences",
            "Browsing Information: IP address, browser type, device information, cookies"
          ]
        },
        {
          heading: "How We Use Your Information",
          text: "We use your information for the following purposes:",
          items: [
            "Process and fulfill your orders",
            "Communicate with you about your order or account",
            "Send you marketing communications (if you've opted in)",
            "Improve our website, products, and services",
            "Detect and prevent fraud or unauthorized access"
          ]
        },
        {
          heading: "Information Sharing",
          text: "We do not sell, rent, or trade your personal information to third parties for marketing purposes. We may share your information with:",
          items: [
            "Service providers who help us operate our business (payment processors, shipping companies)",
            "Legal authorities when required by law",
            "Affiliated businesses that provide services on our behalf"
          ]
        },
        {
          heading: "Data Security",
          text: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All payment information is encrypted during transmission and storage."
        },
        {
          heading: "Your Rights",
          text: "You have the right to:",
          items: [
            "Access the personal information we hold about you",
            "Correct inaccurate information",
            "Request deletion of your information",
            "Opt out of marketing communications",
            "Lodge a complaint with a supervisory authority"
          ]
        },
        {
          heading: "Cookies Policy",
          text: "Our website uses cookies to enhance your browsing experience. You can manage your cookie preferences through your browser settings."
        }
      ]
    },
    "terms-of-service": {
      title: "Terms of Service",
      content: [
        {
          heading: "Acceptance of Terms",
          text: "By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services."
        },
        {
          heading: "Account Registration",
          text: "When you create an account, you are responsible for:",
          items: [
            "Providing accurate and complete information",
            "Maintaining the confidentiality of your account credentials",
            "All activities that occur under your account",
            "Notifying us immediately of any unauthorized access"
          ]
        },
        {
          heading: "Product Information",
          text: "We strive to provide accurate product information, but we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, or error-free. We reserve the right to correct any errors and update information at any time."
        },
        {
          heading: "Intellectual Property",
          text: "All content on our website, including text, graphics, logos, images, and software, is our property or the property of our licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission."
        },
        {
          heading: "User Conduct",
          text: "When using our website, you agree not to:",
          items: [
            "Violate any applicable laws or regulations",
            "Infringe on the rights of others",
            "Submit false or misleading information",
            "Interfere with the proper functioning of the website",
            "Attempt to gain unauthorized access to any portion of the website"
          ]
        },
        {
          heading: "Limitation of Liability",
          text: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our website or services."
        },
        {
          heading: "Governing Law",
          text: "These Terms of Service shall be governed by and construed in accordance with the laws of the state of California, without regard to its conflict of law provisions."
        }
      ]
    }
  };
  
  const selectedPolicy = policyType ? policyContent[policyType as keyof typeof policyContent] : null;
  
  if (!selectedPolicy) {
    return (
      <Layout>
        <div className="max-container py-16 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Policy Not Found</h1>
          <p className="text-muted-foreground">
            The policy you're looking for doesn't exist.
          </p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-container py-16">
        <h1 className="text-3xl font-display font-bold mb-8">
          {selectedPolicy.title}
        </h1>
        
        <div className="prose prose-slate max-w-none">
          {selectedPolicy.content.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
              <p className="mb-4">{section.text}</p>
              
              {section.items && (
                <ul className="list-disc pl-6 space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          
          <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Have questions?</h3>
            <p>
              If you have any questions about our {selectedPolicy.title.toLowerCase()},
              please <a href="/contact" className="text-primary hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PolicyPage;
