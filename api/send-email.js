import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";
import path from "path";
import { promisify } from "util";

// 🔒 Configurer le transporteur Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔗 Configurer multer pour les fichiers téléversés
const upload = multer({ dest: "/tmp" }); // Stocker temporairement les fichiers sur Vercel

// ✅ Convertir multer en fonction compatible avec Vercel
const uploadMiddleware = upload.array("documents");

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  try {
    await runMiddleware(req, res, uploadMiddleware);

    const formData = req.body;
    const files = req.files;

    console.log("🟢 Données reçues :", formData);
    console.log("🟢 Fichiers reçus :", files);

    // ✅ Préparer les pièces jointes
    let attachments = [];
    if (files && files.length > 0) {
      attachments = files.map((file) => ({
        filename: file.originalname,
        path: file.path,
      }));
    }

    // ✅ Construire le contenu de l'e-mail
    let message = `<h2>Nouvelle déclaration d'impôts</h2>`;
    for (let key in formData) {
      message += `<p><strong>${key} :</strong> ${formData[key]}</p>`;
    }

    message += `<h3>📂 Documents joints :</h3>`;
    if (attachments.length > 0) {
      message += `<ul>${attachments.map((file) => `<li>${file.filename}</li>`).join("")}</ul>`;
    } else {
      message += `<p>Aucun fichier téléversé.</p>`;
    }

    // ✅ Envoyer l'email
    await transporter.sendMail({
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouvelle déclaration de ${formData.prenom || "Inconnu"} ${formData.nom_famille || ""}`,
      html: message,
      attachments: attachments,
    });

    // ✅ Supprimer les fichiers temporaires
    for (const file of attachments) {
      await promisify(fs.unlink)(file.path);
    }

    res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
  }
}
