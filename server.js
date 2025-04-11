
// // server.js
// // successful code
// // const express = require('express');
// // // Use mysql2 if you switched, otherwise keep 'mysql'
// // const mysql = require('mysql2'); // Or require('mysql');
// // const bodyParser = require('body-parser');
// // const path = require('path'); // <-- Import the path module

// // const app = express();
// // app.use(bodyParser.json());

// // // --- Database connection settings (keep as they are) ---
// // const dbHost = 'localhost';
// // const dbUser = 'root';
// // const dbPassword = '1234'; // Use your actual password
// // const dbName = 'task';

// // const db = mysql.createConnection({
// //   host: dbHost,
// //   user: dbUser,
// //   password: dbPassword,
// //   database: dbName,
  
// // });

// // db.connect((err) => {
// //   if (err) {
// //     console.error('error connecting:', err);
// //     // Consider exiting if the DB connection fails on startup
// //     // process.exit(1);
// //     return;
// //   }
// //   console.log('connected to database as id ' + db.threadId);
// // });

// // // === NEW ROUTE HANDLER FOR THE HOMEPAGE ===
// // app.get('/', (req, res) => {
// //   // Send the index.html file
// //   // path.join ensures the correct path regardless of operating system
// //   res.sendFile(path.join(__dirname, 'index.html'));
// // });
// // // ==========================================

// // // API endpoint to store user details
// // app.post('/submit', (req, res) => {
// //   const { name, email, phoneNumber } = req.body;

// //   // Basic validation (optional but recommended)
// //   if (!name || !email || !phoneNumber) {
// //     return res.status(400).send({ message: 'Name, email, and phone number are required.' });
// //   }

// //   db.query('SELECT * FROM users WHERE email = ? OR phone = ?', [email, phoneNumber], (err, results) => {
// //     if (err) {
// //       console.error('error checking user:', err);
// //       return res.status(500).send({ message: 'Error checking user details' });
// //     }
// //     if (results.length > 0) {
// //       return res.status(409).send({ message: 'User already exists with this email or phone number' });
// //     }

// //     // Insert new user
// //     const newUser = { name, email, phone: phoneNumber };
// //     db.query('INSERT INTO users SET ?', newUser, (err, insertResult) => {
// //       if (err) {
// //         console.error('error inserting user:', err);
// //         return res.status(500).send({ message: 'Error saving user details' });
// //       }

// //       console.log('User inserted with ID:', insertResult.insertId);
// //       const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdjoWcHb2PqK1BXPp_U8Z-AYHyaimZ4Ko5-xvmNOOuQquDOTQ/viewform?embedded=true';

// //       res.status(201).send({
// //         message: 'Form submitted successfully',
// //         googleFormUrl: googleFormUrl,
// //         userId: insertResult.insertId // Send back the user ID
// //       });
// //     });
// //   });
// // });

// // // API endpoint to check if user is unique
// // app.get('/check-user', (req, res) => {
// //   const { email, phoneNumber } = req.query; // Get parameters from query string

// //   // Basic validation
// //   if (!email || !phoneNumber) {
// //     return res.status(400).send({ message: 'Email and phone number are required for checking.' });
// //   }

// //   db.query('SELECT * FROM users WHERE email = ? OR phone = ?', [email, phoneNumber], (err, results) => {
// //     if (err) {
// //       console.error('error checking user:', err);
// //       return res.status(500).send({ message: 'Error checking user' });
// //     }
// //     if (results.length > 0) {
// //       // Send a specific status code for existing user check
// //       return res.status(200).send({ exists: true, message: 'User already exists' });
// //     } else {
// //       return res.status(200).send({ exists: false, message: 'User is unique' });
// //     }
// //   });
// // });

// // // API endpoint to handle window blur event
// // app.post('/window-blur', (req, res) => {
// //   const { userId } = req.body;

// //   if (!userId) {
// //       // It's okay if userId is not available (e.g., before submission)
// //       // Or you might want to send a specific response like 400 Bad Request
// //       console.log('Window blur event received without userId.');
// //       return res.status(200).send({ message: 'Blur event noted, no user ID provided.' });
// //   }

// //   // Check if the 'status' column exists in your 'users' table.
// //   // If not, you'll need to add it: ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
// //   db.query('UPDATE users SET status = ? WHERE id = ?', ['inactive', userId], (err, results) => {
// //     if (err) {
// //       console.error('error updating user status:', err);
// //       // Don't send 500 if the user just doesn't exist yet or ID is wrong
// //       return res.status(500).send({ message: 'Error updating user status' });
// //     }
// //     if (results.affectedRows > 0) {
// //         console.log(`User status updated for ID: ${userId}`);
// //         return res.status(200).send({ message: 'User status updated successfully' });
// //     } else {
// //         console.log(`User ID ${userId} not found for status update.`);
// //         // Send a different status if user not found, e.g., 404
// //         return res.status(404).send({ message: 'User not found for status update.' });
// //     }
// //   });
// // });


// // app.listen(3000, () => {
// //   console.log('Server listening on port 3000');
// //   console.log('Access the form at: http://localhost:3000'); // Add this line
// // });


// // server.js

// // const express = require('express');
// // const mysql = require('mysql2');
// // const bodyParser = require('body-parser');
// // const path = require('path');

// // const app = express();
// // app.use(bodyParser.json());

// // // --- Database connection settings ---
// // const dbHost = 'localhost';
// // const dbUser = 'root';
// // const dbPassword = '1234'; // Use your actual password
// // const dbName = 'task';

// // const db = mysql.createConnection({
// //   host: dbHost,
// //   user: dbUser,
// //   password: dbPassword,
// //   database: dbName,
// // });

// // db.connect((err) => {
// //   if (err) {
// //     console.error('Error connecting to database:', err);
// //     // Consider exiting if the DB connection fails on startup
// //     process.exit(1); // Exit if cannot connect to DB
// //     // return; // Unreachable after process.exit
// //   }
// //   console.log('Connected to database as id ' + db.threadId);
// // });

// // // === ROUTE HANDLER FOR THE HOMEPAGE ===
// // app.get('/', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'index.html'));
// // });

// // // === API endpoint to store user details ===
// // app.post('/submit', (req, res) => {
// //   const { name, email, phoneNumber } = req.body;

// //   if (!name || !email || !phoneNumber) {
// //     return res.status(400).send({ message: 'Name, email, and phone number are required.' });
// //   }

// //   // Check if user exists and their status
// //   db.query('SELECT id, status FROM users WHERE email = ? OR phone = ?', [email, phoneNumber], (err, results) => {
// //     if (err) {
// //       console.error('Error checking user:', err);
// //       return res.status(500).send({ message: 'Error checking user details' });
// //     }

// //     if (results.length > 0) {
// //       const existingUser = results[0];
// //       // Prevent submission if user is already disqualified
// //       if (existingUser.status === 'disqualified') {
// //           console.log(`Attempt to submit by disqualified user: ${email}/${phoneNumber}`);
// //           return res.status(403).send({ message: 'Your session was closed due to switching tabs. Submission denied.' });
// //       }
// //       // Handle case where user exists but is not disqualified (e.g., previously submitted but not disqualified)
// //       return res.status(409).send({ message: 'User already exists with this email or phone number' });
// //     }

// //     // User does not exist, proceed to insert
// //     const newUser = { name, email, phone: phoneNumber, status: 'active' }; // Start as active
// //     db.query('INSERT INTO users SET ?', newUser, (err, insertResult) => {
// //       if (err) {
// //         console.error('Error inserting user:', err.sqlMessage || err.message);
// //         return res.status(500).send({ message: 'Error saving user details' });
// //       }

// //       console.log('User inserted with ID:', insertResult.insertId);
// //       const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdjoWcHb2PqK1BXPp_U8Z-AYHyaimZ4Ko5-xvmNOOuQquDOTQ/viewform?embedded=true';

// //       res.status(201).send({
// //         message: 'Form submitted successfully',
// //         googleFormUrl: googleFormUrl,
// //         userId: insertResult.insertId // Send back the user ID
// //       });
// //     });
// //   });
// // });

// // // === API endpoint to check if user is unique ===
// // app.get('/check-user', (req, res) => {
// //   const { email, phoneNumber } = req.query;

// //   if (!email || !phoneNumber) {
// //     return res.status(400).send({ message: 'Email and phone number are required for checking.' });
// //   }

// //   // Also check status here
// //   db.query('SELECT id, status FROM users WHERE email = ? OR phone = ?', [email, phoneNumber], (err, results) => {
// //     if (err) {
// //       console.error('Error checking user:', err);
// //       return res.status(500).send({ message: 'Error checking user' });
// //     }
// //     if (results.length > 0) {
// //         const user = results[0];
// //         // Inform frontend if user exists and is disqualified
// //         if (user.status === 'disqualified') {
// //             return res.status(200).send({ exists: true, disqualified: true, message: 'User exists but is disqualified.' });
// //         }
// //       return res.status(200).send({ exists: true, disqualified: false, message: 'User already exists' });
// //     } else {
// //       return res.status(200).send({ exists: false, message: 'User is unique' });
// //     }
// //   });
// // });

// // // === API endpoint to handle disqualification on tab switch ===
// // // Renamed from /window-blur
// // app.post('/disqualify', (req, res) => {
// //   const { userId } = req.body;

// //   if (!userId) {
// //       console.log('Disqualify event received without userId.');
// //       // Cannot disqualify without ID, maybe send a specific status?
// //       return res.status(400).send({ message: 'User ID is required to disqualify.' });
// //   }

// //   // Update status to 'disqualified'
// //   const newStatus = 'disqualified';
// //   db.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, userId], (err, results) => {
// //     if (err) {
// //       console.error('Error updating user status to disqualified:', err.sqlMessage || err.message);
// //       return res.status(500).send({ message: 'Error updating user status' });
// //     }
// //     if (results.affectedRows > 0) {
// //         console.log(`User status updated to disqualified for ID: ${userId}`);
// //         return res.status(200).send({ message: 'User status updated to disqualified successfully' });
// //     } else {
// //         console.log(`User ID ${userId} not found for disqualification update.`);
// //         // User might not exist or ID is wrong, still acknowledge the request?
// //         return res.status(404).send({ message: 'User not found for status update.' });
// //     }
// //   });
// // });


// // app.listen(3000, () => {
// //   console.log('Server listening on port 3000');
// //   console.log('Access the form at: http://localhost:3000');
// // });





// // server.js

// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();
// app.use(bodyParser.json());

// // --- Database connection settings ---
// const dbHost = 'localhost';
// const dbUser = 'root';
// const dbPassword = '1234'; // Use your actual password
// const dbName = 'task';

// const db = mysql.createConnection({
//   host: dbHost,
//   user: dbUser,
//   password: dbPassword,
//   database: dbName,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     process.exit(1);
//   }
//   console.log('Connected to database as id ' + db.threadId);
// });

// // === ROUTE HANDLER FOR THE HOMEPAGE ===
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // === API endpoint to store user details ===
// // (Keep the /submit endpoint as it was)
// app.post('/submit', (req, res) => {
//   const { name, email, phoneNumber } = req.body;

//   if (!name || !email || !phoneNumber) {
//     return res.status(400).send({ message: 'Name, email, and phone number are required.' });
//   }

//   db.query('SELECT id, status FROM users WHERE email = ? OR phone = ?', [email, phoneNumber], (err, results) => {
//     if (err) {
//       console.error('Error checking user during submit:', err);
//       return res.status(500).send({ message: 'Error checking user details' });
//     }

//     if (results.length > 0) {
//       const existingUser = results[0];
//       if (existingUser.status === 'disqualified') {
//           console.log(`Attempt to submit by disqualified user: ${email}/${phoneNumber}`);
//           return res.status(403).send({ message: 'Your session was closed due to switching tabs. Submission denied.' });
//       }
//       return res.status(409).send({ message: 'User already exists with this email or phone number' });
//     }

//     const newUser = { name, email, phone: phoneNumber, status: 'active' };
//     db.query('INSERT INTO users SET ?', newUser, (err, insertResult) => {
//       if (err) {
//         console.error('Error inserting user:', err.sqlMessage || err.message);
//         return res.status(500).send({ message: 'Error saving user details' });
//       }

//       console.log('User inserted with ID:', insertResult.insertId);
//       const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdjoWcHb2PqK1BXPp_U8Z-AYHyaimZ4Ko5-xvmNOOuQquDOTQ/viewform?embedded=true';

//       res.status(201).send({
//         message: 'Form submitted successfully',
//         googleFormUrl: googleFormUrl,
//         userId: insertResult.insertId
//       });
//     });
//   });
// });


// // === MODIFIED API endpoint to check if a specific field value exists ===
// app.get('/check-user', (req, res) => {
//   const { field, value } = req.query;

//   // Validate input
//   if (!field || !value) {
//     return res.status(400).send({ message: 'Field and value are required for checking.' });
//   }

//   // Map frontend field names to database column names
//   const allowedFields = {
//       name: 'name',
//       email: 'email',
//       // Use 'phone' for the database column if that's the name
//       phone: 'phone'
//       // Add other fields if needed
//   };

//   const columnName = allowedFields[field];

//   if (!columnName) {
//       return res.status(400).send({ message: 'Invalid field specified for checking.' });
//   }

//   // Use ?? for column name and ? for value to prevent SQL injection
//   const sql = 'SELECT id, status FROM users WHERE ?? = ?';

//   db.query(sql, [columnName, value], (err, results) => {
//     if (err) {
//       console.error(`Error checking user by ${field}:`, err);
//       // Don't expose detailed SQL errors to the client
//       return res.status(500).send({ message: `Error checking user by ${field}` });
//     }

//     if (results.length > 0) {
//         const user = results[0];
//         // Inform frontend if user exists and is disqualified
//         if (user.status === 'disqualified') {
//             return res.status(200).send({
//                 exists: true,
//                 disqualified: true,
//                 message: `User with this ${field} exists and was previously disqualified.` // More specific message
//             });
//         }
//       // User exists but is not disqualified
//       return res.status(200).send({
//           exists: true,
//           disqualified: false,
//           message: `User with this ${field} already exists.` // More specific message
//         });
//     } else {
//       // User does not exist with this specific field value
//       return res.status(200).send({ exists: false, message: `User with this ${field} is unique.` });
//     }
//   });
// });

// // === API endpoint to handle disqualification on tab switch ===
// // (Keep the /disqualify endpoint as it was)
// app.post('/disqualify', (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//       console.log('Disqualify event received without userId.');
//       return res.status(400).send({ message: 'User ID is required to disqualify.' });
//   }

//   const newStatus = 'disqualified';
//   db.query('UPDATE users SET status = ? WHERE id = ?', [newStatus, userId], (err, results) => {
//     if (err) {
//       console.error('Error updating user status to disqualified:', err.sqlMessage || err.message);
//       return res.status(500).send({ message: 'Error updating user status' });
//     }
//     if (results.affectedRows > 0) {
//         console.log(`User status updated to disqualified for ID: ${userId}`);
//         return res.status(200).send({ message: 'User status updated to disqualified successfully' });
//     } else {
//         console.log(`User ID ${userId} not found for disqualification update.`);
//         return res.status(404).send({ message: 'User not found for status update.' });
//     }
//   });
// });


// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
//   console.log('Access the form at: http://localhost:3000');
// });






// server.js

// Load environment variables from .env file
// require('dotenv').config();

// const express = require('express');
// // Use the promise-based wrapper for mysql2 for async/await
// const mysql = require('mysql2/promise');
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();
// app.use(bodyParser.json());

// // --- Database Connection Pool Settings ---
// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '1234', // Default to empty if not set
//   database: process.env.DB_NAME || 'task',
//   waitForConnections: true,
//   connectionLimit: 10, // Adjust as needed
//   queueLimit: 0
// };

// // Create a connection pool
// const pool = mysql.createPool(dbConfig);


// // *** ADD THIS LINE TO SERVE STATIC FILES FROM THE 'js' FOLDER ***
// app.use('/js', express.static(path.join(__dirname, 'js')));
// // *

// // Optional: Test the pool connection on startup
// pool.getConnection()
//   .then(connection => {
//     console.log('Successfully connected to the database pool.');
//     connection.release(); // Release the connection back to the pool
//   })
//   .catch(err => {
//     console.error('Error connecting to the database pool:', err);
//     // Exit the process if the pool cannot be created initially
//     process.exit(1);
//   });


// // === ROUTE HANDLER FOR THE HOMEPAGE ===
// app.get('/', (req, res) => {
//   // No database interaction needed here, keep it simple
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // === API endpoint to store user details ===
// app.post('/submit', async (req, res, next) => { // Added async and next
//   const { name, email, phoneNumber } = req.body;

//   // Basic validation (Consider using a library like Joi or express-validator for more robust checks)
//   if (!name || !email || !phoneNumber) {
//     // Send a specific error object for client errors
//     const err = new Error('Name, email, and phone number are required.');
//     err.statusCode = 400;
//     return next(err); // Pass to error handler
//   }

//   try {
//     // Check if user exists and their status using the pool
//     const checkSql = 'SELECT id, status FROM users WHERE email = ? OR phone = ?';
//     const [existingUsers] = await pool.execute(checkSql, [email, phoneNumber]); // Use execute for prepared statements

//     if (existingUsers.length > 0) {
//       const existingUser = existingUsers[0];
//       let err;
//       if (existingUser.status === 'disqualified') {
//         console.log(`Attempt to submit by disqualified user: ${email}/${phoneNumber}`);
//         err = new Error('Your session was closed due to switching tabs. Submission denied.');
//         err.statusCode = 403; // Forbidden
//       } else {
//         err = new Error('User already exists with this email or phone number');
//         err.statusCode = 409; // Conflict
//       }
//       return next(err); // Pass specific error to handler
//     }

//     // User does not exist or is not disqualified, proceed to insert
//     const newUser = { name, email, phone: phoneNumber, status: 'active' }; // Start as active
//     const insertSql = 'INSERT INTO users SET ?';
//     const [insertResult] = await pool.query(insertSql, newUser); // query is fine for simple INSERT SET

//     console.log('User inserted with ID:', insertResult.insertId);
//     const googleFormUrl = process.env.GOOGLE_FORM_URL; // Get from environment variables

//     if (!googleFormUrl) {
//         console.warn('GOOGLE_FORM_URL is not set in the environment variables.');
//     }

//     res.status(201).send({
//       message: 'Form submitted successfully',
//       googleFormUrl: googleFormUrl || '', // Send empty string if not set
//       userId: insertResult.insertId // Send back the user ID
//     });

//   } catch (err) {
//     console.error('Error during user submission:', err);
//     // Pass database or unexpected errors to the central handler
//     next(err);
//   }
// });


// // === API endpoint to check if a specific field value exists ===
// app.get('/check-user', async (req, res, next) => { // Added async and next
//   const { field, value } = req.query;

//   // Basic validation
//   if (!field || !value) {
//     const err = new Error('Field and value are required for checking.');
//     err.statusCode = 400;
//     return next(err);
//   }

//   // Map frontend field names to database column names (Whitelist approach)
//   const allowedFields = {
//       name: 'name',
//       email: 'email',
//       phone: 'phone' // Assuming DB column is 'phone'
//   };

//   const columnName = allowedFields[field];

//   if (!columnName) {
//       const err = new Error('Invalid field specified for checking.');
//       err.statusCode = 400;
//       return next(err);
//   }

//   // Use ?? for column name and ? for value to prevent SQL injection
//   const sql = 'SELECT id, status FROM users WHERE ?? = ?';

//   try {
//     // ***** CHANGE HERE: Use pool.query instead of pool.execute *****
//     const [results] = await pool.query(sql, [columnName, value]);
//     // ***** END OF CHANGE *****

//     if (results.length > 0) {
//         const user = results[0];
//         if (user.status === 'disqualified') {
//             return res.status(200).send({
//                 exists: true,
//                 disqualified: true,
//                 message: `User with this ${field} exists and was previously disqualified.`
//             });
//         }
//         // User exists but is not disqualified
//         return res.status(200).send({
//             exists: true,
//             disqualified: false,
//             message: `User with this ${field} already exists.`
//         });
//     } else {
//       // User does not exist with this specific field value
//       return res.status(200).send({ exists: false, message: `User with this ${field} is unique.` });
//     }
//   } catch (err) {
//     console.error(`Error checking user by ${field}:`, err);
//     // Pass database or unexpected errors to the central handler
//     next(err);
//   }
// });


// // === API endpoint to handle disqualification on tab switch ===
// app.post('/disqualify', async (req, res, next) => { // Added async and next
//   const { userId } = req.body;

//   if (!userId) {
//       console.log('Disqualify event received without userId.');
//       // Send specific client error
//       const err = new Error('User ID is required to disqualify.');
//       err.statusCode = 400;
//       return next(err);
//   }

//   const newStatus = 'disqualified';
//   const sql = 'UPDATE users SET status = ? WHERE id = ?';

//   try {
//     const [results] = await pool.execute(sql, [newStatus, userId]); // Use execute

//     if (results.affectedRows > 0) {
//         console.log(`User status updated to disqualified for ID: ${userId}`);
//         return res.status(200).send({ message: 'User status updated to disqualified successfully' });
//     } else {
//         // User ID not found in the database
//         console.log(`User ID ${userId} not found for disqualification update.`);
//         const err = new Error('User not found for status update.');
//         err.statusCode = 404; // Not Found
//         return next(err);
//     }
//   } catch (err) {
//     console.error('Error updating user status to disqualified:', err);
//     // Pass database or unexpected errors to the central handler
//     next(err);
//   }
// });


// // === Centralized Error Handling Middleware ===
// // This MUST be defined AFTER all other app.use() and routes
// app.use((err, req, res, next) => {
//   console.error(err.stack || err); // Log the full error stack or the error itself

//   const statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
//   const message = err.statusCode // If it's a known client error (4xx), send the specific message
//                 ? err.message
//                 : (process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message); // Generic message in production for 5xx

//   res.status(statusCode).send({
//     message: message,
//     // Optionally include error code or type in development
//     // errorType: process.env.NODE_ENV !== 'production' ? err.name : undefined
//   });
// });


// // --- Server Listener ---
// const port = process.env.PORT || 3000; // Use port from .env or default to 3000
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
//   console.log(`Access the form at: http://localhost:${port}`);
// });


// server.js

// // Load environment variables from .env file
// require('dotenv').config();

// const express = require('express');
// const mysql = require('mysql2/promise');
// const bodyParser = require('body-parser');
// const path = require('path');

// // --- Screenshot Dependencies ---
// const puppeteer = require('puppeteer');
// const cron = require('node-cron');
// const fs = require('node:fs/promises'); // Use fs.promises for async operations
// // --- End Screenshot Dependencies ---

// const app = express();
// app.use(bodyParser.json());

// // --- Database Connection Pool Settings ---
// // (Keep your existing pool setup)
// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '', // Default to empty if not set
//   database: process.env.DB_NAME || 'task',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// };
// const pool = mysql.createPool(dbConfig);

// // Serve static files (JS, CSS, etc.)
// app.use('/js', express.static(path.join(__dirname, 'js')));
// // Add CSS if you have it: app.use('/css', express.static(path.join(__dirname, 'css')));

// // Optional: Test pool connection
// pool.getConnection()
//   .then(connection => {
//     console.log('Successfully connected to the database pool.');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('Error connecting to the database pool:', err);
//     process.exit(1);
//   });

  

// // --- Screenshot Configuration ---
// // It's better to get the URL from environment variables if possible
// const urlToCapture = process.env.GOOGLE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSdjoWcHb2PqK1BXPp_U8Z-AYHyaimZ4Ko5-xvmNOOuQquDOTQ/viewform?embedded=true'; // Fallback URL
// const screenshotDirectory = path.join(__dirname, 'screenshots'); // Use path.join for reliability
// const screenshotPrefix = 'screenshot_';
// const cronSchedule = '*/2 * * * *'; // Capture every 2 minutes
// // --- End Screenshot Configuration ---

// // --- Screenshot Function ---
// async function captureScreenshot(url, outputPath) {
//     let browser = null; // Define browser outside try block
//     console.log(`Attempting to capture screenshot of: ${url}`);
//     try {
//         // Launch Puppeteer - consider adding args for server environments
//         browser = await puppeteer.launch({
//              headless: 'new',
//              args: [
//                  '--no-sandbox', // Often needed in Docker/Linux environments
//                  '--disable-setuid-sandbox'
//              ]
//          });
//         const page = await browser.newPage();
//         await page.setViewport({ width: 1280, height: 800 }); // Set a reasonable viewport

//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }); // Wait longer, up to 60s
//         await page.screenshot({ path: outputPath, fullPage: true });
//         console.log(`Screenshot saved to: ${outputPath}`);
//     } catch (error) {
//         console.error(`Error capturing screenshot of ${url}:`, error);
//         // Optional: Add more specific error handling or logging
//     } finally {
//         if (browser) {
//             await browser.close(); // Ensure browser is closed even on error
//             console.log("Puppeteer browser closed.");
//         }
//     }
// }
// // --- End Screenshot Function ---

// // --- Schedule Screenshot Task ---
// async function setupScreenshotTask() {
//     // Create the screenshot directory if it doesn't exist when the server starts
//     try {
//         await fs.mkdir(screenshotDirectory, { recursive: true });
//         console.log(`Screenshot directory ensured: ${screenshotDirectory}`);

//         // Check if the URL is valid before scheduling
//         if (!urlToCapture) {
//             console.warn('GOOGLE_FORM_URL is not defined. Screenshot task will not run.');
//             return;
//         }

//         // Schedule the task
//         cron.schedule(cronSchedule, async () => {
//             console.log(`Cron job triggered: ${new Date().toISOString()}`);
//             const timestamp = Date.now();
//             // Corrected template literal usage for filename/path
//             const filename = `${screenshotPrefix}${timestamp}.png`;
//             const outputPath = path.join(screenshotDirectory, filename); // Use path.join here too
//             await captureScreenshot(urlToCapture, outputPath);
//         }, {
//             scheduled: true,
//             timezone: "Asia/Kolkata" // Example: Set your timezone if needed
//         });

//         console.log(`Screenshot capture scheduled: ${cronSchedule}`);

//     } catch (error) {
//         console.error('Error setting up screenshot directory or scheduling task:', error);
//         // Decide if the server should still run if screenshots fail to set up
//     }
// }

// // Call the setup function when the server starts
// setupScreenshotTask();
// // --- End Schedule Screenshot Task ---


// // === ROUTE HANDLER FOR THE HOMEPAGE ===
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // === API endpoint to store user details ===
// // (Keep your existing /submit route)
// app.post('/submit', async (req, res, next) => {
//     // ... your existing submit logic ...
//     const { name, email, phoneNumber } = req.body;
//     if (!name || !email || !phoneNumber) {
//       const err = new Error('Name, email, and phone number are required.');
//       err.statusCode = 400; return next(err);
//     }
//     try {
//       const checkSql = 'SELECT id, status FROM users WHERE email = ? OR phone = ?';
//       const [existingUsers] = await pool.execute(checkSql, [email, phoneNumber]);
//       if (existingUsers.length > 0) {
//         const existingUser = existingUsers[0];
//         let err;
//         if (existingUser.status === 'disqualified') {
//           err = new Error('Your session was closed due to switching tabs. Submission denied.');
//           err.statusCode = 403;
//         } else {
//           err = new Error('User already exists with this email or phone number');
//           err.statusCode = 409;
//         } return next(err);
//       }
//       const newUser = { name, email, phone: phoneNumber, status: 'active' };
//       const insertSql = 'INSERT INTO users SET ?';
//       const [insertResult] = await pool.query(insertSql, newUser);
//       console.log('User inserted with ID:', insertResult.insertId);
//       const googleFormUrl = process.env.GOOGLE_FORM_URL;
//       if (!googleFormUrl) console.warn('GOOGLE_FORM_URL is not set.');
//       res.status(201).send({
//         message: 'Form submitted successfully',
//         googleFormUrl: googleFormUrl || '',
//         userId: insertResult.insertId
//       });
//     } catch (err) { next(err); }
// });

// // === API endpoint to check if a specific field value exists ===
// // (Keep your existing /check-user route)
// app.get('/check-user', async (req, res, next) => {
//     // ... your existing check-user logic ...
//     const { field, value } = req.query;
//     if (!field || !value) {
//       const err = new Error('Field and value are required for checking.');
//       err.statusCode = 400; return next(err);
//     }
//     const allowedFields = { name: 'name', email: 'email', phone: 'phone' };
//     const columnName = allowedFields[field];
//     if (!columnName) {
//       const err = new Error('Invalid field specified for checking.');
//       err.statusCode = 400; return next(err);
//     }
//     const sql = 'SELECT id, status FROM users WHERE ?? = ?';
//     try {
//       const [results] = await pool.query(sql, [columnName, value]);
//       if (results.length > 0) {
//         const user = results[0];
//         if (user.status === 'disqualified') {
//           return res.status(200).send({ exists: true, disqualified: true, message: `User with this ${field} exists and was previously disqualified.` });
//         }
//         return res.status(200).send({ exists: true, disqualified: false, message: `User with this ${field} already exists.` });
//       } else {
//         return res.status(200).send({ exists: false, message: `User with this ${field} is unique.` });
//       }
//     } catch (err) { next(err); }
// });

// // === API endpoint to handle disqualification on tab switch ===
// // (Keep your existing /disqualify route)
// app.post('/disqualify', async (req, res, next) => {
//     // ... your existing disqualify logic ...
//     const { userId } = req.body;
//     if (!userId) {
//       const err = new Error('User ID is required to disqualify.');
//       err.statusCode = 400; return next(err);
//     }
//     const newStatus = 'disqualified';
//     const sql = 'UPDATE users SET status = ? WHERE id = ?';
//     try {
//       const [results] = await pool.execute(sql, [newStatus, userId]);
//       if (results.affectedRows > 0) {
//         return res.status(200).send({ message: 'User status updated to disqualified successfully' });
//       } else {
//         const err = new Error('User not found for status update.');
//         err.statusCode = 404; return next(err);
//       }
//     } catch (err) { next(err); }
// });


// // === Centralized Error Handling Middleware ===
// // (Keep your existing error handler)
// app.use((err, req, res, next) => {
//   console.error(err.stack || err);
//   const statusCode = err.statusCode || 500;
//   const message = err.statusCode ? err.message : (process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message);
//   res.status(statusCode).send({ message: message });
// });


// // --- Server Listener ---
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
//   console.log(`Access the form at: http://localhost:${port}`);
// });




// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');

// --- Screenshot Dependencies ---
// Puppeteer/Cron setup can potentially be removed if getDisplayMedia is the ONLY method
// const puppeteer = require('puppeteer');
// const cron = require('node-cron');
const fs = require('node:fs/promises'); // Use fs.promises for async operations
// --- End Screenshot Dependencies ---

const app = express();
// Increase payload limit for base64 image data from screen capture
app.use(bodyParser.json({ limit: '20mb' })); // Adjust limit as needed (screen captures can be larger)


// --- Database Connection Pool Settings ---
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Default to empty if not set
  database: process.env.DB_NAME || 'task',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
const pool = mysql.createPool(dbConfig);

// Serve static files (JS, CSS, etc.)
app.use('/js', express.static(path.join(__dirname, 'js')));
// Add CSS if you have it: app.use('/css', express.static(path.join(__dirname, 'css')));

// Optional: Test pool connection
pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the database pool.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database pool:', err);
    process.exit(1);
  });

// --- Screenshot Configuration ---
// Directory for ALL screenshots
const screenshotDirectory = path.join(__dirname, 'screenshots');
const screenCapturePrefix = 'capture_'; // Prefix for getDisplayMedia captures

// --- Ensure Screenshot Directory Exists ---
fs.mkdir(screenshotDirectory, { recursive: true })
  .then(() => console.log(`Screenshot directory ensured: ${screenshotDirectory}`))
  .catch(err => console.error('Error creating screenshot directory:', err));


// === ROUTE HANDLER FOR THE HOMEPAGE ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === API endpoint to store user details ===
// (Keep your existing /submit route as is)
app.post('/submit', async (req, res, next) => {
    const { name, email, phoneNumber } = req.body;
    if (!name || !email || !phoneNumber) {
      const err = new Error('Name, email, and phone number are required.');
      err.statusCode = 400; return next(err);
    }
    try {
      const checkSql = 'SELECT id, status FROM users WHERE email = ? OR phone = ?';
      const [existingUsers] = await pool.execute(checkSql, [email, phoneNumber]);
      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        let err;
        if (existingUser.status === 'disqualified') {
          err = new Error('Your session was closed due to switching tabs or previous disqualification. Submission denied.');
          err.statusCode = 403;
        } else {
          err = new Error('User already exists with this email or phone number');
          err.statusCode = 409;
        } return next(err);
      }
      const newUser = { name, email, phone: phoneNumber, status: 'active' };
      const insertSql = 'INSERT INTO users SET ?';
      const [insertResult] = await pool.query(insertSql, newUser);
      console.log('User inserted with ID:', insertResult.insertId);
      const googleFormUrl = process.env.GOOGLE_FORM_URL;
      if (!googleFormUrl) console.warn('GOOGLE_FORM_URL is not set.');
      res.status(201).send({
        message: 'Form submitted successfully',
        googleFormUrl: googleFormUrl || '',
        userId: insertResult.insertId
      });
    } catch (err) { next(err); }
});

// === API endpoint to check if a specific field value exists ===
// (Keep your existing /check-user route as is)
app.get('/check-user', async (req, res, next) => {
    const { field, value } = req.query;
    if (!field || !value) {
      const err = new Error('Field and value are required for checking.');
      err.statusCode = 400; return next(err);
    }
    const allowedFields = { name: 'name', email: 'email', phone: 'phone' };
    const columnName = allowedFields[field];
    if (!columnName) {
      const err = new Error('Invalid field specified for checking.');
      err.statusCode = 400; return next(err);
    }
    const sql = 'SELECT id, status FROM users WHERE ?? = ?';
    try {
      const [results] = await pool.query(sql, [columnName, value]);
      if (results.length > 0) {
        const user = results[0];
        if (user.status === 'disqualified') {
          return res.status(200).send({ exists: true, disqualified: true, message: `User with this ${field} exists and was previously disqualified.` });
        }
        return res.status(200).send({ exists: true, disqualified: false, message: `User with this ${field} already exists.` });
      } else {
        return res.status(200).send({ exists: false, message: `User with this ${field} is unique.` });
      }
    } catch (err) { next(err); }
});

// === API endpoint to handle disqualification (can be triggered by client) ===
// (Keep your existing /disqualify route as is)
app.post('/disqualify', async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) {
      const err = new Error('User ID is required to disqualify.');
      err.statusCode = 400; return next(err);
    }
    const newStatus = 'disqualified';
    const sql = 'UPDATE users SET status = ? WHERE id = ?';
    try {
      const [results] = await pool.execute(sql, [newStatus, userId]);
      if (results.affectedRows > 0) {
        return res.status(200).send({ message: 'User status updated to disqualified successfully' });
      } else {
        // Don't treat 'user not found' as a server error, just report it
        return res.status(404).send({ message: 'User not found for status update.' });
      }
    } catch (err) { next(err); }
});

// === NEW Endpoint to receive screen captures from getDisplayMedia ===
app.post('/upload-screen-capture', async (req, res, next) => {
    const { imageData, userId, timestamp } = req.body;

    if (!imageData || !imageData.startsWith('data:image/png;base64,')) {
        return res.status(400).send({ message: 'Invalid image data format.' });
    }
    if (!userId) {
         return res.status(400).send({ message: 'User ID is required for screen capture upload.' });
    }

    try {
        // Extract base64 data
        const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
        const safeTimestamp = timestamp || Date.now();
        // Construct filename: capture_userId_timestamp.png
        const filename = `${screenCapturePrefix}${userId}_${safeTimestamp}.png`;
        const outputPath = path.join(screenshotDirectory, filename); // Save to common directory

        // Save the file
        await fs.writeFile(outputPath, base64Data, 'base64');

        console.log(`[Capture] Screen capture received and saved: ${outputPath}`);
        res.status(200).send({ message: 'Screen capture received and saved.' });

    } catch (error) {
        console.error('[Capture] Error saving screen capture:', error);
        // Pass to central error handler
        next(new Error('Failed to save screen capture on server.'));
    }
});
// === End screen capture endpoint ===


// === Centralized Error Handling Middleware ===
// (Keep your existing error handler as is)
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : (process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message);
  res.status(statusCode).send({ message: message });
});


// --- Server Listener ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Access the form at: http://localhost:${port}`);
  console.log(`Screen captures will be saved to: ${screenshotDirectory}`);
});
