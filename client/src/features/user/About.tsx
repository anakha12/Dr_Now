import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import healthcareImg from "../../assets/unnamed.jpg";
import { MessageCircle, Droplet, HeartHandshake, Users, CheckCircle, Activity } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const About = () => {
  const stats = [
    { number: "10K+", label: "Patients Helped", icon: Users, color: "blue" },
    { number: "500+", label: "Verified Doctors", icon: CheckCircle, color: "emerald" },
    { number: "2K+", label: "Blood Donors", icon: Droplet, color: "red" },
    { number: "1M+", label: "Consultations", icon: Activity, color: "purple" },
  ];

  const features = [
    {
      title: "Online Doctor Consultation",
      desc: "Consult certified doctors anytime from the comfort of your home.",
      icon: MessageCircle,
      color: "blue"
    },
    {
      title: "Blood Donor Network",
      desc: "Find blood donors near you instantly during emergencies.",
      icon: Droplet,
      color: "red"
    },
    {
      title: "Medical Fundraising",
      desc: "Raise funds quickly for urgent medical treatments.",
      icon: HeartHandshake,
      color: "emerald"
    },
  ];

  // Helper for colors
  const colorClasses: Record<string, { bg: string, text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    red: { bg: "bg-red-50", text: "text-red-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 md:p-10 max-w-7xl mx-auto w-full"
    >
      {/* Header - Reusing the style from UserProfile/Dashboard */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">About DrNow</h1>
          <p className="text-slate-500 font-medium">Transforming Healthcare With Technology and making it accessible to everyone.</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* MISSION */}
        <motion.section variants={fadeInUp} className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={healthcareImg}
                alt="healthcare"
                className="rounded-[1.5rem] shadow-2xl shadow-slate-300/50 object-cover w-full h-[300px] md:h-[400px]"
              />
            </motion.div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                <p>
                  We believe healthcare should be accessible to everyone, everywhere.
                  DrNow builds a digital healthcare ecosystem connecting patients,
                  doctors, donors, and supporters on one platform.
                </p>
                <p>
                  Using modern technology, we provide faster consultations,
                  easier access to blood donors, and community support for
                  healthcare emergencies.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section variants={fadeInUp}>
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Our Impact</h2>
            <p className="text-slate-500 font-medium mt-1">Numbers that speak for our commitment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const theme = colorClasses[stat.color] || colorClasses.blue;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col items-center justify-center text-center hover:border-teal-100 transition-colors group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-800 mb-1">
                    {stat.number}
                  </h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section variants={fadeInUp}>
          <div className="mb-8 mt-4">
            <h2 className="text-2xl font-extrabold text-slate-900">What We Offer</h2>
            <p className="text-slate-500 font-medium mt-1">Comprehensive healthcare solutions at your fingertips</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const theme = colorClasses[feature.color] || colorClasses.blue;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col items-start hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={fadeInUp}
          className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[2rem] p-12 text-center relative overflow-hidden group shadow-2xl shadow-teal-500/20 mt-8 max-w-4xl mx-auto"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Join Our Healthcare Community
            </h2>
            <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto font-medium">
              Whether you are a patient, doctor, or donor — together we can
              make healthcare more accessible and save lives.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-black/10 hover:shadow-xl transition-all"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
};

export default About;