"use client";

import { UserProfile } from "@/components/user-profile";
import PlayArea from "./components/PlayArea";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative">
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 2000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            id="camel-path"
            fill="none"
            stroke="none"
            d="M -100,500 C 400,100 800,900 1200,500 S 2000,100 2400,500"
          />
          <path
            id="wang-path"
            fill="none"
            stroke="none"
            d="M -100,550 C 400,150 800,950 1200,550 S 2000,150 2400,550"
          />
          <text>
            <motion.textPath
              href="#camel-path"
              className="font-bold text-9xl fill-peach"
              initial={{ startOffset: "0%" }}
              animate={{ startOffset: "100%" }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              rowan
            </motion.textPath>
            <motion.textPath
              href="#wang-path"
              className="font-bold text-9xl fill-dark-pine"
              initial={{ startOffset: "100%" }}
              animate={{ startOffset: "0%" }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              wang
            </motion.textPath>
          </text>
        </svg>
      </div>

      <PlayArea />
      {/* <UserProfile className="size-16" /> */}
    </div>
  );
}
