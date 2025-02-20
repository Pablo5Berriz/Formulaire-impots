const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const formData = req.body;

    // ✅ Vérifier que les variables d'environnement sont disponibles
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Variables d'environnement manquantes");
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

    // ✅ Construire le message avec toutes les informations du formulaire
    let message = `<h2>Nouveau formulaire soumis</h2>`;
    for (let key in formData) {
      message += `<p><strong>${key}:</strong> ${formData[key]}</p>`;
    }

    // ✅ Configuration du mail
    const mailOptions = {
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Formulaire soumis par ${formData.prenom || "Inconnu"} ${formData.nom_famille || ""}`,
      html: message,
    };

    // ✅ Envoyer l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ success: false, message: `Erreur serveur: ${error.message}` });
  }
}
