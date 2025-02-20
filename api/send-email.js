const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const formData = req.body;

    // ✅ Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Construire le message avec toutes les informations du formulaire
    let message = `<h2>Vous avez reçu un nouveau formulaire de déclaration d'impôts</h2>`;
    for (let key in formData) {
      message += `<p><strong>${key} :</strong> ${formData[key]}</p>`;
    }

    // ✅ Paramètres de l'email
    const mailOptions = {
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouvelle déclaration d'impôts de ${formData.prenom || "Inconnu"} ${formData.nom_famille || ""}`,
      html: message,
    };

    // ✅ Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email." });
  }
}
