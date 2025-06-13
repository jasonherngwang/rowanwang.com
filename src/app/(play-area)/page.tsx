"use client";

import Link from "next/link";
import { UserProfile } from "@/components/user-profile";
import { Button } from "@/components/ui/button";
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
            id="rowan-path"
            fill="none"
            stroke="none"
            d="M -400,500 C 100,100 500,900 900,500 S 1700,100 2100,500"
          />
          <path
            id="wang-path"
            fill="none"
            stroke="none"
            d="M -400,550 C 100,150 500,950 900,550 S 1700,150 2100,550"
          />
          <text>
            <motion.textPath
              href="#wang-path"
              className="font-bold text-9xl fill-mid-pine"
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
            <motion.textPath
              href="#rowan-path"
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
          </text>
        </svg>
      </div>

      <PlayArea />
      <div className="absolute bottom-10 flex space-x-4">
        <Button asChild variant="link" className="text-xl text-light-peach">
          <Link href="/formula">Formula</Link>
        </Button>
        <Button asChild variant="link" className="text-xl text-light-peach">
          <Link href="/camelchords">CamelChords</Link>
        </Button>
      </div>
      {/* <UserProfile className="size-16" /> */}
    </div>
  );
}
