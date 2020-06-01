import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log("listing users");

    response.json([
        "Rodrigo",
        "Americo",
        "Joana",
        "Daniel",
        "Margarida"
    ]);
});

app.listen(3333);