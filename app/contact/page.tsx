"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            details: "hello@yourbusiness.com",
            description: "Secure, confidential communication",
        },
        {
            icon: Phone,
            title: "Call Us",
            details: "+1 (555) 123-4567",
            description: "Award-winning customer service",
        },
        {
            icon: MapPin,
            title: "Visit Us",
            details: "123 Business Excellence Blvd",
            description: "Secure, professional environment",
        },
        {
            icon: Clock,
            title: "Business Hours",
            details: "Mon-Fri: 8am-6pm",
            description: "Extended support available",
        },
    ]

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-slate-50 via-white to-green-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium mb-8">
                        <Mail className="w-4 h-4 mr-2" />
                        Get In Touch
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Experience Award-Winning{" "}
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Service Today
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Ready to discover what sets us apart? Connect with our award-winning team and experience the
                        customer-centric approach that has earned us industry recognition and client loyalty.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Start Your Success Story</h2>

                            {isSubmitted && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="text-green-800">Thank you! Your message has been sent successfully.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                        placeholder="Your company name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="sales">Sales & Pricing</option>
                                        <option value="support">Technical Support</option>
                                        <option value="partnership">Partnership Opportunities</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Tell us about your project or how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Connect With Excellence</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Our award-winning customer service team is ready to help. Choose your preferred method of contact, and
                                experience the difference that customer-centric service makes.
                            </p>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <info.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                                            <p className="text-green-600 font-medium mb-1">{info.details}</p>
                                            <p className="text-gray-600 text-sm">{info.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Response Guarantee</h3>
                                <p className="text-gray-700 text-sm">
                                    We typically respond to all inquiries within 2 hours during business hours. For urgent matters, please
                                    call us directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-600">Quick answers to common questions</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">What makes your service award-winning?</h3>
                            <p className="text-gray-600">
                                Our combination of security-first practices, customer-centric approach, and proven results has earned us
                                multiple industry awards and 99.8% client satisfaction.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                How do you ensure security and confidentiality?
                            </h3>
                            <p className="text-gray-600">
                                We implement bank-level security protocols, regular assessments, and strict confidentiality agreements
                                to protect your business interests at all times.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">What industries do you serve?</h3>
                            <p className="text-gray-600">
                                Our proven methodology adapts to any industry. From startups to Fortune 500 companies, we deliver
                                customized solutions that drive measurable results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
