export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2d3436] mb-6">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-6">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to NeighborSOS ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://neighborsos.org" className="text-blue-600 hover:underline">neighborsos.org</a> and use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using NeighborSOS, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our services, we may collect the following personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Donors:</strong> Name, email address, donation amounts, and delivery preferences</li>
              <li><strong>Charities:</strong> Organization name, contact information, EIN/tax ID, physical address, and bank details for verification</li>
              <li><strong>Families:</strong> Family size, needs, and contact information (provided by partnering charities)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you visit our website:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>To facilitate donations and match donors with urgent charity needs</li>
              <li>To communicate with donors and charities about donations, deliveries, and updates</li>
              <li>To verify the legitimacy of registered charities</li>
              <li>To process and fulfill family sponsorships</li>
              <li>To send email notifications about claimed needs, sponsorships, and platform updates</li>
              <li>To improve our website and services</li>
              <li>To analyze usage patterns and optimize user experience</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.1 With Charities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you commit to donating an item or sponsoring a family, we share your name and email address with the receiving charity so they can coordinate delivery and send you instructions.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.2 With Other Donors (Split Sponsorships)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you use our "Split with Friends" feature, we will send invitation emails to the email addresses you provide, including your name and a personal message if you include one.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.3 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with third-party service providers who assist us in operating our platform, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Email service providers (for sending notifications)</li>
              <li>Database and hosting services (Supabase, Vercel)</li>
              <li>Analytics providers (Google Analytics)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.4 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to valid legal requests, such as subpoenas, court orders, or government inquiries.
            </p>

            <h3 className="text-xl font-semibold text-[#2d3436] mb-3">4.5 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Secure Socket Layer (SSL) encryption for data transmission</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails by clicking the unsubscribe link in any email</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, please contact us at <a href="mailto:info@neighborsos.org" className="text-blue-600 hover:underline">info@neighborsos.org</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">8. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites and social media platforms. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              NeighborSOS is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">10. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When your information is no longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">11. California Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, contact us at <a href="mailto:info@neighborsos.org" className="text-blue-600 hover:underline">info@neighborsos.org</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a new "Effective Date." We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif text-[#2d3436] mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
              By using NeighborSOS, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}