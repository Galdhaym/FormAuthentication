var multer = require("multer");
var formUpload = multer({ limits: { fieldSize: 2 * 1024 * 1024 } });
var formImage = formUpload.single("binaryImg");
exports.formImage = formImage;
