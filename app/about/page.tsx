import { Users, Award, Target, Lightbulb, Heart, Shield } from "lucide-react"

export default function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: "Security First",
            description:
                "We prioritize the protection of your business, data, and interests with industry-leading security measures and protocols.",
        },
        {
            icon: Heart,
            title: "Customer Excellence",
            description:
                "Your success is our success. We go above and beyond to ensure exceptional service and outstanding results.",
        },
        {
            icon: Award,
            title: "Proven Excellence",
            description:
                "Our award-winning approach and industry recognition demonstrate our commitment to the highest standards.",
        },
        {
            icon: Users,
            title: "Collaborative Partnership",
            description:
                "We work as an extension of your team, fostering strong relationships built on trust and mutual success.",
        },
        {
            icon: Target,
            title: "Results-Driven",
            description:
                "Every strategy and solution is designed to deliver measurable outcomes that drive your business forward.",
        },
        {
            icon: Lightbulb,
            title: "Continuous Innovation",
            description:
                "We stay ahead of industry trends, constantly evolving our methods to provide cutting-edge solutions.",
        },
    ]

    const stats = [
        { number: "15+", label: "Years of Excellence" },
        { number: "1000+", label: "Satisfied Clients" },
        { number: "50+", label: "Industry Awards" },
        { number: "99.8%", label: "Client Satisfaction Rate" },
    ]

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-br from-slate-50 via-white to-purple-50 py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-8">
                            <Users className="w-4 h-4 mr-2" />
                            Our Story
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Award-Winning Excellence{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Since Day One
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built on a foundation of security, integrity, and customer-first principles, we've earned recognition as
                            industry leaders through our unwavering commitment to excellence and exceptional results.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Mission</h3>
                                    <p className="text-gray-700">
                                        To deliver exceptional value through secure, customer-centric solutions that drive measurable
                                        results. We believe every client deserves award-winning service and uncompromising excellence.
                                    </p>
                                </div>
                                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Vision</h3>
                                    <p className="text-gray-700">
                                        To be recognized globally as the premier provider of business excellence, setting industry standards
                                        for security, customer service, and innovative solutions that create lasting value.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                    <span className="text-gray-700">
                                        Award-winning track record with industry recognition for excellence and innovation
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                    <span className="text-gray-700">
                                        Security-first approach with comprehensive protection and risk management protocols
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                    <span className="text-gray-700">
                                        Customer-centric philosophy that puts your success and satisfaction above all else
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                    <span className="text-gray-700">
                                        Proven methodology that delivers consistent, measurable results across all industries
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            These principles guide every decision we make and every relationship we build
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group">
                                <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                                        <value.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Work Together?</h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Let's discuss how our expertise and values can help drive your business forward.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                            Get Started Today
                        </button>
                        <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
