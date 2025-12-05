
const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors'); 

const app = express();
const port = 3000; 


const pool = new Pool({
    user: 'postgres',         
    host: 'localhost',              
    database: 'pizzarant_db',   
    password: 'Soccer8888!',   
    port: 5432,                     
});


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.post('/api/reviews', async (req, res) => {
    
    const { user_name, rating, comment } = req.body;

   
    if (!user_name || !rating || !comment) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }
    
    try {
        
        const query = `
            INSERT INTO reviews (user_name, rating, comment)
            VALUES ($1, $2, $3)
            RETURNING review_id, user_name, rating, comment, timestamp;
        `;
        
        
        const result = await pool.query(query, [user_name, rating, comment]);

        res.status(201).json({
            message: 'Reseña creada con éxito.',
            review: result.rows[0]
        });

    } catch (err) {
        console.error('Error al insertar la reseña:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const query = 'SELECT review_id, user_name, rating, comment, timestamp FROM reviews ORDER BY timestamp DESC;';
        const result = await pool.query(query);

        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error al obtener las reseñas:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener las reseñas.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});