import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import front1 from "../../assets/front-1.jpg";
import front2 from "../../assets/front2.jpg";
import front3 from "../../assets/front3.png";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const testimonialsData = [
    {
      quote: "The online consultation saved me so much time. The doctor was attentive and professional. Highly recommended!",
      name: "Winson Henry",
      location: "California",
      image: "https://storage.googleapis.com/a1aa/image/85218bbb-a448-491a-6c4b-48aeec7a2911.jpg"
    },
    {
      quote: "Finding a blood donor was incredibly fast. This platform is literally a lifesaver during critical emergencies.",
      name: "Sarah Jenkins",
      location: "New York",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "I was able to raise funds for my surgery within weeks. The community support here is absolutely amazing.",
      name: "David Chen",
      location: "Texas",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
    },
  ];

  const services = [
    {
      title: "Online Consultation",
      description: "Talk to licensed doctors from the comfort of your home. Secure, private, and instant medical advice.",
      bgColor: "bg-gradient-to-br from-teal-400 to-emerald-500",
      icon: "💬",
      shadow: "shadow-teal-500/40",
      path: "/online-consultation"
    },
    {
      title: "Find Blood Donors",
      description: "Search and connect with blood donors near you quickly. Real-time location-based matching system.",
      bgColor: "bg-gradient-to-br from-rose-400 to-red-500",
      icon: "🩸",
      shadow: "shadow-red-500/40",
      path: "/blood-donor-search"
    },
    {
      title: "Medical Fund Support",
      description: "Raise funds for urgent medical needs. A transparent and trusted community-driven platform.",
      bgColor: "bg-gradient-to-br from-blue-400 to-indigo-500",
      icon: "💰",
      shadow: "shadow-blue-500/40",
      path: "/fund-donor-search"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/50 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/50 blur-3xl opacity-70"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left pt-20 lg:pt-0"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 font-semibold text-sm tracking-wide">
              Advanced Healthcare Platform
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6"
            >
              Access Healthcare, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                Save Lives.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Consult with top doctors, find blood donors locally, and support medical emergencies—all beautifully integrated into one seamless platform.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/online-consultation")}
                className="px-8 py-4 w-full sm:w-auto rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1"
              >
                Book Consultation
              </button>
              <button
                onClick={() => navigate("/fund-donor-search")}
                className="px-8 py-4 w-full sm:w-auto rounded-full bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-bold text-lg shadow-sm transition-all hover:-translate-y-1"
              >
                Explore Funding
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-teal-900/20">
              <img
                alt="Smiling Doctor"
                className="w-full h-full object-cover"
                src="https://storage.googleapis.com/a1aa/image/6e76b521-9194-447a-55ea-1ac97735a705.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-2xl">
                  👨‍⚕️
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Verified</p>
                  <p className="text-lg font-bold text-slate-900">Experts</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 hidden xl:flex border border-slate-100"
              >
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 text-2xl">
                  ❤️
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Active</p>
                  <p className="text-lg font-bold text-slate-900">Donors</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 text-lg">We bring essential healthcare solutions directly to you, making medical support more accessible than ever.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(service.path)}
                className={`relative group cursor-pointer rounded-[2rem] p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 ${service.bgColor} ${service.shadow}`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <span className="text-8xl leading-none">{service.icon}</span>
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner border border-white/20">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    {service.description}
                  </p>
                  <div className="mt-8 flex items-center text-white/90 font-bold group-hover:text-white transition-colors">
                    Learn more
                    <motion.span
                      className="ml-2 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* INFO CARDS SECTION (Alternating side-by-side) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12 space-y-32">
          {[
            {
              img: front1,
              title: "Consult Doctors Anywhere",
              subtitle: "Talk to Doctor In Home",
              p1: "Gone are the days of waiting rooms. Our platform lets you instantly connect with certified medical professionals from anywhere in the world.",
              p2: "Our system ensures your consultations are private, secure, and followed up with accurate digital prescriptions right in your account.",
              color: "text-blue-600"
            },
            {
              img: front2,
              title: "Community Medical Funding",
              subtitle: "Medical Fundraising",
              p1: "Facing a medical emergency can be overwhelming. Let the community support you when you need it most.",
              p2: "Whether it's for surgery, medication, or ongoing treatments, our transparent fundraising tools help you reach a network of generous donors.",
              color: "text-teal-600",
              reverse: true
            },
            {
              img: front3,
              title: "Join the Circle of Life",
              subtitle: "Blood Donation Network",
              p1: "Every drop counts. With just a few clicks, locate individuals who are looking for blood donors or request donors for yourself.",
              p2: "Our system uses hyper-local location matching to ensure critical blood needs are met as swiftly as possible.",
              color: "text-rose-600"
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className={`flex flex-col ${card.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              <motion.div
                variants={fadeInUp}
                className="w-full lg:w-1/2 relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-[2.5rem] transform ${card.reverse ? 'rotate-3' : '-rotate-3'} scale-105 -z-10`} />
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-2xl border-8 border-white"
                />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
              >
                <h4 className={`text-sm font-bold tracking-widest uppercase ${card.color}`}>
                  {card.subtitle}
                </h4>
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {card.p1}
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {card.p2}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="0,100 100,0 100,100" />
          </svg>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h4 className="text-teal-400 font-bold uppercase tracking-widest mb-2">Testimonials</h4>
            <h2 className="text-4xl font-extrabold mb-4">What Our Patients Say</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonialsData.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 relative flex flex-col justify-between"
              >
                <div className="text-teal-500 text-7xl absolute top-2 right-6 opacity-20 font-serif leading-none">"</div>
                <p className="mb-8 text-slate-300 text-lg leading-relaxed relative z-10 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 border-t border-slate-700/50 pt-6 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-full w-14 h-14 object-cover border-2 border-teal-500"
                  />
                  <div>
                    <p className="text-white font-bold text-lg">{testimonial.name}</p>
                    <p className="text-teal-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        {/* Subtle pattern instead of external URL that might fail to load */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/2 space-y-6"
            >
              <h2 className="text-4xl font-extrabold text-slate-900">Get In Touch</h2>
              <p className="text-lg text-slate-600">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl border border-teal-100 shadow-sm">📧</div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email Support</p>
                    <p className="font-bold text-lg">support@drnow.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-700">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl border border-teal-100 shadow-sm">📞</div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Call Us</p>
                    <p className="font-bold text-lg">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full md:w-1/2"
            >
              <form className="space-y-4">
                <div>
                  <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-700" />
                </div>
                <div>
                  <input type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-700" />
                </div>
                <div>
                  <textarea rows={4} placeholder="Your Message" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none placeholder-slate-400 font-medium text-slate-700"></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  Send Message
                  <span className="text-xl">🚀</span>
                </motion.button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
