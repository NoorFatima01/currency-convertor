import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.listen(7000, () => {
    console.log('Server is running on port 7000');
})