import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './Router/route.js';
import db from './Database/db.js';

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack


/** api routes */
app.use('/api', router);

const port= 9090;

app.get("/",(req,res)=>{
    res.status(201).json("Home get request");
})
db.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    app.listen(port,()=>{
        console.log("Connected to database");
        console.log('server started at port'+port);
    }) 
  });

     