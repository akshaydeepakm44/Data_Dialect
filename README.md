# Data Dialect 

Data Dialect is a comprehensive NLP-based website designed to collect and analyze cultural and geographical data from users, specifically focusing on the Andhra Pradesh region. The platform allows users to contribute text, audio, and video data about their native places, and leverages Natural Language Processing (NLP) techniques to identify and categorize the information. The project is structured with a focus on both user engagement and efficient data storage and retrieval for analysis.

## Project Overview

The goal of Data Dialect is to collect rich cultural data from users and store it in a structured manner. Users can provide:
- **Text**: Descriptions of their native places.
- **Audio**: Recordings of folk songs or other relevant audio data.
- **Video**: Visual recordings of famous places or landmarks.

Our primary focus is on data related to the Andhra Pradesh region, aiming to preserve and analyze local cultural heritage. Using NLP techniques, the model identifies the place names from the provided data, which are then stored in a **PostgreSQL** database for further processing and retrieval.

## Key Features

- **NLP-Powered Place Identification**: The platform uses state-of-the-art NLP models to automatically recognize place names from user-submitted data.
  
- **Multimodal Data Collection**:
  - **Text**: Users describe places in their own words.
  - **Audio**: Users provide audio recordings of local folk songs or other related data.
  - **Video**: Users upload videos capturing famous landmarks and places in their region.

- **PostgreSQL Database**: All user data is securely stored in a PostgreSQL database, categorized based on the place identified by the NLP model.

- **Admin Access**: Admins can access the stored data via their dedicated websites, which provide them with necessary tools to view, manage, and analyze the data.

- **User Dashboards**: Users have access to dashboards that track their contributions, including progress tracking features, a streak system to encourage regular participation, and bonus courses to incentivize engagement.

## Technology Stack

- **Frontend**: 
  - Developed using **React** and **JavaScript** for a dynamic and responsive user interface.
  - Interactive dashboards for both users and admins.
  
- **Backend**:
  - Built with **Node.js**.
  - Handles data processing, model integration, and API endpoints.

- **Database**: 
  - **PostgreSQL** is used for storing and managing all collected data.
  
- **NLP Techniques**: 
  - Applied to extract place names from the text, audio, and video data provided by users.

## How to Run
Since your backend is built with Node.js, the command to start the backend should reflect that instead of using Python. Here’s the corrected section for running the application:

---

## How to Run

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   ```

2. **Install dependencies**:
   ```bash
   npm install  # For both frontend and backend
   ```

3. **Set up PostgreSQL**:
   Ensure that a PostgreSQL instance is running and properly configured with the required tables for data storage.

4. **Run the application**:

   - **Start the backend**:
     ```bash
     node server.js  # or whatever your entry point file is (e.g., index.js)
     ```

   - **Start the frontend**:
     ```bash
     npm start
     ```

5. Access the application on `localhost:3000` (or the relevant port).

## Project Files

- **Figma Design**: The user interface is designed in Figma, and the design file is included in the project repository.
- **Documentation**: Detailed project documentation has been uploaded for reference.

## Future Plans

- Expansion to include more regions and different types of data.
- Refinement of NLP models to improve accuracy.
- Additional user engagement features and expanded admin functionality. 

## Team Members

- **Anjani**: Team Lead 
- **Bhavya**: Senior Backend Developer
- **Abhinaya**: Junior Backend Developer
- **Gunasekhar**: Senior NLP Developer
- **Pavan**: Senior NLP Developer
- **Jyothika**: Senior NLP Developer
- **Charishma**: Senior Frontend Developer
- **Padma**: Junior Frontend Developer
- **Akshay**: Junior Frontend Developer

