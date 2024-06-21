import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import exchangeRouter from './exchange';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/exchange', exchangeRouter);


app.listen(7000, () => {
    console.log('Server is running on port 7000');
})