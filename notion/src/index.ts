import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import tasksRoutes from "./database/routes/taskRoutes";
import usersRoutes from "./database/routes/userRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRoutes);
app.use('/users', usersRoutes);

const port = 8080;
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_API_KEY });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});