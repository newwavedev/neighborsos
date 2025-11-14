export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-6">
          Terms of Service
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to NeighborSOS! These Terms of Service ("Terms") govern your access to and use of the NeighborSOS website located at <a href="https://neighborsos.org" className="text-blue-600 hover:underline">neighborsos.org</a> (the "Platform") and all related services provided by NeighborSOS ("we," "us," or "our").
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting. Your continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NeighborSOS is a platform that connects local donors with verified charities to fulfill urgent needs and sponsor families during the holiday season. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Displaying urgent needs posted by verified 501(c)(3) charitable organizations</li>
              <li>Facilitating holiday family sponsorships</li>
              <li>Coordinating donations between donors and charities</li>
              <li>Providing communication tools for delivery coordination</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              NeighborSOS acts as an intermediary platform and does not handle physical donations or monetary transactions directly. All donations are coordinated between donors and charities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">3. User Accounts and Eligibility</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">3.1 Eligibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years old to use NeighborSOS. By using the Platform, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">3.2 Account Registration (Charities)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Charitable organizations must register and be verified to post needs on the Platform. By registering, charities agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain a valid 501(c)(3) tax-exempt status</li>
              <li>Keep account information current and accurate</li>
              <li>Maintain the security of account credentials</li>
              <li>Notify us immediately of any unauthorized account access</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">3.3 Donors</h3>
            <p className="text-gray-700 leading-relaxed">
              Donors are not required to create accounts to use the Platform. When committing to a donation, you agree to provide accurate contact information and fulfill your commitment in a timely manner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">4. User Responsibilities</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.1 Donor Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a donor, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Honor all donation commitments made through the Platform</li>
              <li>Deliver or ship donations by the specified deadline</li>
              <li>Provide items in good, usable condition</li>
              <li>Communicate promptly with charities regarding delivery coordination</li>
              <li>Notify the charity immediately if you are unable to fulfill a commitment</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.2 Charity Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a registered charity, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Post only legitimate and urgent needs</li>
              <li>Provide accurate and truthful information about needs and families</li>
              <li>Maintain current and accurate organization information</li>
              <li>Respond promptly to donor communications</li>
              <li>Provide clear delivery or drop-off instructions</li>
              <li>Acknowledge and thank donors for their contributions</li>
              <li>Use donated items solely for their intended charitable purpose</li>
              <li>Update need statuses promptly when fulfilled</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">5. Prohibited Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Posting false, misleading, or fraudulent information</li>
              <li>Impersonating any person or entity</li>
              <li>Using the Platform for any illegal purpose</li>
              <li>Harassing, threatening, or abusing other users</li>
              <li>Attempting to gain unauthorized access to the Platform or other users' accounts</li>
              <li>Transmitting viruses, malware, or other harmful code</li>
              <li>Scraping, data mining, or using automated tools to access the Platform</li>
              <li>Interfering with or disrupting the Platform's operation</li>
              <li>Selling or reselling donated items for profit</li>
              <li>Using the Platform to solicit donations for personal use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">6. Verification and Vetting</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              NeighborSOS makes reasonable efforts to verify the 501(c)(3) status of registered charities. However, we do not guarantee the accuracy of information posted by charities or the proper use of donated items.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Reject or remove any charity or need posting at our discretion</li>
              <li>Request additional documentation from charities</li>
              <li>Suspend or terminate accounts that violate these Terms</li>
              <li>Investigate reports of fraudulent or suspicious activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">7. Donations and Transactions</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">7.1 Nature of Donations</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All donations facilitated through NeighborSOS are in-kind donations (physical items) or monetary commitments for purchasing specific items. NeighborSOS does not process payments or handle monetary transactions.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">7.2 Tax Deductibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Donations made through NeighborSOS may be tax-deductible to the extent permitted by law. You are responsible for determining the tax deductibility of your donations and obtaining any necessary receipts from the receiving charity. NeighborSOS does not provide tax advice or issue tax receipts.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">7.3 Fulfillment</h3>
            <p className="text-gray-700 leading-relaxed">
              Donors are responsible for delivering or shipping donated items directly to charities according to the instructions provided. NeighborSOS is not responsible for failed deliveries, lost items, or delivery disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">8. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">8.1 Ownership</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Platform and all content, features, and functionality (including but not limited to text, graphics, logos, and software) are owned by NeighborSOS and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">8.2 Limited License</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for its intended charitable purposes. This license does not include the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Modify, copy, or create derivative works</li>
              <li>Reverse engineer or decompile the Platform</li>
              <li>Remove any proprietary notices</li>
              <li>Use the Platform for commercial purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">8.3 User Content</h3>
            <p className="text-gray-700 leading-relaxed">
              By posting content on the Platform (such as charity needs or family information), you grant NeighborSOS a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute that content for the purpose of operating and promoting the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">9. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">9.1 "As Is" Basis</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">9.2 No Guarantee</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              NeighborSOS does not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>The accuracy or completeness of information posted by charities</li>
              <li>That donors will fulfill their commitments</li>
              <li>That charities will use donations appropriately</li>
              <li>The quality or condition of donated items</li>
              <li>Uninterrupted or error-free operation of the Platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">9.3 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, NEIGHBORSOS AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your use or inability to use the Platform</li>
              <li>Any conduct or content of any third party on the Platform</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Failed or incomplete donations</li>
              <li>Disputes between donors and charities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless NeighborSOS and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you post on the Platform</li>
              <li>Your donations or interactions with charities or other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to the Platform at any time, with or without notice, for any reason, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Requests from law enforcement or government agencies</li>
              <li>Discontinuation of the Platform</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the Platform will immediately cease, but the provisions of these Terms that by their nature should survive termination will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">12. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">12.1 Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have a dispute with NeighborSOS, you agree to first contact us at <a href="mailto:info@neighborsos.org" className="text-blue-600 hover:underline">info@neighborsos.org</a> to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">12.2 Governing Law</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Minnesota, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">12.3 Jurisdiction</h3>
            <p className="text-gray-700 leading-relaxed">
              Any legal action or proceeding arising under these Terms shall be brought exclusively in the state or federal courts located in Ramsey County, Minnesota, and you consent to the jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">13. General Provisions</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">13.1 Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and NeighborSOS regarding the use of the Platform.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">13.2 Severability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">13.3 Waiver</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">13.4 Assignment</h3>
            <p className="text-gray-700 leading-relaxed">
              You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>NeighborSOS</strong></p>
              <p className="text-gray-700 mb-2">Saint Paul, Minnesota</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:info@neighborsos.org" className="text-blue-600 hover:underline">info@neighborsos.org</a></p>
              <p className="text-gray-700">Website: <a href="https://neighborsos.org" className="text-blue-600 hover:underline">neighborsos.org</a></p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 italic">
              By using NeighborSOS, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}