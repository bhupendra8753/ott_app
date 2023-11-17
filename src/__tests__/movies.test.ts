import request from 'supertest';
import app from "./../server";
import mongoose from 'mongoose';


beforeAll( async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/ott-app')
});

afterAll( async () => {
    await mongoose.connection.close();
});

describe('Movie API', () => {
    let movieId : string;

    it('should add a new movie', async () => {
        const newMovie = {
            title : 'Test Movie',
            genre : 'Comedy',
            rating : 3.0,
            streamingLink : "http://test-movie.com"
        };
        //Querying
        const response = await request(app)
            .post('/movies')
            .send(newMovie)
            .set('role', 'admin'); // Set admin role header
        //Asertion
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Movie');
        expect(response.body.genre).toBe('Comedy');

        movieId = response.body._id
    });

    it('Should not add a new movie without admin role', async () => {
        const newMovie = {
            title : 'Test Movie',
            genre : 'Comedy',
            rating : 3.0,
            streamingLink : "http://test-movie.com"
        };
        const response = await request(app).post('/movies').send(newMovie);

        expect(response.status).toBe(403);
    });

    it('should get all movies', async () => {
        const response = await request(app).get('/movies');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3); // Assuming there is 1 movie in the db
    });

    it('Should search for a movie by title or genre', async () => {
        const response = await request(app).get('/search?q=Comedy');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0].genre).toBe('Comedy');
    });

    it('Should update an existing movie with admin role', async () => {
        const updatedMovieDetails = {
            title : 'Upadte Test Movie',
            genre : 'Comedy',
            rating : 4.6,
            streamingLink : "http://test-movie.com"
        };

        const updateResponse = await request(app)
            .put(`/movies/${movieId}`)
            .send(updatedMovieDetails)
            .set('role', 'admin');

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.title).toBe('Upadte Test Movie');
    });

    it('Should not update an existing movie without admin role', async () => {
        const updatedMovieDetails = {
            title : 'Upadte Test Movie',
            genre : 'Comedy',
            rating : 4.6,
            streamingLink : "http://test-movie.com"
        };
        const updateResponse = await request(app)
            .put(`/movies/${movieId}`)
            .send(updatedMovieDetails);

        expect(updateResponse.status).toBe(403);
    });

    it('Should delete movie with admin role', async () => {
        const deleteResponse = await request(app)
            .delete(`/movies/${movieId}`)
            .set('role', 'admin');

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Movie Deleted Successfully!!");
    });

    it('Should not delete movie without admin role', async () => {
        const deleteResponse = await request(app)
        .delete(`/movies/${movieId}`);

        expect(deleteResponse.status).toBe(403);
    })
})