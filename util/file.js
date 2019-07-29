const fs = require("fs");

const deleteFile = filePath => {
  fs.unlinkSync(filePath, err => {
    throw err;
  });
};

exports.deleteFile = deleteFile;
