const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// Modèles
const Etudiant = require('./models/etudiant');
const Enseignant = require('./models/enseignant');

// Middleware pour authentification (si utilisé)
const authenticateToken = require('./middlewares/auth');

// Clé secrète JWT
const SECRET_KEY = 'votre_cle_secrete_super_securisee';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Pour servir login.html ou autres fichiers

// Connexion MongoDB
mongoose.connect("mongodb+srv://eladouibouthaina:bouthaina123abc@first.5lpczq5.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=first")
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// 🔐 Inscription
app.post('/inscription', async (req, res) => {
  const data = req.body;

  try {
    // Vérifie si l'email est déjà utilisé
    const emailExists = await Etudiant.findOne({ email: data.email }) || await Enseignant.findOne({ email: data.email });
    if (emailExists) {
      return res.status(400).send('❌ Ce courriel est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    if (data.type === 'etudiant') {
      const etudiant = new Etudiant(data);
      await etudiant.save();
      res.status(201).send('✅ Étudiant inscrit avec succès');
    } else if (data.type === 'enseignant') {
      const enseignant = new Enseignant(data);
      await enseignant.save();
      res.status(201).send('✅ Enseignant inscrit avec succès');
    } else {
      res.status(400).send('❌ Type d’utilisateur invalide');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erreur serveur');
  }
});

// 🔐 Connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send('❌ Email ou mot de passe manquant');
    }

    let user = await Etudiant.findOne({ email });
    let type = 'etudiant';

    if (!user) {
      user = await Enseignant.findOne({ email });
      type = 'enseignant';
    }

    if (!user) return res.status(400).send('❌ Utilisateur non trouvé');

    if (!user.password) {
      return res.status(500).send('❌ Aucune donnée de mot de passe trouvée');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('❌ Mot de passe incorrect');

    const token = jwt.sign({ id: user._id, email: user.email, type }, SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({ message: '✅ Connexion réussie', type, token });
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erreur serveur');
  }
});

// ✅ Route protégée (si utilisée)
app.get('/route-protegee', authenticateToken, (req, res) => {
  res.send(`Bonjour ${req.user.email}, accès autorisé.`);
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log('🚀 Serveur démarré sur http://localhost:3000');
});