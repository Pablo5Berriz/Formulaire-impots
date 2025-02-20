require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public"));

// Rediriger vers index.html par défaut
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ✅ Configuration de multer (stockage temporaire des fichiers)
const upload = multer({ dest: "uploads/" });

// ✅ Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

// ✅ Endpoint pour recevoir et envoyer l'email avec fichiers joints
app.post("/send-email", upload.array("documents"), async (req, res) => {
    try {
        const formData = req.body; // ✅ Données du formulaire
        const files = req.files; // ✅ Fichiers téléversés

        console.log("🟢 Données reçues :", formData);
        console.log("🟢 Fichiers reçus :", files);

        // ✅ Vérifier si des fichiers ont été téléversés
        let attachments = [];
        if (files && files.length > 0) {
            attachments = files.map(file => ({
                filename: file.originalname,
                path: file.path,
            }));
        }

        // ✅ Construire le message avec toutes les informations du formulaire
        let message = `<h2>Vous avez reçu un nouveau formulaire de déclaration d'impôts</h2>`;
        for (let key in formData) {
            message += `<p><strong>${key} :</strong> ${formData[key]}</p>`;
        }

        message += `<h3>📂 Documents joints :</h3>`;
        if (attachments.length > 0) {
            message += `<ul>${attachments.map(file => `<li>${file.filename}</li>`).join("")}</ul>`;
        } else {
            message += `<p>Aucun fichier téléversé.</p>`;
        }

        // ✅ Configuration du mail
        const mailOptions = {
            from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `Nouvelle déclaration d'impôts de ${formData.prenom || "Inconnu"} ${formData.nom_famille || ""}`,
            html: message,
            attachments: attachments,
        };

        // ✅ Envoyer l'email avec les pièces jointes
        await transporter.sendMail(mailOptions);

        // ✅ Supprimer les fichiers après l'envoi
        attachments.forEach(file => fs.unlinkSync(file.path));

        res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error);
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
    }
});


// Lancer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
