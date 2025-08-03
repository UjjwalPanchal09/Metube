import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="privacy-policy p-2 max-w-4xl mx-auto text-white mt-2">
      <h1 className="text-3xl md:text-5xl text-center font-bold mb-12">Privacy Policy – MeTube</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">📘 1. Information We Collect</h2>
      <h3 className="font-semibold">1.1 Personal Information</h3>
      <ul className="list-disc ml-6 mb-2">
        <li>Name </li>
        <li>Email address</li>
        <li>Password (encrypted using bcrypt)</li>
      </ul>

      <h3 className="font-semibold">1.2 Content and Usage Data</h3>
      <ul className="list-disc ml-6 mb-2">
        <li>Uploaded videos and metadata (title, description, etc.)</li>
        <li>Comments and replies</li>
        <li>Likes/dislikes</li>
        <li>Subscriptions</li>
        <li>Interaction logs (e.g., watch history)</li>
      </ul>

      <h3 className="font-semibold">1.3 Device & Technical Data</h3>
      <ul className="list-disc ml-6 mb-2">
        <li>IP address</li>
        <li>Browser and device info</li>
        <li>Access time and activity logs</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">🔐 2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Secure authentication and login</li>
        <li>Improve platform features</li>
        <li>Enable interactions (comments, likes, subscriptions)</li>
        <li>Personalize content</li>
        <li>Prevent fraud or abuse</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">⚖️ 3. Legal Basis for Processing</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Consent</li>
        <li>Contractual necessity</li>
        <li>Legal obligation</li>
        <li>Legitimate interests</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">🔄 4. Sharing and Disclosure</h2>
      <p>We do <strong>not</strong> sell or rent your personal data. We may share it with:</p>
      <ul className="list-disc ml-6 mb-2">
        <li>Service providers (e.g., cloud storage, analytics)</li>
        <li>Authorities when required by law</li>
        <li>Security purposes to protect users and the platform</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">🛡️ 5. Data Security</h2>
      <ul className="list-disc ml-6 mb-2">
        <li>Password hashing (bcrypt)</li>
        <li>JWT-based authentication</li>
        <li>HTTPS encryption</li>
        <li>Role-based access control</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">⏳ 6. Data Retention</h2>
      <p>We retain your data as long as necessary to provide our services, or until your account is deleted.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🌍 7. Your Rights</h2>
      <p>You may have rights to access, correct, delete, or restrict your personal data. Contact us at:</p>
      <p><strong>Email:</strong> [your@email.com]</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🧒 8. Children’s Privacy</h2>
      <p>MeTube is not intended for children under 13. We do not knowingly collect data from children.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">📩 9. Contact Us</h2>
      <p>Questions? Reach out to:</p>
      <p><strong>Email:</strong> metube@gmail.com</p>
      <p><strong>Address:</strong> Metube headoffice, Silicon valley, India</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🔁 10. Changes to This Policy</h2>
      <p>We may update this policy. Please review it regularly for updates.</p>
    </div>
  );
}

export default PrivacyPolicy;
