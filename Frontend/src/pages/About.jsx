import React from "react";
import { motion } from "framer-motion";

// Animation variants for staggered effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Stagger animations for children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  return (
    <div className="bg-gray-400 py-12">
      <div className="container mx-auto px-4">
        {/* New Content Added at the Top with Background Animated Image */}
        <motion.div
          className="relative h-[400px] flex items-center justify-center mb-16 overflow-hidden rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background Image with Zoom Animation */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          {/* Content */}
          <motion.div
            className="relative text-center text-white max-w-2xl mx-auto px-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.h2
              className="text-4xl font-bold mb-6"
              variants={childVariants}
            >
              About Us
            </motion.h2>
            <motion.p
              className="text-lg mb-8"
              variants={childVariants}
            >
              Welcome to <span className="text-blue-400 font-semibold">LeaseLink</span>, your trusted platform for finding the perfect rental property. Whether you're searching for an apartment, house, or commercial space, we make renting seamless, secure, and hassle-free.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Section 1: Image on Left, Text on Right */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row items-center gap-8 p-16"
        >
          <motion.div
            className="w-full lg:w-1/3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="https://cdn.theonsitemanager.com.au/uploads/cache/WM-01_1739235872_800x600_exact_9bc964816e7d8309c08233f331874a5c.jpg"
              alt="About Us"
              className="rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className="w-full lg:w-1/3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.h2 className="text-4xl font-bold mb-4" variants={childVariants}>
              Who We Are
            </motion.h2>
            <motion.p className="text-gray-100 mb-4" variants={childVariants}>
              At LeaseLink, we are passionate about providing high-quality rental services to our customers. Whether you're looking for apartments, houses, or commercial spaces, we've got you covered. Our mission is to make renting easy, affordable, and convenient for everyone.
            </motion.p>
            <motion.p className="text-gray-100" variants={childVariants}>
              With years of experience in the industry, we pride ourselves on offering top-notch properties and exceptional customer service. Join us on our journey to redefine the rental experience!
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Section 2: Text on Left, Image on Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row-reverse items-center gap-8 p-16"
        >
          <motion.div
            className="w-full lg:w-1/3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="https://media.licdn.com/dms/image/v2/D4E12AQEwEwxlmcvmXQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1686046077674?e=2147483647&v=beta&t=kUGBwGOp84NNRbmb-il2gn2dhmlNIYl_VvzBCnk84o8"
              alt="Our Mission"
              className="rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className="w-full lg:w-1/3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.h1 className="text-4xl font-bold mb-4" variants={childVariants}>
              Our Mission
            </motion.h1>
            <motion.p className="text-gray-100 mb-4" variants={childVariants}>
              Our mission is to simplify the rental process and provide our customers with access to the best properties at competitive prices. We believe in transparency, reliability, and customer satisfaction above all else.
            </motion.p>
            <motion.p className="text-gray-100" variants={childVariants}>
              Whether you're renting for a day, a week, or longer, we ensure that every property meets our high standards of quality and performance.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Section 3: Image on Left, Text on Right */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row items-center gap-16 p-16"
        >
          <motion.div
            className="w-full lg:w-1/3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src="https://discover.certilogo.com/cdn/shop/articles/seamless_customer_experience_1024x1024.jpg?v=1678829391"
              alt="Our Team"
              className="rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            className="w-full lg:w-1/3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.h2 className="text-4xl font-bold mb-4" variants={childVariants}>
              Our Team
            </motion.h2>
            <motion.p className="text-gray-100 mb-4" variants={childVariants}>
              Our team is made up of dedicated professionals who are passionate about what they do. From customer support to property management, we work tirelessly to ensure that your rental experience is seamless and enjoyable.
            </motion.p>
            <motion.p className="text-gray-100" variants={childVariants}>
              We are always here to help, so don't hesitate to reach out to us with any questions or concerns. Your satisfaction is our priority!
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;