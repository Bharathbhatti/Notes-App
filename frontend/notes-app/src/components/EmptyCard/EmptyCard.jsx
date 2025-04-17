import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img
        src={imgSrc}
        alt="Empty"
        className="w-60 h-60 object-contain mb-6 opacity-90"
      />
      <h2 className="text-xl font-semibold text-gray-600 text-center">
        {message}
      </h2>
      <p className="text-sm text-gray-400 mt-2 text-center max-w-sm">
        Once you add notes, they'll show up here. Click the "+" button to get
        started.
      </p>
    </div>
  );
};

export default EmptyCard;
