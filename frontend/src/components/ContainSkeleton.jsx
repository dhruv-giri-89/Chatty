import React from "react";

const ContainSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-base-100 border-2 border-primary animate-pulse">
      <div className="w-24 h-24 bg-base-200 rounded-full mb-6" />
      <div className="w-48 h-6 bg-base-200 rounded mb-4" />
      <div className="w-32 h-4 bg-base-200 rounded mb-2" />
      <div className="w-40 h-4 bg-base-200 rounded mb-2" />
      <div className="w-36 h-4 bg-base-200 rounded" />
    </div>
  );
};

export default ContainSkeleton;
