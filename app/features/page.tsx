import Link from "next/link"
import { Check, Shield, Heart, Star, Zap, Globe, Rocket } from "lucide-react"

export default function FeaturesPage() {
    const features = [
        {
            icon: Shield,
            title: "Uncompromising Security",
            description:
                "Your trust is our foundation. We implement the highest security standards to protect your interests and ensure complete confidentiality.",
            benefits: ["Bank-level security protocols", "Regular security assessments", "Compliance with industry standards"],
        },
        {
            icon: Heart,
            title: "Customer-Centric Excellence",
            description:
                "Every decision we make puts your needs first. Our personalized approach ensures solutions that truly fit your unique requirements.",
            benefits: ["Dedicated account management", "Tailored solutions", "24/7 customer support"],
        },
        {
            icon: Star,
            title: "Award-Winning Results",
            description:
                "Our track record speaks for itself. Industry recognition and client success stories demonstrate our commitment to exceptional outcomes.",
            benefits: ["Industry awards & recognition", "Proven client success rates", "Measurable ROI improvements"],
        },
        {
            icon: Zap,
            title: "Efficient Operations",
            description:
                "Streamlined processes and optimized workflows ensure you receive maximum value with minimal disruption to your business.",
            benefits: ["Streamlined processes", "Quick turnaround times", "Minimal business disruption"],
        },
        {
            icon: Globe,
            title: "Comprehensive Solutions",
            description:
                "From initial consultation to ongoing support, we provide end-to-end solutions that address all aspects of your business needs.",
            benefits: ["Full-service approach", "Integrated solutions", "Ongoing support & maintenance"],
        },
        {
            icon: Rocket,
            title: "Innovation Leadership",
            description:
                "Stay ahead of the competition with cutting-edge approaches and innovative strategies that drive sustainable growth.",
            benefits: ["Latest industry innovations", "Future-ready solutions", "Competitive advantage"],
        },
    ]

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-medium mb-8">
                        <Star className="w-4 h-4 mr-2" />
                        Premium Features
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Comprehensive Solutions for{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Every Business
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Discover our award-winning approach to business excellence. From security-first practices to
                        customer-centric service, we deliver solutions that drive real results and sustainable growth.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {features.map((feature, index) => (
                            <div key={index} className="group">
                                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                                <feature.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                            <p className="text-gray-600 mb-6">{feature.description}</p>
                                            <ul className="space-y-2">
                                                {feature.benefits.map((benefit, benefitIndex) => (
                                                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                                                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Excellence?</h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join hundreds of satisfied clients who trust us to deliver exceptional results and outstanding service.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                            Start Free Trial
                        </button>
                        <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-600 transition-colors">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
