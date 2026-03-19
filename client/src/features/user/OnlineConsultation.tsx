import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { getAllDoctors, getDepartments } from "../../services/userService";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages } from "../../constants/messages";
import logger from "../../utils/logger";

import front1 from "../../assets/front-1.jpg";
import front2 from "../../assets/front2.jpg";
import front3 from "../../assets/front3.png";
import type { Doctor } from "../../types/doctor";
import type { Department } from "../../types/department";

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

const OnlineConsultation = () => {
  const deptRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        logger.error(error);
        addNotification(Messages.ONLINE_CONSULTATION.FETCH_DOCTORS_FAILED, "ERROR");
      }
    };

    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        logger.error(error);
        addNotification(Messages.ONLINE_CONSULTATION.FETCH_DEPARTMENTS_FAILED, "ERROR");
      }
    };

    fetchDoctors();
    fetchDepartments();

    const deptInterval = setInterval(() => {
      const container = deptRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3500);

    const docInterval = setInterval(() => {
      const container = docRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => {
      clearInterval(deptInterval);
      clearInterval(docInterval);
    };
  }, [addNotification]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-white overflow-hidden">
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

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto pt-20"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 font-semibold text-sm tracking-wide">
              Virtual Healthcare
            </motion.div>
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6"
            >
              Consult Doctors <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                Online
              </span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Book secure video consultations with top diagnostic specialists and doctors from the comfort of your home. Fast, reliable, and entirely private.
            </motion.p>
            <motion.div variants={fadeInUp}>
               <button 
                 onClick={() => {
                   docRef.current?.scrollIntoView({ behavior: 'smooth' });
                 }}
                 className="px-8 py-4 w-full sm:w-auto rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1"
               >
                 Find a Doctor
               </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-24 bg-slate-50 relative z-10">
        <div className="container mx-auto px-6 md:px-12 space-y-32">
          {[
            {
              img: front1,
              title: "Talk to a Doctor from Home",
              subtitle: "Convenience First",
              p1: "No more long queues or waiting rooms. Connect instantly with certified medical experts through high-quality video links.",
              p2: "Enjoy private consultations via our secure video platform tailored for your peace of mind.",
              color: "text-teal-600",
              reverse: false
            },
            {
              img: front2,
              title: "Medical Fundraising",
              subtitle: "Community Support",
              p1: "Raise emergency funds for treatments and surgeries when you need them most.",
              p2: "We ensure fast, secure, and transparent donations, connecting you directly with generous community members.",
              color: "text-blue-600",
              reverse: true
            },
            {
              img: front3,
              title: "Join the Circle of Life",
              subtitle: "Blood Donation",
              p1: "Donate blood, save lives, and get matched instantly when in critical need.",
              p2: "Our smart location-matching algorithm ensures unparalleled speed and safety in critical moments.",
              color: "text-rose-600",
              reverse: false
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
                <div className={`absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-[2.5rem] transform ${card.reverse ? 'rotate-3' : '-rotate-3'} scale-105 -z-10`} />
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-[350px] md:h-[450px] object-cover rounded-[2.5rem] shadow-2xl border-8 border-white"
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

      {/* HOW IT WORKS / TIMELINE SECTION */}
      <section className="py-24 bg-white relative z-10 overflow-hidden">
        {/* Subtle Light Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#14b8a6 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <h4 className="text-teal-600 font-bold uppercase tracking-widest mb-2">How It Works</h4>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Your Journey to Wellness</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-blue-500 mx-auto rounded-full" />
          </motion.div>

          {/* Horizontal Timeline */}
          <div className="relative max-w-7xl mx-auto">
            {/* The Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-10 md:top-12 left-[5%] right-[5%] w-[90%] h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full z-0">
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 viewport={{ once: true }}
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 via-blue-500 to-teal-500 rounded-full shadow-sm"
               />
            </div>

            {/* The Connecting Line (Mobile) */}
            <div className="lg:hidden absolute left-10 top-[5%] bottom-[5%] w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent rounded-full z-0">
               <motion.div 
                 initial={{ height: 0 }}
                 whileInView={{ height: "100%" }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 viewport={{ once: true }}
                 className="absolute top-0 left-0 w-full bg-gradient-to-b from-teal-400 via-blue-500 to-teal-500 rounded-full shadow-sm"
               />
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-6 gap-12 lg:gap-4 relative z-10">
              {[
                { title: "Doctor", desc: "Select Specialist", icon: "👨‍⚕️" },
                { title: "Slot", desc: "Pick a Time", icon: "📅" },
                { title: "Payment", desc: "Secure Checkout", icon: "💳" },
                { title: "Confirm", desc: "Appointment Set", icon: "✅" },
                { title: "Consult", desc: "Meet Online", icon: "💻" },
                { title: "Prescription", desc: "Receive Meds", icon: "📝" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 100 }}
                  className="flex lg:flex-col items-center gap-6 lg:gap-0 group relative"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 border-slate-100 group-hover:border-teal-300 flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-slate-200/50 relative z-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-teal-500/20 shrink-0">
                    <span className="relative z-10 group-hover:scale-110 transition-transform">{step.icon}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                      {i + 1}
                    </div>
                  </div>

                  <div className="text-left lg:text-center mt-0 lg:mt-6 bg-white/60 lg:bg-transparent px-4 py-2 lg:p-0 rounded-xl backdrop-blur-sm lg:backdrop-filter-none border border-slate-100 lg:border-none shadow-sm lg:shadow-none w-full lg:w-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{step.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel - Departments */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h4 className="text-teal-600 font-bold uppercase tracking-widest mb-2">Specialties</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Services We Provide</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mt-6" />
          </motion.div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div
              ref={deptRef}
              className="flex gap-8 overflow-x-auto py-8 px-4 scroll-smooth hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {departments.map((dept) => (
                <motion.div
                  key={dept.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="min-w-[300px] bg-slate-50 border border-slate-100 shadow-lg shadow-slate-200/50 p-8 rounded-[2rem] text-center hover:shadow-2xl hover:border-teal-100 transition-all duration-300 flex-shrink-0 group"
                >
                  <div className="w-20 h-20 bg-teal-50 group-hover:bg-teal-500 group-hover:text-white mx-auto mb-6 flex items-center justify-center rounded-[1.5rem] text-4xl transition-colors duration-300 shadow-sm border border-teal-100 group-hover:border-teal-400">
                    🩺
                  </div>
                  <h3 className="text-slate-900 font-extrabold text-2xl mb-3">{dept.Departmentname}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{dept.Description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Carousel */}
      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6"
          >
            <div>
              <h4 className="text-teal-600 font-bold uppercase tracking-widest mb-2">Our Experts</h4>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Meet Our Doctors</h2>
            </div>
            <button 
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-bold shadow-sm transition-all hover:text-teal-600 hover:shadow-md"
            >
              View All Doctors →
            </button>
          </motion.div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div
              ref={docRef}
              className="flex gap-8 overflow-x-auto py-8 px-4 scroll-smooth hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {doctors.map((doc) => (
                <motion.div
                  key={doc.id}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/consult/doctor/${doc.id}`)}
                  className="min-w-[280px] flex-shrink-0 bg-white shadow-lg shadow-slate-200/50 rounded-[2rem] p-8 text-center hover:shadow-2xl cursor-pointer transition-all duration-300 border border-slate-100 group"
                >
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-teal-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <img
                      src={doc.profileImage}
                      alt={doc.name}
                      className="relative w-32 h-32 rounded-full object-cover mx-auto shadow-md border-4 border-white group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 capitalize mb-1">{doc.name}</h3>
                  <p className="text-md font-bold text-teal-600 mb-4">{doc.specialization}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-600 text-sm font-medium">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Exp</span>
                      <span>{doc.yearsOfExperience} yrs</span>
                    </div>
                    <div className="w-1 h-8 bg-slate-100 rounded-full"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Fee</span>
                      <span className="text-slate-900 font-bold">₹{doc.consultFee}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="0,100 100,0 100,100"/>
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
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Patient Experiences</h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mt-6" />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={`testimonial-${i}`}
                variants={fadeInUp}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-[2rem] p-8 relative flex flex-col justify-between hover:bg-slate-800/80 transition-colors duration-300"
              >
                <div className="text-teal-500 text-7xl absolute top-4 right-6 opacity-20 font-serif leading-none">"</div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  ★★★★★
                </div>
                <p className="mb-8 text-slate-300 text-lg leading-relaxed relative z-10">
                  "Excellent consultation! The doctor listened patiently to all my concerns and provided the exact right advice. Highly recommended platform."
                </p>
                <div className="flex items-center gap-4 border-t border-slate-700/50 pt-6 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-bold text-xl">
                    P{i}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Patient {i}</p>
                    <p className="text-teal-400 text-sm">Verified Patient</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OnlineConsultation;
