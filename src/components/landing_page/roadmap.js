import React, { useState } from "react";
import "./roadmap.css";

const roadmapData = [
    { 
      id: 1, 
      title: "Start", 
      content: "Every great journey begins with a single step, and our mission to preserve and celebrate diverse cultures is no exception. This phase marks the beginning of our collective endeavor to safeguard the rich traditions, languages, and customs that shape the identity of various communities. We acknowledge the importance of cultural heritage as a fundamental part of human history and aim to ensure that it is passed down to future generations, not just as memories, but as a living testament to our shared humanity."
    },
    { 
      id: 2, 
      title: "Exploration", 
      content: "Exploration is at the heart of understanding and appreciating the vast tapestry of human culture. In this phase, we embark on a journey of discovery, seeking out stories passed down through generations, unique traditions that define communities, and the soulful songs that carry the emotions of our ancestors. Our goal is to immerse ourselves in the vibrant diversity that exists across regions, learning from the wisdom of local communities and capturing the essence of their cultural practices. We explore with open minds and hearts, respecting each culture's distinctiveness."
    },
    { 
      id: 3, 
      title: "Preservation", 
      content: "Preservation is more than just safeguarding artifacts; it is about maintaining the integrity of cultural identity. In this stage, we work to document and protect the invaluable aspects of culture that could otherwise fade into obscurity. Through modern technologies and careful documentation, we ensure that regional stories, traditional songs, rituals, and languages are preserved in formats that can be accessed and appreciated by future generations. This effort involves collaboration with local communities, scholars, and experts to create lasting repositories of cultural knowledge that will serve as educational resources for years to come."
    },
    { 
      id: 4, 
      title: "Sharing", 
      content: "The true value of cultural preservation lies not only in keeping traditions alive but also in sharing them with the world. In this phase, we focus on creating platforms for global dialogue, where the stories, songs, and traditions we’ve discovered can be shared with others. By making these cultural treasures accessible to a wider audience, we foster understanding and appreciation for cultures that may be vastly different from our own. Our aim is to build bridges between communities, sparking empathy, respect, and collaboration across borders. Through global sharing, we create a unified effort to celebrate diversity and promote the richness of human culture."
    }
  ];
  

const Roadmap = () => {
  const [selected, setSelected] = useState(null);

  const handleStopClick = (id) => {
    setSelected(id);
  };

  return (
    <div className="roadmap-d-container">
      {/* Content Section */}
      <div className="roadmap-content">
        {selected !== null ? (
          <div className="content-box animate-content">
            <h3>{roadmapData[selected - 1].title}</h3>
            <p>{roadmapData[selected - 1].content}</p>
          </div>
        ) : (
          <div className="content-placeholder animate-content">
            <h3>Welcome to the Roadmap</h3>
            <p>Click on any step to see the details.</p>
          </div>
        )}
      </div>

      {/* "D" Shape Roadmap */}
      <div className="roadmap-d-shape">
        <svg
          viewBox="0 0 200 300"
          xmlns="http://www.w3.org/2000/svg"
          className="roadmap-d-svg"
        >
          {/* Clean and aligned "D" shape */}
          <path
            d="M50 50 Q150 50 150 150 Q150 250 50 250"
            fill="none"
            stroke="#8a75fc"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Roadmap stops */}
          {roadmapData.map((stop, index) => {
            const positions = [
              { x: 50, y: 50 },
              { x: 150, y: 100 },
              { x: 150, y: 200 },
              { x: 50, y: 250 },
            ];
            const { x, y } = positions[index];

            return (
              <g
                key={stop.id}
                className={`roadmap-stop ${selected === stop.id ? "active" : ""}`}
                onClick={() => handleStopClick(stop.id)}
              >
                <circle cx={x} cy={y} r="10" className="stop-circle" />
                <text x={x + 15} y={y + 20} className="stop-text">
                  {stop.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Roadmap;
