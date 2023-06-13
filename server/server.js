import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './Router/route.js';

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack


/** api routes */
app.use('/api', router);

const port= 8080;

app.get("/",(req,res)=>{
    res.status(201).json("Home get request");
})

app.listen(port,()=>{
    console.log('server started at port'+port);
}) 
     