import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${randomUUID()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file: Express.Multer.File, filetypes: RegExp, cb: multer.FileFilterCallback) {
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Wrong File Type Provided, Allowed File Types: ${filetypes}`));
  }
}

const uploadFile = (args?: { maxSize?: number; filetypes?: RegExp }) => {
  return multer({
    storage,
    limits: { fileSize: args?.maxSize || 1000000 },
    fileFilter: (req, file, cb) => checkFileType(file, args?.filetypes || /jpg|jpeg|png/, cb),
  });
};

export default uploadFile;
