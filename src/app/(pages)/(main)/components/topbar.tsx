"use client";

import { useState } from "react";

export default function Topbar() {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleAvatarClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div className="flex items-center h-[62px] justify-between p-4 border-b fixed top-0 left-0 w-full z-50 bg-white">
      <div className="flex items-center gap-4 font-bold text-2xl">
        <h2>Logo</h2>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-8 h-8 rounded-full cursor-pointer bg-cover bg-center bg-primary"
          onClick={handleAvatarClick}
        />
      </div>
    </div>
  );
}
