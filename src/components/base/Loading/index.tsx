import React from "react";

interface ILoadingProps {
  animation?: string;
}

export const Loading: React.FC<ILoadingProps> = ({ animation }) => {
  return (
    <div className={`flex justify-center h-full w-full items-center`}>
      <div className="w-72 h-1/12">Loading</div>
    </div>
  );
};
