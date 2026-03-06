import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-12">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-bold text-teal-700">Contact Us</h1>
        <p className="text-gray-600 mt-3">
          Have questions or need support? We're here to help.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Get in Touch
          </h2>

          <p className="text-gray-600 text-sm mb-3">
            📍 Location: Kerala, India
          </p>

          <p className="text-gray-600 text-sm mb-3">
            📧 Email: support@healthconnect.com
          </p>

          <p className="text-gray-600 text-sm">
            📞 Phone: +91 98765 43210
          </p>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded p-2"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded p-2"
          />

          <textarea
            rows={5}
            placeholder="Your Message"
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;