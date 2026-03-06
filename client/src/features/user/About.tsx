import { motion } from "framer-motion";
import healthcareImg from "../../assets/unnamed.jpg";

const About = () => {
  const stats = [
    { number: "10K+", label: "Patients Helped" },
    { number: "500+", label: "Verified Doctors" },
    { number: "2K+", label: "Blood Donors" },
    { number: "1M+", label: "Consultations Done" },
  ];

  const features = [
    {
      title: "Online Doctor Consultation",
      desc: "Consult certified doctors anytime from the comfort of your home.",
      icon: "💬",
    },
    {
      title: "Blood Donor Network",
      desc: "Find blood donors near you instantly during emergencies.",
      icon: "🩸",
    },
    {
      title: "Medical Fundraising",
      desc: "Raise funds quickly for urgent medical treatments.",
      icon: "💰",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">

      {/* HERO */}
      <section className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-20 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
        >
          Transforming Healthcare With Technology
        </motion.h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base opacity-90">
          DrNow connects patients with doctors, blood donors, and medical
          support services. Our mission is to make healthcare accessible,
          reliable, and fast for everyone.
        </p>
      </section>

      {/* MISSION */}
      <section className="py-16 px-4 md:px-16 grid md:grid-cols-2 gap-10 items-center">

        <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src={healthcareImg}
            alt="healthcare"
            className="rounded-lg shadow-lg"
            />
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Our Mission
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            We believe healthcare should be accessible to everyone, everywhere.
            DrNow builds a digital healthcare ecosystem connecting patients,
            doctors, donors, and supporters on one platform.
          </p>

          <p className="text-gray-600 text-sm">
            Using modern technology, we provide faster consultations,
            easier access to blood donors, and community support for
            healthcare emergencies.
          </p>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-center text-3xl font-bold text-teal-700 mb-10">
          Our Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-gray-50 p-6 rounded-lg shadow"
            >
              <h3 className="text-3xl font-bold text-teal-600">
                {stat.number}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4 md:px-16">
        <h2 className="text-center text-3xl font-bold text-blue-900 mb-12">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>

              <h3 className="font-semibold text-teal-700 mb-2">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-600 text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Join Our Healthcare Community
        </h2>

        <p className="max-w-xl mx-auto text-sm mb-6">
          Whether you are a patient, doctor, or donor — together we can
          make healthcare more accessible and save lives.
        </p>

        <button className="bg-white text-teal-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

    </div>
  );
};

export default About;