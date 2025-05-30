import React, { useContext, useEffect, useState } from 'react';
import codeContext from '../context/codeContext';
import '../styles/Results.css'; // Optional: for custom styling

export default function Results() {
  const context = useContext(codeContext);
  const { getAllCode } = context;

  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const data = await getAllCode();

      const userMap = {};

      data.forEach(entry => {
        const { user, qid, solved } = entry;

        if (!userMap[user]) {
          userMap[user] = new Set(); // Initialize for each user
        }

        if (solved) {
          userMap[user].add(qid);
        }
      });

      // Convert to array and sort by highest solved count
      const statsArray = Object.entries(userMap)
        .map(([userId, qidSet]) => ({
          user: userId,
          solvedCount: qidSet.size
        }))
        .sort((a, b) => b.solvedCount - a.solvedCount); // Sort descending

      setUserStats(statsArray);
    };

    fetchAndProcessData();
  }, [getAllCode]);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary">User Solved Questions</h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>User ID</th>
                <th>Solved Questions</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map(({ user, solvedCount }) => (
                <tr key={user}>
                  <td>{user}</td>
                  <td>{solvedCount}</td>
                </tr>
              ))}
              {userStats.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
