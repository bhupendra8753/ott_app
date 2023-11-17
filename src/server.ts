import express, {Request, Response} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//Initializing the app
const app = express();
const PORT = 3000;
let server: any;

app.use(bodyParser.json());
app.use(express.urlencoded({extended : true}))
app.use(express.json())

//MongoDB Connection
const mongodbUriString = "mongodb://127.0.0.1:27017/ott-app";
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongodbUriString);
        console.log("MongoDB Connected Successfully");
        
    } catch (error) {
        console.log("Error connecting to MongoDb: ", error);
        process.exit(1);
    }
}
connectDB();

//Schema
const movieSchema = new mongoose.Schema({
    title : String,
    genre : String,
    rating : Number,
    streamingLink : String
});

const Movie = mongoose.model("Movie", movieSchema);


// Admin check middleware
const checkAdminRole = ( req : Request, res : Response, next : Function) => {
    const isAdmin = req.headers['role'] === 'admin';
    if(!isAdmin){
        return res.status(403).json({ error : "Unauthorized : Admin role required!!"})
    }
    next();
};

//-------------API routes----------
// Add a new movie to the lobby
app.post('/movies', checkAdminRole, async ( req : Request, res: Response) => {
    const { title, genre, rating, streamingLink } = req.body;

    if(!title || !genre || !rating ||!streamingLink) {
        return res.status(400).json({ error : "Missing required feilds"})
    };

    const newMovie = new Movie({
        title,
        genre,
        rating,
        streamingLink
    });

    try{
        const saveMovie = await newMovie.save();
        res.json(saveMovie);
    } catch (error) {
        res.status(500).json({ error : "Internal server Error!"})
    }
});


//List all the movies in the lobby
app.get('/movies', async (req: Request, res: Response) => {
    try{
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error : "Internal server Error!"})
    }
});


//Search a movie by title or genre
app.get('/search', async (req: Request, res: Response) => {
    const { q } = req.query;
    try{
        let movies;

        if(q) {
            movies = await Movie.find({
                $or : [
                    {title : new RegExp (q as string, 'i') },
                    {genre : new RegExp (q as string, 'i') }
                ]
            })
        } else {
            movies = await Movie.find();
        }

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error : "Internal server Error!"})
    }
});


//Update an existing movie's information
app.put('/movies/:id', checkAdminRole, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, genre, rating, streamingLink } = req.body;

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { title, genre, rating, streamingLink },
            {new : true}
        );
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error : "Internal server Error!"})
    }
});


//Delete a movie from the lobby
app.delete('/movies/:id', checkAdminRole, async (req: Request, res: Response) => {
    const { id } = req.params;

    try{
        await Movie.findByIdAndDelete(id);
        res.status(200).json({ message : "Movie Deleted Successfully!!"})
    } catch(error) {
        res.status(500).json({ error : "Internal server Error!"})
    }
});


server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

export default app;