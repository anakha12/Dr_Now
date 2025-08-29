import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getAllDoctors, getDepartments } from "../../services/userService";

import front1 from "../../assets/front-1.jpg";
import front2 from "../../assets/front2.jpg";
import front3 from "../../assets/front3.png";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  yearsOfExperience: string;
  consultFee: number;
}

interface Department {
  id: string;
  Departmentname: string;
  Description: string;
}

const OnlineConsultation = () => {
  const deptRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        console.log("data", data)
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
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
          container.scrollBy({ left: 260, behavior: "smooth" });
        }
      }
    }, 3000);

    const docInterval = setInterval(() => {
      const container = docRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 260, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => {
      clearInterval(deptInterval);
      clearInterval(docInterval);
    };
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-500 text-white py-20 text-center" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">Consult Doctors Online</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Book secure video consultations with top doctors from the comfort of your home.
        </p>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-white space-y-20">
        {[front1, front2, front3].map((img, idx) => {
          const isReverse = idx === 1;
          const titles = [
            "Talk to a Doctor from Home",
            "Medical Fundraising",
            "Join the Circle of Life",
          ];
          const descriptions = [
            ["No more long queues or waiting rooms.", "Private consultations via secure video platform."],
            ["Raise emergency funds for treatments and surgeries.", "We ensure fast, secure, and verified donations."],
            ["Donate blood. Save lives. Get matched instantly.", "Smart location-matching ensures speed and safety."],
          ];

          return (
            <div
              key={titles[idx]}
              className={`flex flex-col md:flex-row${isReverse ? "-reverse" : ""} items-center gap-10`}
              data-aos="fade-up"
            >
              <img
                src={img}
                alt={titles[idx]}
                className="w-full md:w-[40%] max-h-[300px] rounded-lg shadow-lg object-cover"
              />
              <div className="text-center md:text-left space-y-4">
                <h3 className="text-2xl font-bold text-teal-800">{titles[idx]}</h3>
                {descriptions[idx].map((line) => (
                  <p key={line} className="text-gray-600 text-base">{line}</p>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Services Carousel - Departments */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-gray-100 relative">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-10">Services We Provide</h2>
        <div
          ref={deptRef}
          className="flex gap-6 overflow-x-auto px-2 scroll-smooth"
        >
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="min-w-[250px] bg-white border border-gray-200 shadow-md p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 flex-shrink-0"
              data-aos="zoom-in-up"
            >
              <div className="w-14 h-14 bg-teal-50 mx-auto mb-4 flex items-center justify-center rounded-full border border-teal-300 text-2xl">
                🩺
              </div>
              <h3 className="text-teal-900 font-semibold text-xl mb-2">{dept.Departmentname}</h3>
              <p className="text-gray-600 text-sm">{dept.Description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Carousel */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-white relative">
        <h2
          onClick={() => navigate("/user/doctors")}
          className="text-3xl font-bold text-center text-teal-800 mb-10 cursor-pointer hover:underline"
        >
          Meet Our Doctors
        </h2>

        <div
          ref={docRef}
          className="flex gap-6 overflow-x-auto px-2 scroll-smooth"
        >
          {doctors
            .map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/user/consult/doctor/${doc.id}`)}
                className="min-w-[260px] flex-shrink-0 bg-gray-50 shadow-md rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300"
                data-aos="flip-left"
              >
                <img
                  src={doc.profileImage}
                  alt={doc.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow"
                />
                <h3 className="text-lg font-bold text-blue-900 capitalize">{doc.name}</h3>
                <p className="text-sm text-teal-700">{doc.specialization}</p>
                <p className="text-gray-600 text-sm mt-2">
                  {doc.yearsOfExperience} years experience • ₹{doc.consultFee} fee
                </p>
              </div>
            ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6 md:px-16 lg:px-24">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-10">What Our Patients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={`testimonial-${i}`}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
            >
              <p className="text-sm text-gray-700 italic mb-3">
                “Excellent consultation! Doctor listened patiently and gave the right advice.”
              </p>
              <p className="text-sm font-semibold text-teal-600">— Patient {i}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OnlineConsultation;
