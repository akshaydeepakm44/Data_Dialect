import React, { useEffect, useState } from "react";
import Nav from "./nav";
import UserFooter from "./userfooter";
import "./mystats.css";

const MyStats = () => {
    const [streak, setStreak] = useState(0);
    const [submittedToday, setSubmittedToday] = useState(false);
    const [tracker, setTracker] = useState(new Array(30).fill(false));
    const [completedTasks, setCompletedTasks] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [points, setPoints] = useState(0);
    const [showData, setShowData] = useState(false);
    const [userData, setUserData] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showPreviewer, setShowPreviewer] = useState(false);

    useEffect(() => {
        const fetchStreak = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            try {
                const response = await fetch("http://localhost:5000/streak", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId }),
                });

                const data = await response.json();
                if (data.success) {
                    setStreak(data.data.streak);
                    setSubmittedToday(data.data.submitted_today);

                    const newTracker = new Array(30).fill(false);
                    for (let i = 0; i < data.data.streak; i++) {
                        newTracker[i] = true;
                    }
                    setTracker(newTracker);
                }
            } catch (error) {
                console.error("Error fetching streak:", error);
            }
        };

        const fetchCompletedTasks = async () => {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:5000/user/submissions/count?user_id=${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setCompletedTasks(data.submission_count);
                } else {
                    console.error("Error fetching completed tasks:", data.error);
                }
            } catch (error) {
                console.error("Error fetching completed tasks:", error);
            }
        };

        const fetchData = async () => {
            const username = localStorage.getItem("username");
            if (!username) return;

            try {
                const response = await fetch(`http://localhost:5000/user/${username}`);
                const data = await response.json();

                if (response.ok) {
                    const newPoints = (data.text_data.length + data.audio_data.length + data.video_data.length) * 10;
                    setDataCount(data.text_data.length + data.audio_data.length + data.video_data.length);
                    setPoints(newPoints);
                    setUserData([...data.text_data, ...data.audio_data, ...data.video_data]);

                    await fetch("http://localhost:5000/user/update-points", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, points: newPoints }),
                    });
                } else {
                    console.error("Error fetching user data:", data.error);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("http://localhost:5000/leaderboard");
                const data = await response.json();
                if (response.ok) {
                    setLeaderboard(data.leaderboard);
                } else {
                    console.error("Error fetching leaderboard:", data.error);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchStreak();
        fetchCompletedTasks();
        fetchData();
        fetchLeaderboard();
    }, []);

    return (
        <div className="stats-container">
            <Nav />

            <div className="header">
                <h1>KNOW YOUR STATS</h1>
                <div className="points">{points} Points</div>
            </div>

            <div className="main-section">
                <div className="streak-section">
                    <h2>Current Streak</h2>
                    <p className="streak-number">{streak} Days</p>
                    <div className="monthly-tracker">
                        {tracker.map((active, index) => (
                            <div key={index} className={`tracker-box ${active ? "active" : ""}`} />
                        ))}
                    </div>
                </div>

                <div className="main-card">
                    <div className="data-entry-count">
                        <h2>Data Entered</h2>
                        <p className="stat-number">{dataCount} Entries</p>
                    </div>
                    <button className="show-data-btn" onClick={() => setShowData(!showData)}>
                        {showData ? "Hide My Data" : "Show My Data"}
                    </button>
                </div>
            </div>
        <div>
        {showData && (
                        <div className="data-entries">
                            <h2>My Data Entries</h2>
                            <ul>
                                {userData.map((entry, index) => (
                                    <li key={index}>{entry.user_input || entry.audio_file || entry.video_file}</li>
                                ))}
                            </ul>
                        </div>
                    )}
        </div>

    
      <div className="leaderboard-card">
        <h2 className="leaderboardle">Leaderboard</h2>
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Streaks</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.streak_count}</td>
                  <td>{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    

            <UserFooter />
        </div>
    );
};

export default MyStats;
