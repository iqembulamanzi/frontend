import React, { useState, useEffect } from "react";

// Import your chart components
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";

const Stats = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [metrics, setMetrics] = useState({
    totalReports: 0,
    activeTeams: 0,
    avgQualityScore: 0,
    fieldWorkers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch incidents
        const incidentsRes = await fetch(
          '/api/incidents',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const incidentsData = await incidentsRes.json();
        if (!incidentsRes.ok)
          throw new Error(incidentsData.message || "Failed to fetch incidents");

        // Fetch users
        const usersRes = await fetch(
          '/users',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const usersData = await usersRes.json();
        if (!usersRes.ok)
          throw new Error(usersData.message || "Failed to fetch users");

        // Process stats
        const totalReports = incidentsData.length;
        const activeTeams = usersData.filter((u) => u.role === "Manager").length;
        const fieldWorkers = usersData.filter((u) => u.role === "Citizen").length;

        // Placeholder: you could later calculate real quality score
        const avgQualityScore = Math.floor(Math.random() * 100);

        setMetrics({ totalReports, activeTeams, avgQualityScore, fieldWorkers });

        // Generate bar chart data (e.g., group reports by month)
        const grouped = {};
        incidentsData.forEach((inc) => {
          const month = new Date(inc.createdAt).toLocaleString("default", {
            month: "short",
          });
          grouped[month] = (grouped[month] || 0) + 1;
        });
        setBarChartData(
          Object.entries(grouped).map(([name, value]) => ({ name, value }))
        );

        // Generate donut chart data (category distribution)
        const categoryCounts = {};
        incidentsData.forEach((inc) => {
          const cat = inc.category || "other";
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const colors = ["#0284c7", "#16a34a", "#facc15", "#ef4444"];
        setDonutChartData(
          Object.entries(categoryCounts).map(([label, value], i) => ({
            label,
            value,
            color: colors[i % colors.length],
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight sm:text-5xl">
          Project Statistics
        </h1>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-600">Total Reports</h3>
            <p className="text-5xl font-bold text-blue-600 mt-2">
              {metrics.totalReports}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-600">Active Teams</h3>
            <p className="text-5xl font-bold text-green-600 mt-2">
              {metrics.activeTeams}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-600">Avg. Quality Score</h3>
            <p className="text-5xl font-bold text-yellow-500 mt-2">
              {metrics.avgQualityScore}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-600">Field Workers</h3>
            <p className="text-5xl font-bold text-purple-600 mt-2">
              {metrics.fieldWorkers}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Reports Over Time
            </h3>
            <div className="flex justify-center items-center">
              <BarChart data={barChartData} />
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Reports by Category
            </h3>
            <div className="flex justify-center items-center">
              <DonutChart data={donutChartData} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {donutChartData.map((d, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></div>
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