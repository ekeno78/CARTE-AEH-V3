const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour permettre à Express de parser les requêtes JSON
app.use(express.json());

// Création d'une connexion à la base de données SQLite
const db = new sqlite3.Database(':memory:');

// Création de la table "lieux" dans la base de données SQLite
db.serialize(() => {
    db.run("CREATE TABLE lieux (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL, type TEXT, description TEXT, photo TEXT, lien TEXT)");
});

// Route pour afficher tous les lieux
app.get('/lieux', (req, res) => {
    db.all("SELECT * FROM lieux", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour ajouter un lieu
app.post('/lieux', (req, res) => {
    const { name, latitude, longitude, type, description, photo, lien } = req.body;
    db.run("INSERT INTO lieux (name, latitude, longitude, type, description, photo, lien) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, latitude, longitude, type, description, photo, lien],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

// Route pour effacer un lieu par son ID
app.delete('/lieux/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM lieux WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
