import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./Utils/Swagger.js";
import { fileURLToPath } from "url";
import { catchError, HandleERROR } from "vanta-api";
import exportValidation from "./middleware/ExportValidation.js";
import authRouter from "./Routes/Auth.js";
import weatherRouter from "./Routes/Weather.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use(exportValidation);
app.use("/api/weather", weatherRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  return next(new HandleERROR("Not found", 404));
});

app.use(catchError);
export default app;
