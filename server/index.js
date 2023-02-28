import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routers/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";

// configurations
// This is only implemented when ypu use type module in package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.json());

// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately. Helmet is a collection of several smaller middleware functions that set security-related HTTP response headers.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process.
app.use(morgan("common"));

// we can use bodyParser to limit the upload file size
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// files storage is used for uploading files

// There are two options available, destination and filename. They are both functions that determine where the file should be stored.

// destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system’s default directory for temporary files is used.

// Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.

// filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn’t include any file extension.

// Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension.

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, res, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// routes with files
app.post("/auth/register", upload.single("picture"), register);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// mongoose setup
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
