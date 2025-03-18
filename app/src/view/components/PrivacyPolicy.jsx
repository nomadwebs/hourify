import React from 'react'
import { Button } from '../../library/index'

export default function PrivacyPolicy({ onHomeClick }) {
    const handleHomeClick = event => {
        event.preventDefault()
        onHomeClick()
    }

    return (
        <main className="flex flex-col items-center bg-color_backgroundGrey w-full flex-grow pt-12 pb-12">
            <div className="w-[80%] max-w-4xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Introduction</h2>
                    <p className="mb-4">
                        This Privacy Policy outlines how Hourify collects, uses, discloses, and protects the personal information of users of the Hourify time-tracking application. Hourify is designed to help freelancers and service providers manage time and session units for their clients. By using Hourify, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                    <p className="mb-2">
                        We collect the following types of information to provide and improve our services:
                    </p>

                    <h3 className="text-lg font-medium mt-3 mb-1">Personal Information:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Name, email address, username, and password.</li>
                        <li>Contact details (e.g., address, phone number).</li>
                        <li>Professional details (e.g., biography, website, legal name).</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Usage Data:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Information about how you use the app (e.g., session logs, time tracking data, activity history).</li>
                        <li>Device information (e.g., IP address, browser type, operating system).</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Client and Pack Information:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Details about clients and their purchased packs (e.g., client name, pack description, remaining hours/units).</li>
                        <li>Communication data (e.g., messages between users).</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Automatically Collected Data:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Cookies and similar technologies to enhance user experience and analyze app performance.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                    <p className="mb-2">
                        We use the collected information for the following purposes:
                    </p>

                    <h3 className="text-lg font-medium mt-3 mb-1">Service Provision:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>To create and manage user accounts.</li>
                        <li>To enable time and session tracking for freelancers and clients.</li>
                        <li>To facilitate communication between users.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Notifications:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>To send automated email notifications (e.g., low remaining hours).</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Improvement and Analytics:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>To analyze app usage and improve functionality.</li>
                        <li>To personalize user experience and provide relevant features.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Legal Compliance:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>To comply with applicable laws and regulations.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
                    <p className="mb-2">
                        We may share your information in the following circumstances:
                    </p>

                    <h3 className="text-lg font-medium mt-3 mb-1">With Clients and Freelancers:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Information about packs, session tracking, and communication is shared between freelancers and their clients.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">With Third-Party Service Providers:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Email service providers (e.g., NodeMailer) to send notifications.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Legal Requirements:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>If required by law or to protect our rights and safety.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Business Transfers:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>In the event of a merger, acquisition, or sale of assets, user information may be transferred to the new entity.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                    <p className="mb-2">
                        We implement technical and organizational measures to protect your information, including:
                    </p>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Encryption of sensitive data (e.g., passwords).</li>
                        <li>Regular security audits and updates.</li>
                        <li>Access controls to limit who can view or modify your data.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
                    <p className="mb-2">
                        You have the following rights regarding your personal information:
                    </p>

                    <h3 className="text-lg font-medium mt-3 mb-1">Access and Correction:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>You can access and update your personal information through your account settings.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Data Deletion:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>You can request the deletion of your account and associated data, subject to legal obligations.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Opt-Out of Notifications:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>You can manage your notification preferences in the app settings.</li>
                    </ul>

                    <h3 className="text-lg font-medium mt-3 mb-1">Data Portability:</h3>
                    <ul className="list-disc ml-6 mb-3">
                        <li>You can request a copy of your data in a structured, machine-readable format.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Cookies and Tracking Technologies</h2>
                    <p className="mb-2">
                        We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Enhance user experience (e.g., remembering login details).</li>
                        <li>Analyze app usage and performance.</li>
                    </ul>
                    <p>You can manage cookie preferences through your browser settings.</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. International Data Transfers</h2>
                    <p className="mb-4">
                        Your data is stored on a Virtual Private Server (VPS) provided by Hostinger, located in Paris, France. If you are located outside the European Union (EU), your data may be transferred to and processed in countries with different data protection laws. We ensure adequate safeguards are in place to protect your information.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">8. Data Ownership</h2>
                    <p className="mb-4">
                        The owner of the database is Francisco Sánchez Gil, with the following contact information:
                    </p>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Address: Calle Vliadomat 114, Barcelona, 08015, Spain.</li>
                        <li>Email: hola@nomadwebs.com</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">9. Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                        We may update this Privacy Policy periodically. You will be notified of significant changes via email or through the app.
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <ul className="list-disc ml-6 mb-3">
                        <li>Email: hola@nomadwebs.com</li>
                        <li>Address: Calle Vliadomat 114, Barcelona, 08015, Spain.</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
                    <p className="mb-4">
                        This Privacy Policy is governed by the laws of Spain, and any disputes will be resolved in accordance with these laws.
                    </p>
                </div>

                <div className="flex justify-center mt-8">
                    <a
                        href=""
                        title="Go back home"
                        onClick={handleHomeClick}
                        className="text-color_primary hover:underline"
                    >
                        Back to home
                    </a>
                </div>
            </div>
        </main>
    )
} 