import express from "express";
import initRouter from './src/routers';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'], // Chỉ cần để trong mảng
    credentials: true,
}));
const port = process.env.PORT || 3003;
const MONGODB_URI = process.env.DATABASE_URL

mongoose.connect(MONGODB_URI).then(() => {
    console.log("Đã kết nối tới cơ sở dữ liệu");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})



initRouter(app);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

