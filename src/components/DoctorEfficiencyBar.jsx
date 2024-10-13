import React from 'react';

const DoctorEfficiencyBar = ({ efficiency }) => {
  const getColor = (percent) => {
    if (percent < 20) return 'bg-red-500';
    if (percent < 40) return 'bg-orange-500';
    if (percent < 60) return 'bg-yellow-500';
    if (percent < 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-[500px]">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-700">Diagnostic Accuracy</span>
        <span className="text-sm font-medium text-blue-700">{efficiency}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-[30px]">
        <div
          className={`h-[30px] rounded-full ${getColor(efficiency)}`}
          style={{ width: `${efficiency}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DoctorEfficiencyBar;