'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is NeighborSOS?",
          a: "NeighborSOS is a real-time platform that connects local donors with verified charities to fulfill urgent needs and sponsor families during the holiday season. We make it easy to see exactly what local charities need right now and take immediate action to help."
        },
        {
          q: "How does NeighborSOS work?",
          a: "It's simple: Local charities post urgent needs on our platform. You browse what's needed, claim items you can donate, and coordinate delivery directly with the charity. Everything happens in real-time, so your donation reaches families within hours or days—not weeks or months."
        },
        {
          q: "Is NeighborSOS free to use?",
          a: "Yes! NeighborSOS is completely free for both donors and charities. We don't charge any fees or take any percentage of donations. Our mission is to connect neighbors who need help with neighbors who can help."
        },
        {
          q: "What areas does NeighborSOS serve?",
          a: "We're based in Saint Paul, Minnesota, and currently serve the Twin Cities metro area and surrounding communities. We're working to expand to more areas in the future."
        }
      ]
    },
    {
      category: "For Donors",
      questions: [
        {
          q: "Do I need to create an account to donate?",
          a: "No! You don't need an account to browse needs or commit to donations. We only ask for your name and email when you claim an item so the charity can coordinate delivery with you."
        },
        {
          q: "Is my donation tax-deductible?",
          a: "Donations made through NeighborSOS may be tax-deductible to the extent permitted by law, as all donations go directly to verified 501(c)(3) charitable organizations. You are responsible for obtaining receipts from the receiving charity for tax purposes. NeighborSOS does not issue tax receipts."
        },
        {
          q: "What happens after I claim an item?",
          a: "After you claim an item, you'll receive an email confirmation with details about the charity and delivery instructions. The charity will also receive your contact information to coordinate pickup or delivery. You'll work directly with them to fulfill your commitment."
        },
        {
          q: "What if I can't deliver on time?",
          a: "If circumstances change and you're unable to fulfill your commitment, please contact the charity immediately using the email address provided in your confirmation. The sooner you let them know, the sooner they can find another donor. Life happens—charities understand, but timely communication is essential."
        },
        {
          q: "Can I donate money instead of items?",
          a: "Currently, NeighborSOS facilitates in-kind donations (physical items) and holiday family sponsorships. For monetary donations, we recommend contacting charities directly."
        },
        {
          q: "How do I know the items I donate will reach people in need?",
          a: "All charities on our platform are verified 501(c)(3) organizations. While we vet charities carefully, you work directly with them for delivery, so you can see firsthand where your donation goes."
        }
      ]
    },
    {
      category: "Holiday Family Sponsorships",
      questions: [
        {
          q: "How does the Sponsor a Family program work?",
          a: "During the holiday season, local charities list families in need of support. You can browse families, see what they need, and choose to sponsor them fully or partially. You can even split costs with friends and family. Once you commit, you'll receive instructions for purchasing and delivering gifts."
        },
        {
          q: "Can I sponsor just part of a family's needs?",
          a: "Yes! You can sponsor any percentage of a family's total cost. Choose from quick options like 25%, 50%, 75%, or 100%, or enter a custom amount. Other donors can contribute to the same family until it's fully funded."
        },
        {
          q: "Can I split the cost with friends?",
          a: "Absolutely! When sponsoring a family, you can invite friends or family members via email to co-sponsor. They'll receive a link to contribute their own amount toward the same family. The family remains active until fully funded."
        },
        {
          q: "How are families selected for the program?",
          a: "All families are nominated and vetted by our partnering 501(c)(3) charitable organizations. Charities verify each family's need and provide accurate information about their situation and specific needs."
        },
        {
          q: "What if a family is fully sponsored before I can help?",
          a: "If a family becomes fully sponsored, you can browse other families still in need of support. There are always families waiting for generous donors like you!"
        }
      ]
    },
    {
      category: "For Charities",
      questions: [
        {
          q: "How do I register my charity on NeighborSOS?",
          a: "Visit our charity signup page and complete the registration form. You'll need to provide your organization's 501(c)(3) documentation, contact information, and details about your organization. Our team will review your application and verify your status, typically within 3-5 business days."
        },
        {
          q: "What types of needs can I post?",
          a: "You can post any legitimate urgent need your organization has—food, clothing, household items, medical supplies, and more. Needs should be specific (e.g., '10 winter coats for children ages 5-12') and time-sensitive."
        },
        {
          q: "How quickly will donors respond to my needs?",
          a: "Response times vary, but many urgent needs receive commitments within hours of being posted. The more specific and urgent your need, the faster you'll typically get responses."
        },
        {
          q: "What if a donor doesn't follow through?",
          a: "If a donor doesn't fulfill their commitment, please contact us at info@neighborsos.org. We'll work to find another donor and may follow up with the original donor. While we can't guarantee every commitment will be fulfilled, most donors follow through on their pledges."
        },
        {
          q: "Is there a fee to use NeighborSOS?",
          a: "No! NeighborSOS is completely free for registered charities. We don't charge any fees or take any percentage of donations."
        }
      ]
    },
    {
      category: "Trust & Safety",
      questions: [
        {
          q: "How do I know charities are legitimate?",
          a: "All charities on NeighborSOS are verified 501(c)(3) organizations. We verify their tax-exempt status, check their registration with the IRS, and review their mission and history before approving them to post needs on our platform."
        },
        {
          q: "How does NeighborSOS protect my personal information?",
          a: "We take your privacy seriously. We only collect the information necessary to facilitate donations and never sell or share your data with third parties for marketing purposes. Read our full Privacy Policy for details on how we protect your information."
        },
        {
          q: "What if I suspect fraud or misuse?",
          a: "If you suspect fraudulent activity or misuse of donations, please report it immediately to info@neighborsos.org. We take all reports seriously and will investigate promptly."
        },
        {
          q: "Can I see proof that my donation was received?",
          a: "Since donations are coordinated directly between you and the charity, we encourage you to ask the charity for confirmation or photos when you deliver your donation. Most charities are happy to provide updates on how donations are used."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "The website isn't working properly. What should I do?",
          a: "First, try refreshing your browser or clearing your cache. If problems persist, please contact us at info@neighborsos.org with details about the issue, including your browser type, device, and what you were trying to do."
        },
        {
          q: "I didn't receive my confirmation email. What should I do?",
          a: "Check your spam or promotions folder first. If you still don't see it, contact us at info@neighborsos.org with your name and the email address you used, and we'll resend your confirmation."
        },
        {
          q: "Can I use NeighborSOS on my mobile phone?",
          a: "Yes! NeighborSOS is fully mobile-responsive and works on smartphones, tablets, and desktop computers."
        }
      ]
    }
  ];

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find answers to common questions about NeighborSOS. Can't find what you're looking for? <a href="/contact" className="text-[#000080] hover:underline">Contact us</a>.
        </p>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#000080] to-[#000080]/90 px-6 py-4">
                <h2 className="text-2xl font-serif text-white">{category.category}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, qIndex) => {
                  const currentIndex = globalIndex++;
                  return (
                    <div key={qIndex} className="border-b border-gray-200 last:border-0">
                      <button
                        onClick={() => setOpenIndex(openIndex === currentIndex ? null : currentIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
                      >
                        <span className="font-semibold text-gray-800 pr-8">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            openIndex === currentIndex ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openIndex === currentIndex && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-serif text-[#2d3436] mb-4">Still Have Questions?</h3>
          <p className="text-gray-600 mb-6">
            We're here to help! Reach out to us and we'll get back to you within 24-48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <a  href="/contact"
              className="bg-[#000080] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
            
            <a  href="mailto:info@neighborsos.org"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}