const nodemailer = require("nodemailer");
const formidable = require("formidable");
const fs = require("fs");

// ✅ Désactiver le bodyParser par défaut de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur lors du traitement du formulaire :", err);
      return res.status(500).json({ success: false, message: "Erreur de traitement du formulaire" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: "Variables d'environnement manquantes" });
    }

    // ✅ Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Construction du message avec les données du formulaire
    let message = `<h2>Nouvelle soumission de formulaire</h2>`;
    for (const key in fields) {
      message += `<p><strong>${key} :</strong> ${fields[key]}</p>`;
    }

    // ✅ Préparer les fichiers téléversés comme pièces jointes
    let attachments = [];
    if (files.documents) {
      const uploadedFiles = Array.isArray(files.documents) ? files.documents : [files.documents];
      attachments = uploadedFiles.map((file) => ({
        filename: file.originalFilename,
        path: file.filepath,
      }));
    }

    // ✅ Configuration de l'e-mail avec pièces jointes
    const mailOptions = {
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouveau formulaire soumis par ${fields.prenom || "Inconnu"} ${fields.nom_famille || ""}`,
      html: message + `<h3>📂 Documents joints :</h3>` + (attachments.length > 0 ? `<ul>${attachments.map((file) => `<li>${file.filename}</li>`).join("")}</ul>` : `<p>Aucun fichier téléversé.</p>`),
      attachments: attachments,
    };

    // ✅ Envoi de l'e-mail avec les pièces jointes
    try {
      await transporter.sendMail(mailOptions);

      // ✅ Suppression des fichiers temporaires après envoi
      attachments.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      res.status(200).json({ success: true, message: "E-mail envoyé avec succès avec les fichiers joints !" });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res.status(500).json({ success: false, message: `Erreur serveur : ${error.message}` });
    }
  });
}
