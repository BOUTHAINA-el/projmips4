const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ➕ حقل mot de passe
  nom: String,
  prenom: String,
  dateNaissance: Date,
  sexe: String,
  etablissement: String,
  filiere: String
});

module.exports = mongoose.model('Etudiant', etudiantSchema);