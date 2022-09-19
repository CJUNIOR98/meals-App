const { app } = require('./app');

// Models
const { initModels } = require('./models/initModels');

// Utils
const { db } = require('./utils/db.utils');

// To start server
const serverStart = async () => {
  try {
    await db.authenticate();

    // Establish the relations between
    initModels();

    await db.sync();

    const PORT = 4000;

    // Set server to listen
    app.listen(PORT, () => {
      console.log('Express app running. :D');
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();
