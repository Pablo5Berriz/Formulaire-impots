const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const formData = req.body;

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

    // ✅ Construction du message
    let message = `<h2>Nouvelle soumission de formulaire</h2>`;
    for (const key in formData) {
      message += `<p><strong>${key} :</strong> ${formData[key]}</p>`;
    }

    // ✅ Configuration de l'e-mail
    const mailOptions = {
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouveau formulaire soumis par ${formData.prenom || "Inconnu"} ${formData.nom_famille || ""}`,
      html: message,
    };

    // ✅ Envoi de l'e-mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "E-mail envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur d'envoi d'e-mail :", error);
    res.status(500).json({ success: false, message: `Erreur serveur : ${error.message}` });
  }
}
