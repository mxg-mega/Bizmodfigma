import { motion } from "motion/react";
import { useState } from "react";

export function BizModLogo() {
  const [isHovered, setIsHovered] = useState(false);

  // Create multiple trail elements for the juicy effect
  const trailCount = 5;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Trail layers - positioned behind the main logo */}
        {[...Array(trailCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: isHovered ? [0, 0.3, 0] : 0,
              scale: isHovered ? [1, 1.2, 1.4] : 1,
              rotate: isHovered ? [0, 5, -5] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* B module */}
              <motion.path
                d="M40 60 L40 140 L80 140 C95 140 105 130 105 115 C105 105 100 98 92 95 C98 92 102 85 102 75 C102 60 92 60 80 60 Z M60 80 L75 80 C80 80 82 82 82 87 C82 92 80 94 75 94 L60 94 Z M60 108 L78 108 C84 108 86 111 86 116 C86 121 84 124 78 124 L60 124 Z"
                fill={`hsl(${260 + i * 10}, 80%, 65%)`}
                opacity={0.6}
              />
              {/* M module */}
              <motion.path
                d="M120 60 L120 140 L138 140 L138 95 L155 125 L165 125 L182 95 L182 140 L200 140 L200 60 L180 60 L160 100 L140 60 Z"
                fill={`hsl(${200 + i * 10}, 80%, 65%)`}
                opacity={0.6}
              />
            </svg>
          </motion.div>
        ))}

        {/* Main logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 1.2,
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Modular grid background - subtle squares */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <rect x="20" y="20" width="30" height="30" fill="#6366f1" />
              <rect x="20" y="150" width="30" height="30" fill="#6366f1" />
              <rect x="150" y="20" width="30" height="30" fill="#06b6d4" />
              <rect x="150" y="150" width="30" height="30" fill="#06b6d4" />
            </motion.g>

            {/* B module - left side */}
            <motion.g
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.2,
              }}
            >
              {/* B letter with modular blocks */}
              <motion.rect
                x="40"
                y="60"
                width="20"
                height="80"
                rx="4"
                fill="url(#gradientB1)"
                whileHover={{ scale: 1.05 }}
              />
              <motion.rect
                x="60"
                y="60"
                width="35"
                height="30"
                rx="8"
                fill="url(#gradientB2)"
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
              <motion.rect
                x="60"
                y="110"
                width="40"
                height="30"
                rx="8"
                fill="url(#gradientB3)"
                whileHover={{ scale: 1.05, rotate: -2 }}
              />
            </motion.g>

            {/* M module - right side */}
            <motion.g
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.4,
              }}
            >
              {/* M letter with modular blocks */}
              <motion.rect
                x="120"
                y="60"
                width="18"
                height="80"
                rx="4"
                fill="url(#gradientM1)"
                whileHover={{ scale: 1.05 }}
              />
              <motion.rect
                x="142"
                y="60"
                width="18"
                height="65"
                rx="4"
                fill="url(#gradientM2)"
                whileHover={{ scale: 1.05 }}
              />
              <motion.rect
                x="164"
                y="60"
                width="18"
                height="80"
                rx="4"
                fill="url(#gradientM3)"
                whileHover={{ scale: 1.05 }}
              />
              {/* Middle peak of M */}
              <motion.path
                d="M142 85 L151 100 L160 85 L160 70 L151 85 L142 70 Z"
                fill="url(#gradientM2)"
                whileHover={{ scale: 1.1 }}
              />
            </motion.g>

            {/* Connecting pieces animation - represents modularity */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 1,
              }}
            >
              <motion.circle
                cx="110"
                cy="100"
                r="4"
                fill="#8b5cf6"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>

            {/* Gradient definitions */}
            <defs>
              <linearGradient
                id="gradientB1"
                x1="40"
                y1="60"
                x2="60"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient
                id="gradientB2"
                x1="60"
                y1="60"
                x2="95"
                y2="90"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient
                id="gradientB3"
                x1="60"
                y1="110"
                x2="100"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient
                id="gradientM1"
                x1="120"
                y1="60"
                x2="138"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#0891b2" />
              </linearGradient>
              <linearGradient
                id="gradientM2"
                x1="142"
                y1="60"
                x2="160"
                y2="125"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#14b8a6" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient
                id="gradientM3"
                x1="164"
                y1="60"
                x2="182"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0891b2" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Orbital particles for extra juice */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <motion.div
              key={angle}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: "8px",
                height: "8px",
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 120,
                y: Math.sin((angle * Math.PI) / 180) * 120,
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: angle / 100,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `hsl(${angle + 200}, 70%, 60%)`,
                  boxShadow: `0 0 10px hsl(${angle + 200}, 70%, 60%)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Logo text with bounce animation */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          BizMod
        </motion.h1>
        <motion.p
          className="text-gray-500 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Modular Business Management
        </motion.p>
      </motion.div>

      {/* Floating feature badges */}
      <motion.div className="flex gap-4 flex-wrap justify-center max-w-md">
        {["Modular", "Scalable", "Integrated"].map((feature, i) => (
          <motion.div
            key={feature}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.1 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 5px 15px rgba(99, 102, 241, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {feature}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
