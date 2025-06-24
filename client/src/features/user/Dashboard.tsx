import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import front1 from "../../assets/front-1.jpg";
import front2 from "../../assets/front2.jpg";
import front3 from "../../assets/front3.png";

function Dashboard() {
  
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const testimonialsData = [
    {
      quote:
        "It is a long established fact that by the readable content of a lot layout...",
      name: "Winson Henry",
      location: "California",
    },
    {
      quote:
        "It is a long established fact that by the readable content of a lot layout...",
      name: "Winson Henry",
      location: "California",
    },
    {
      quote:
        "It is a long established fact that by the readable content of a lot layout...",
      name: "Winson Henry",
      location: "California",
    },
  ];

  const services = [
    {
      title: "Online Doctor Consultation",
      description:
        "Talk to licensed doctors from the comfort of your home...",
      bgColor: "bg-teal-300",
      icon: "💬",
    },
    {
      title: "Find a Blood Donor",
      description:
        "Search and connect with blood donors near you...",
      bgColor: "bg-teal-600",
      icon: "🩸",
    },
    {
      title: "Medical Emergency Fund Support",
      description:
        "Raise funds for urgent medical needs...",
      bgColor: "bg-teal-300",
      icon: "💰",
    },
  ];

  return (
    <div className="text-gray-900">
      {/* Hero Section (Full Width, no side padding) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-gradient-to-r from-teal-400 to-cyan-400 flex flex-col md:flex-row items-center justify-center gap-8 py-12"
      >
        <img
          alt="doctor"
          className="rounded-md w-full max-w-sm"
          src="https://storage.googleapis.com/a1aa/image/6e76b521-9194-447a-55ea-1ac97735a705.jpg"
        />
        <h1 className="text-3xl font-extrabold text-blue-900 max-w-xl text-center md:text-left px-4">
          Access healthcare, save lives, and support medical needs — all in one place.
        </h1>
      </motion.section>

      {/* All Other Sections with Padding */}
      <div className="px-4 md:px-12">
        {/* About Us */}
        <section className="bg-white py-12 px-6 text-center">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">Who We Are</h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-sm">
            We are a dedicated platform focused on transforming how people access healthcare...
          </p>
        </section>

        {/* Services */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (index === 0) navigate("/user/online-consultation"); 
                if  (index===1) navigate("/user/blood-donor-search");
                if  (index===2) navigate("/user/fund-donor-search");
              }}
              className={`${service.bgColor} rounded-lg p-6 text-white shadow-md`}
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </motion.div>
          ))}
        </section>

        {/* Informational Cards */}
        <section className="p-6 bg-white space-y-16">
          {/* Card 1 */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={front1}
              alt="Doctor Consultation"
              className="w-full md:w-[40%] max-h-[300px] rounded-md object-cover"
            />
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Talk to Doctor In Home</h3>
              <p className="text-gray-600 text-sm">Gone are the days of waiting rooms...</p>
              <p className="text-gray-600 text-sm">Our system ensures private, secure...</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6">
            <img
              src={front2}
              alt="Medical Fundraising"
              className="w-full md:w-[40%] max-h-[300px] rounded-md object-cover"
            />
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Medical Fundraising</h3>
              <p className="text-gray-600 text-sm">Facing a medical emergency can be overwhelming...</p>
              <p className="text-gray-600 text-sm">Whether it's for surgery, medication...</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={front3}
              alt="Blood Donation"
              className="w-full md:w-[40%] max-h-[300px] rounded-md object-cover"
            />
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Join the Circle of Life</h3>
              <p className="text-gray-600 text-sm">Every drop counts. With just a few clicks...</p>
              <p className="text-gray-600 text-sm">Our system uses location-based matching...</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="p-6 bg-gray-50">
          <div className="text-center mb-8">
            <p className="text-xs text-gray-600">Testimonial</p>
            <h3 className="text-blue-900 font-semibold text-xl">WHAT OUR PATIENTS SAY</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial, idx) => (
              <motion.div
                key={idx}
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.2 * idx }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <p className="mb-4 text-gray-700 text-sm">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://storage.googleapis.com/a1aa/image/85218bbb-a448-491a-6c4b-48aeec7a2911.jpg"
                    alt={testimonial.name}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <div>
                    <p className="text-teal-700 font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Us */}
        <section className="bg-white px-6 py-12">
          <h2 className="text-center text-2xl text-teal-700 font-bold mb-4">Contact Us</h2>
          <form className="max-w-xl mx-auto grid gap-4">
            <input type="text" placeholder="Your Name" className="border p-2 rounded w-full" />
            <input type="email" placeholder="Your Email" className="border p-2 rounded w-full" />
            <textarea rows={5} placeholder="Your Message" className="border p-2 rounded w-full" />
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
