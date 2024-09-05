"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destination = exports.editFileName = exports.fileFilter = void 0;
const path_1 = require("path");
const fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|gif|txt|pdf|mp4|docx|xlsx)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
exports.fileFilter = fileFilter;
const editFileName = (req, file, callback) => {
    const customer_id = req.body.customer_id;
    const country_code = req.body.country_code;
    const user_id = req.body.uploaded_created_by_user_id;
    const app_id = req.body.app_id;
    const name = file.originalname.split('.')[0];
    const fileExtensionName = (0, path_1.extname)(file.originalname);
    const random = new Date().toISOString();
    callback(null, `${country_code}_${customer_id}_${user_id}_${app_id}_${name}_${random.replace(/:/g, '-')}${fileExtensionName}`);
};
exports.editFileName = editFileName;
const destination = async (req, file, callback) => {
    const body = req.body;
    const basePath = process.env.BASE_PATH;
    return callback(null, basePath);
};
exports.destination = destination;
//# sourceMappingURL=file-upload.utils.js.map