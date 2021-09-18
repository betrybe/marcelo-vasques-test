const path = require('path');
const multer = require('multer');

const GetErrors = require('../errors/getErrors');

module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads'),
    filename(request, file, callback) {
      const recipeId = request.params.id;

      const fileName = `${recipeId}.jpeg`;

      return callback(null, fileName);
    },
  }),
  fileFilter: (request, file, callback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new GetErrors('Invalid file type', 400));
    }
  },
};