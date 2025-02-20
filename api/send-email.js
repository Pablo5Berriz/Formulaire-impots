const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { email, prenom, nom_famille, documents } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Comptaclems" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouvelle déclaration d'impôts de ${prenom} ${nom_famille}`,
      html: `<p><strong>Nom:</strong> ${prenom} ${nom_famille}</p>
             <p><strong>Email:</strong> ${email}</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).json({ success: false, message: "Erreur d'envoi de l'email." });
  }
};
