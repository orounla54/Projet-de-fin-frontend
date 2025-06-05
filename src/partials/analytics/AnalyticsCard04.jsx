import React from 'react';
import BarChart from '../../charts/BarChart04';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

function AnalyticsCard04({chartData, width, height, title }) {

 

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={width} height={height} />
    </div>
  );
}

export default AnalyticsCard04;
