import express from "express";
import dotenv from "dotenv";
import "express-async-errors";

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
app.use(express.json());

/** ROUTES */
app.get("/", (_, res) => res.send("This is JOBS API V1"));
app.use("/api/v1", routes);

/** MIDDLEWARE AFTER ROUTES */
app.use(notFound);
app.use(errorHandler);

/** START APP */
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server already running on port: ${port}`));
