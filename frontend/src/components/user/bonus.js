import React, { useEffect, useState } from 'react';
import './bonus.css';
import Nav from './nav';
import UserFooter from './userfooter';

const Bonus = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5000/user/details?user_id=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setPoints(data.user.points);
        } else {
          console.error("Error fetching user points:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };

    fetchPoints();
  }, []);

  if (points < 100) {
    return (
      <div className="bonus-page">
        <Nav />
        <div className="bonus-container">
          <h1>Bonus Learning Resources</h1>
          <p>You need at least 100 points to access this page.</p>
        </div>
        <UserFooter />
      </div>
    );
  }

  const courses = [
    {
      title: "Learn Python from Scratch",
      thumbnail: "https://img.youtube.com/vi/kqtD5dpn9C8/0.jpg",
      link: "https://youtu.be/kqtD5dpn9C8?si=KqSQLU4wpPiFV_wl"
    },
    {
      title: "Introduction to Git",
      thumbnail: "https://img.youtube.com/vi/A61wPPQjnsQ/0.jpg",
      link: "https://youtu.be/A61wPPQjnsQ?si=1MCKrwqb2LZfnv_M"
    },
    {
      title: "HTML for Beginners",
      thumbnail: "https://img.youtube.com/vi/kUMe1FH4CHE/0.jpg",
      link: "https://youtu.be/kUMe1FH4CHE?si=ktyCbwJd9VaagfB0"
    },
    {
      title: "Learn JavaScript in 1 Hour",
      thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/0.jpg",
      link: "https://youtu.be/W6NZfCO5SIk?si=sIQbKXZr53Bh3hhu"
    },
    {
      title: "Complete NLP Guide in One Shot",
      thumbnail: "https://img.youtube.com/vi/ENLEjGozrio/0.jpg",
      link: "https://youtu.be/ENLEjGozrio?si=ICB25O3mgxdS1PaR"
    },
    {
      title: "IoT 4 Hours Crash Course",
      thumbnail: "https://img.youtube.com/vi/h0gWfVCSGQQ/0.jpg",
      link: "https://youtu.be/h0gWfVCSGQQ?si=5Ui32qqZJhCMCSHb"
    },
    {
      title: "Node.js Crash Course",
      thumbnail: "https://img.youtube.com/vi/RLtyhwFtXQA/0.jpg",
      link: "https://youtu.be/RLtyhwFtXQA?si=K2FKCMaj1SnoRXpz"
    },
    {
      title: "MongoDB Crash Course",
      thumbnail: "https://img.youtube.com/vi/J6mDkcqU_ZE/0.jpg",
      link: "https://youtu.be/J6mDkcqU_ZE?si=uYksndu-9RXAlFMo"
    },
    {
      title: "Power BI Project",
      thumbnail: "https://img.youtube.com/vi/KL9vUsxc9nI/0.jpg",
      link: "https://youtu.be/KL9vUsxc9nI?si=Emg0g2GznUVgtnuq"
    },
    {
      title: "Coding Roadmap 2025",
      thumbnail: "https://img.youtube.com/vi/cM8V4sk1v8M/0.jpg",
      link: "https://youtu.be/cM8V4sk1v8M?si=tGDrZAvCoBwCfTIK"
    },
    {
      title: "Asynchronous JavaScript",
      thumbnail: "https://img.youtube.com/vi/zG_3uwCBCtw/0.jpg",
      link: "https://www.youtube.com/live/zG_3uwCBCtw?si=0ryby6aPPHoCVPrm"
    },
    {
      title: "Backend Development Roadmap",
      thumbnail: "https://img.youtube.com/vi/OeEHJgzqS1k/0.jpg",
      link: "https://youtu.be/OeEHJgzqS1k?si=zJAXBk2RPZsVFzGd"
    },

  ];

  return (
    <div className="bonus-page">
      <Nav />
      
      <div className="bonus-container">
        <h1>Bonus Learning Resources</h1>
        <p>Explore a selection of courses and videos to enhance your learning journey!</p>

        <div className="course-list">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <a href={course.link} target="_blank" rel="noopener noreferrer">
                <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                <h3>{course.title}</h3>
              </a>
            </div>
          ))}
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default Bonus;
