import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useTable } from 'react-table';
import 'chart.js/auto'; // Required for react-chartjs-2

const AdminDashboard: React.FC = () => {
  const themeMode = useSelector((state: { menu: { themeMode: 'light' | 'dark' } }) => state.menu.themeMode);
  const themeColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);
  const currentColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);

  // Data for charts
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: themeColor,
        borderColor: themeColor,
        data: [3000, 2500, 3200, 4000, 3600, 5000, 4500],
      },
    ],
  };

  const pieData = {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [themeColor, '#FF6384', '#36A2EB'],
      },
    ],
  };

  // Table data
  const data = React.useMemo(
    () => [
      { name: 'John Doe', role: 'Admin', activity: 'Active' },
      { name: 'Jane Smith', role: 'Editor', activity: 'Inactive' },
      { name: 'Samuel Green', role: 'Viewer', activity: 'Active' },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Role', accessor: 'role' },
      { Header: 'Activity', accessor: 'activity' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className={`p-4 ${themeMode === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Revenue Bar Chart</h2>
          <Bar data={chartData} />
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Monthly Revenue Line Chart</h2>
          <Line data={chartData} />
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Product Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">User Activity Table</h2>
        <table {...getTableProps()} className="w-full text-left table-auto">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="p-2 border-b-2">{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="p-2 border-b">{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-xl font-bold">120</p>
            <p className="text-sm text-gray-500">New Users</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-xl font-bold">45</p>
            <p className="text-sm text-gray-500">New Orders</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-xl font-bold">7</p>
            <p className="text-sm text-gray-500">Pending Tasks</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-xl font-bold">5</p>
            <p className="text-sm text-gray-500">Support Tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
