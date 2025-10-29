"use client";
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log("Clicked")} >
      {" "}
      <a href="#explore">
        Explore Events{" "}
        <Image
          alt="arrow down"
          src={"/icons/arrow-down.svg"}
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};

export default ExploreBtn;
