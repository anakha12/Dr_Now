import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { MapPin, Mail, Phone, Send } from "lucide-react";

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

const Contact = () => {
  const contactMethods = [
    {
      title: "Location",
      value: "Kerala, India",
      icon: MapPin,
      color: "blue"
    },
    {
      title: "Email",
      value: "support@healthconnect.com",
      icon: Mail,
      color: "emerald"
    },
    {
      title: "Phone",
      value: "+91 98765 43210",
      icon: Phone,
      color: "purple"
    }
  ];

  // Helper for colors
  const colorClasses: Record<string, { bg: string, text: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 md:p-10 max-w-7xl mx-auto w-full"
    >
      {/* Header - Reusing style from UserProfile/About */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Contact Us</h1>
          <p className="text-slate-500 font-medium">Have questions or need support? We're here to help.</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-5 gap-10"
      >
        {/* Contact Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Get in Touch</h2>
          </motion.div>

          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            const theme = colorClasses[method.color] || colorClasses.blue;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex items-center gap-6 hover:border-teal-100 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{method.title}</h3>
                  <p className="text-lg font-bold text-slate-800">{method.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form */}
        <motion.div variants={fadeInUp} className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Send a Message</h2>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Message</label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder:text-slate-400 font-medium resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl px-6 py-4 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;