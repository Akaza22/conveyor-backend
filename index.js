// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import rute
const logRoutes = require('./routes/logRoutes');
const konveyorRoutes = require('./routes/konveyorRoutes'); 
const stepperRoutes = require('./routes/stepperRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gunakan Rute
app.use('/logs', logRoutes);
app.use('/konveyor', konveyorRoutes); 
app.use('/stepper', stepperRoutes);  

// Endpoint dasar untuk cek server
app.get('/', (req, res) => {
  res.send('Conveyor Backend API is running!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});