import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimiter from "express-rate-limit";

/** IMPORT: CUSTOM MODULES */
import connectDB from "./config/connectDB.js";

/** IMPORT: CUSTOM MIDDLEWARE */
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

/** IMPORT: ROUTES */
import routes from "./routes/index.js";

/** APP CONFIG */
dotenv.config();
connectDB();
const app = express();
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

/** ROUTES */
app.get("/", (_, res) => res.send("This is JOBS API V1"));
app.use("/api/v1", routes);

/** MIDDLEWARE AFTER ROUTES */
app.use(notFound);
app.use(errorHandler);

/** START APP */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server already running on port: ${port}`));
