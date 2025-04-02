const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const dotenv = require('dotenv');
const connectDb = require('./db/db')
dotenv.config();
//import dotenv 
//call db connetion file
connectDb();


const port = process.env.PORT || 5000;

//listen server on the port
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})