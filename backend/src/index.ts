import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import exchangeRouter from './exchange';
import path from 'path';

const app = express();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/exchange', exchangeRouter);


app.listen(7000, () => {
    console.log('Server is running on port 7000');
})