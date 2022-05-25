const multer = require("multer");
const { APIError } = require("../utils/APIError");

const singleImageMulter = function () {
    const supportedMimes = ['image/jpeg', 'image/png'];
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, next) => {
            if (supportedMimes.includes(file.mimetype)) {
                next(null, true);
            } else {
                next(new APIError(415));
            }
        }
    });
    return upload.single('image');
}

module.exports = {
    singleImageMulter
}