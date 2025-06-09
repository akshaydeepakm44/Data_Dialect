import React, { useState, useEffect } from 'react';
import Nav from './nav';
import UserFooter from './userfooter';
import './events.css';
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [district, setDistrict] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('place', place);
    formData.append('district', district);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        body: formData,
      });
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setName('');
      setDate('');
      setDescription('');
      setPlace('');
      setDistrict('');
      setImage(null);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="events-container">
        <h1>Upcoming Cultural Events</h1>
        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="text"
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Add Event</button>
        </form>
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              <h2>{event.name}</h2>
              <p>{event.date}</p>
              <p>{event.description}</p>
              <p>{event.place}</p>
              <p>{event.district}</p>
              {event.image && <img src={`http://localhost:5000/${event.image}`} alt={event.name} />}
            </li>
          ))}
        </ul>
      </div>
      <UserFooter />
    </div>
  );
};

export default EventsPage;
