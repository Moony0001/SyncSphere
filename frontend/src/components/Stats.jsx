import React from "react";

const sections = [
  {
    title: "Last 4 Weeks",
    rows: [
      ["Activities / Week", "0", "0"],
      ["Avg Distance / Week", "0 km", "0 km"],
      ["Elev Gain / Week", "0 m", "0 m"],
      ["Avg Time / Week", "0h 0m", "0h 0m"],
    ],
  },
  {
    title: "Best Efforts",
    rows: [
      ["Longest Ride", "26.6 km", "-"],
      ["Biggest Climb", "13 m", "-"],
      ["5 mile", "25:17", "-"],
      ["10K", "32:06", "-"],
      ["20K", "1:20:40", "-"],
    ],
  },
  {
    title: "All-Time",
    rows: [
      ["Activities", "16", "0"],
      ["Distance", "163.0 km", "0 km"],
      ["Elev Gain", "1,709 m", "0 m"],
      ["Time", "11h 2m", "0h 0m"],
    ],
  },
];

const Stats = () => {
  return (
    <div className="p-5">
      <h2 className="text-base font-bold text-gray-800">Side by Side Comparison</h2>

      <table className="mt-4 w-full text-sm">
        <tbody>
          {sections.map((section) => (
            <React.Fragment key={section.title}>
              <tr>
                <th
                  colSpan={3}
                  className="border-b border-gray-200 pb-2 pt-4 text-left text-xs font-bold uppercase tracking-wide text-gray-400"
                >
                  {section.title}
                </th>
              </tr>
              {section.rows.map(([label, a, b]) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-2 font-medium text-gray-700">{label}</td>
                  <td className="py-2 text-center text-gray-500">{a}</td>
                  <td className="py-2 text-center text-gray-400">{b}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
