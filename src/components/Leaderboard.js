import React, { useState, useEffect } from "react";

const Leaderboard = ({ score }) => {
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("leaderboard")) {
      setLeaderboard(JSON.parse(localStorage.getItem("leaderboard")));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newLeaderboard = [...leaderboard];
    let usernameExists = false;

    newLeaderboard.forEach((entry, index) => {
      if (entry.username === username) {
        newLeaderboard[index].score = score;
        usernameExists = true;
      }
    });

    if (!usernameExists) {
      newLeaderboard = [...newLeaderboard, { username, score }];
    }

    localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
    setUsername("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "5px",
            margin: "15px",
            backgroundColor: "lightyellow",
          }}
        />
        <button
          type="submit"
          style={{ padding: "5px", backgroundColor: "lightyellow" }}
        >
          Submit
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th style={{ padding: "5px", margin: "30px" }}>Username</th>
            <th style={{ padding: "5px" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "5px" }}>{item.username}</td>
              <td style={{ padding: "5px" }}>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
