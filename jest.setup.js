process.env = {
  ...process.env,
  ...require('dotenv').config({ path: '.env.test' }).parsed,
};