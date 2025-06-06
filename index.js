const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

mongoose.connect('mongodb+srv://majidaelghadiri:Mm0fUCzo0lzlJeuq@cluster0.wlttytx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const examSchema = new mongoose.Schema({
    examTitle: String,
    description: String,
    audience: String,
    questions: Array,
    link: String
});

const Exam = mongoose.model('Exam', examSchema);

app.post('/api/exams', async (req, res) => {
    const { title, desc, audience, questions } = req.body;
    const link = uuidv4();

    const exam = new Exam({
        examTitle: title,
        description: desc,
        audience: audience,
        questions: questions,
        link: link
    });

    await exam.save();
    res.json({ id: link });
});

app.get('/api/exams/:id', async (req, res) => {
    try {
        const exam = await Exam.findOne({ link: req.params.id });
        if (!exam) {
            return res.status(404).json({ message: 'Examen introuvable' });
        }
        res.json(exam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Modèle MongoDB pour stocker la géolocalisation
const geoSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now }
});

const GeoLocation = mongoose.model('GeoLocation', geoSchema);

// Route pour recevoir et sauvegarder les coordonnées
app.post('/api/geolocation', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
        return res.status(400).json({ message: 'Coordonnées manquantes' });
    }

    const location = new GeoLocation({ latitude, longitude });
    await location.save();

    res.json({ message: 'Coordonnées enregistrées avec succès', location });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur en marche sur http://localhost:${PORT}`);
});



