const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const timetablePath = path.join(__dirname, '../data/timetable.json');

// Utility functions to read and write JSON file
const readTimetable = () => {
  const data = fs.readFileSync(timetablePath);
  return JSON.parse(data);
};

const writeTimetable = (data) => {
  fs.writeFileSync(timetablePath, JSON.stringify(data, null, 2));
};

const generateTimetable = () => {
  const subjects = {
    "Languages": 10,
    "Sciences": 10,
    "Arts": 5,
    "Sports": 5
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timetable = {};

  days.forEach(day => {
    timetable[day] = [];
  });

  const getRandomDay = () => days[Math.floor(Math.random() * days.length)];
  const getRandomHour = (day) => {
    const availableHours = timetable[day].length < 6 ? [...Array(6).keys()] : [];
    return availableHours[Math.floor(Math.random() * availableHours.length)];
  };

  const assignSubject = (subject, hours) => {
    let assignedHours = 0;
    while (assignedHours < hours) {
      const day = getRandomDay();
      if (timetable[day].length < 6) {
        timetable[day].push(subject);
        assignedHours++;
      }
    }
  };

  for (const [subject, hours] of Object.entries(subjects)) {
    assignSubject(subject, hours);
  }

  return timetable;
};

const validateTimetable = (timetable) => {
  const subjects = {
    "Languages": 10,
    "Sciences": 10,
    "Arts": 5,
    "Sports": 5
  };

  const countSubjectHours = (subject) => {
    let count = 0;
    for (const day of Object.values(timetable)) {
      count += day.filter(sub => sub === subject).length;
    }
    return count;
  };

  for (const [subject, hours] of Object.entries(subjects)) {
    if (countSubjectHours(subject) !== hours) {
      return false;
    }
  }

  return true;
};

router.get('/', (req, res) => {
  const timetable = readTimetable();
  res.render('timetable', { timetable });
});

router.post('/generate', (req, res) => {
  const newTimetable = generateTimetable();
  writeTimetable(newTimetable);
  res.redirect('/');
});

router.post('/edit', (req, res) => {
  const updatedTimetable = req.body.timetable;
  if (validateTimetable(updatedTimetable)) {
    writeTimetable(updatedTimetable);
    res.redirect('/');
  } else {
    res.status(400).send('Invalid timetable');
  }
});

module.exports = router;
