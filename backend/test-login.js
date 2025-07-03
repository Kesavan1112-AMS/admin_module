const fetch = require('node-fetch');

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@default.com',
    password: 'Admin@123',
    companyId: 1,
  }),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
