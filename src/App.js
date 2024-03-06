import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState('');
  const [attentionColor, setAttentionColor] = useState(false);

 
  //This effect updates the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addAlarm = () => {
    if (newAlarm.trim() !== '') {
      setAlarms([...alarms, newAlarm]);
      alert('Alarm set')
      setNewAlarm('');
    }
  };

  const handleAlarmChange = (e) => {
    setNewAlarm(e.target.value);
  };

  const deleteAlarm = (index) => {
    const updatedAlarms = alarms.filter((alarm, i) => i !== index);
    setAlarms(updatedAlarms);
  };

  const checkAlarms = () => {
    const currentTime = new Date();
    let attention = false;

    alarms.forEach(alarm => {
      const alarmTime = new Date(alarm);
      const timeDifference = (alarmTime - currentTime) / 60000; // Difference in minutes

      // Check if the alarm time is within a few seconds of the current time
      if (alarmTime.getHours() === currentTime.getHours() &&
          alarmTime.getMinutes() === currentTime.getMinutes() &&
          Math.abs(alarmTime.getSeconds() - currentTime.getSeconds()) <= 10) {
        alert('Alarm!');
      }

      // Check if the alarm time is within 10 minutes of the current time
      if (timeDifference > 0 && timeDifference <= 10) {
        attention = true;
      }
    });

    setAttentionColor(attention);
  };

  //This code sets up an interval that calls the checkAlarms function every second. This function is responsible for checking if any alarms need to be triggered.
  useEffect(() => {
    const interval = setInterval(() => {
      checkAlarms();
    }, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  //Function to add leading zeros if time is less than 10
  const formatTime = (time) => {
    return time < 10 ? '0' + time : time;
  };

  const hours = formatTime(time.getHours() % 12 || 12);
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const style = {
    backgroundColor: attentionColor ? '#0a6522' : (time.getHours() < 18 ? '#c6e2ff' : '#333'),
    color: '#fff',
    padding: '20px',
    fontSize: '2em',
    textAlign: 'center',
    borderRadius: '10px'
  };

  return (
    <div className="app__container app__flex" style={style}>
      <div className="app__clock">{hours}:{minutes}:{seconds} {ampm}</div>
      <br />
      <div className="app__clock-setter">
        <input type="datetime-local" value={newAlarm} onChange={handleAlarmChange} />
        <button className="app__set-button" onClick={addAlarm} style={{ backgroundColor: newAlarm.trim() === '' ? 'lightgrey' : '#0ec043' }} disabled={newAlarm.trim() === ''}>Set Alarm</button>
      </div>
      <br />
      <div>
        <h2>Alarms</h2>
        <ul>
          {alarms.map((alarm, index) => (
            <li key={index}>
              {alarm.split('T')[1]}
              <button className="app__delete-button" onClick={() => deleteAlarm(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
