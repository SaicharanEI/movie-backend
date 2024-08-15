// src/common/multer-config.ts
import { diskStorage } from "multer";
import { extname } from "path";

export const multerOptions = {
  storage: diskStorage({
    destination: "./uploads", // Directory to store files
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
};
