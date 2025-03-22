import app from './config/app';
import dotenv from 'dotenv';
dotenv.config();

app.listen(5050, () => console.log('Server running at: http://localhost:5050'));
