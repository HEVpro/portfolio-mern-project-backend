const express = require('express');
const connection = require('./config/db');
const cors = require('cors');

// Create the server
const app = express();

// db connection
connection();

// Allow express.json
app.use(express.json({ extended: true }));
// Allow CORS
app.use(cors({credentials: true, origin: true}));
app.options("*", cors());


// PORT of the app
const port = process.env.port || 3001;

// Routes imports
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// run the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on: ${port}`);
});
