import React, { useState } from 'react';

const Stats = () => {
  // Dummy data for the charts and metrics
  const barChartData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 60 },
    { name: 'Mar', value: 50 },
    { name: 'Apr', value: 75 },
    { name: 'May', value: 65 },
    { name: 'Jun', value: 80 },
  ];

  const donutChartData = [
    { label: 'Oil Spills', value: 40, color: '#0284c7' }, // Sky-500
    { label: 'Chemicals', value: 25, color: '#f59e0b' }, // Amber-500
    { label: 'Plastics', value: 35, color: '#10b981' },  // Emerald-500
  ];

  const totalReports = 1250;
  const activeTeams = 15;
  const avgQualityScore = 7.8;
  const fieldWorkers = 75;

  // Function to create a simple bar chart using SVG
  const BarChart = ({ data }) => {
    const maxVal = Math.max(...data.map(d => d.value));
    const barWidth = 40;
    const barSpacing = 20;
    const chartHeight = 200;
    const chartWidth = data.length * (barWidth + barSpacing);

    return (
      <svg width="100%" height={chartHeight + 30} viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} preserveAspectRatio="xMidYMid meet">
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map(val => (
          <text key={val} x="-5" y={chartHeight - (val / 100) * chartHeight} textAnchor="end" fontSize="12" fill="#6b7280">
            {val}
          </text>
        ))}
        {/* Bars */}
        {data.map((d, i) => (
          <React.Fragment key={d.name}>
            <rect
              x={i * (barWidth + barSpacing)}
              y={chartHeight - (d.value / maxVal) * chartHeight}
              width={barWidth}
              height={(d.value / maxVal) * chartHeight}
              fill="#3b82f6"
              rx="5"
              ry="5"
            />
            <text
              x={i * (barWidth + barSpacing) + barWidth / 2}
              y={chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#333"
            >
              {d.name}
            </text>
          </React.Fragment>
        ))}
      </svg>
    );
  };

  // Function to create a simple donut chart using SVG
  const DonutChart = ({ data, size = 200, strokeWidth = 30 }) => {
    const sum = data.reduce((acc, curr) => acc + curr.value, 0);
    let cumulative = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={(size - strokeWidth) / 2} fill="transparent" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        {data.map((d, i) => {
          const circumference = (size - strokeWidth) * Math.PI;
          const offset = circumference * (1 - d.value / sum);
          const dasharray = `${circumference - offset} ${offset}`;
          const rotate = (cumulative / sum) * 360;
          cumulative += d.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={(size - strokeWidth) / 2}
              fill="transparent"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dasharray}
              strokeDashoffset={circumference}
              transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
            />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fill="#333" fontWeight="bold">
          {Math.round(donutChartData[0].value / sum * 100)}%
        </text>
        <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#6b7280">
          {donutChartData[0].label}
        </text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight sm:text-5xl">
          Project Statistics
        </h1>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-600">Total Reports</h3>
            <p className="text-5xl font-bold text-blue-600 mt-2">{totalReports}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-600">Active Teams</h3>
            <p className="text-5xl font-bold text-green-600 mt-2">{activeTeams}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-600">Avg. Quality Score</h3>
            <p className="text-5xl font-bold text-yellow-500 mt-2">{avgQualityScore}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
            <h3 className="text-xl font-semibold text-gray-600">Field Workers</h3>
            <p className="text-5xl font-bold text-purple-600 mt-2">{fieldWorkers}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Reports Over Time</h3>
            <div className="flex justify-center items-center">
              <BarChart data={barChartData} />
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Top Pollutants</h3>
            <div className="flex justify-center items-center">
              <DonutChart data={donutChartData} />
            </div>
            {/* Legend for the donut chart */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {donutChartData.map((d, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-sm text-gray-700">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
