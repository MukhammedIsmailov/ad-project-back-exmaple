const fs = require('fs');
const path = require('path');

const uploadsDirectory = path.resolve(__dirname, '../uploads');
// ensure log directory exists
if (!fs.existsSync(uploadsDirectory)) fs.mkdirSync(uploadsDirectory);
