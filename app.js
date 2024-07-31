const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const timetableRoutes = require('./routes/timetable');
const hbs = require('hbs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Register the eq helper
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', timetableRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
