const bcrypt = require('bcrypt');

const password = 'TantaWarehouse'; // ganti sesuai password yang mau dipake
bcrypt.hash(password, 10, (err, hash) => {
  console.log('Hashed password:', hash);
});