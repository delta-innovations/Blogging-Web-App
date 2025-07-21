"use client";

import { FC } from "react";
import styles from "./Loader.module.css"; // Assuming a CSS module file will be created

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${styles.loader} animate-spin`}
        style={{
          width: "32px", // 8 * 4 (tailwind's rem unit)
          height: "32px", // 8 * 4 (tailwind's rem unit)
          borderWidth: "5px",
          borderTopColor: "transparent",
          borderImage: "linear-gradient(45deg, #00C8FF, #FF00C8) 1",
          borderStyle: "solid",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0, 200, 255, 0.5), 0 0 15px rgba(255, 0, 200, 0.3)",
        }}
      />
    </div>
  );
};

export default Loader;