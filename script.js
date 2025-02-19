let currentStep = 1; 
const formSections = document.querySelectorAll(".form-section");
const totalSteps = formSections.length;
const titleSection = document.getElementById("title-section");

// Sélection des boutons de navigation
const nextButton = document.querySelector(".btn-primary");
const prevButton = document.querySelector(".btn-secondary");
const submitButton = document.getElementById("submit-button");

// Sélection des champs dynamiques
const etatCivil = document.getElementById("etat-civil");
const travailleurAutonome = document.getElementById("Travailleur");
const enfantsChargeRadios = document.querySelectorAll("input[name='enfants']");
const sectionEnfants = document.getElementById("infos-enfants");
const sectionTravailleur = document.querySelector("[data-step='7']");
const enfantsContainer = document.getElementById("enfants-container");
const tarifPersonneSeule = document.getElementById("tarif-personne-seule");
const tarifCouple = document.getElementById("tarif-couple");
const tarifTravailleurAutonome = document.getElementById("tarif-travailleur-autonome");
const documentsInput = document.getElementById("documents");
const fileListContainer = document.getElementById("file-list");
documentsInput.parentElement.appendChild(fileListContainer);

// ✅ Fonction pour mettre à jour l'affichage des sections et boutons
function updateStepVisibility() {
    formSections.forEach((section, index) => {
        section.style.display = (index + 1 === currentStep) ? "block" : "none";
    });

    // Affichage du titre uniquement à l'étape 1
    titleSection.style.display = (currentStep === 1) ? "block" : "none";

    // Affichage des boutons de navigation
    prevButton.style.display = (currentStep === 1) ? "none" : "inline-block";
    nextButton.style.display = (currentStep < totalSteps) ? "inline-block" : "none";
    submitButton.style.display = (currentStep === totalSteps) ? "inline-block" : "none";

    // ✅ S'assurer que le bouton "Retour" reste visible dans la dernière section
    if (currentStep === totalSteps) {
        prevButton.style.display = "inline-block"; 
        nextButton.style.display = "none";
    }

    // ✅ Vérifier si la section 4 est atteinte
    if (currentStep === 4) {
        genererChampsConjoint();
    }

    // ✅ Générer les champs enfants uniquement lorsque l'utilisateur arrive en section 5
    if (currentStep === 5) {
        const selectedEnfants = document.querySelector("input[name='enfants']:checked")?.value || "0";
        genererChampsEnfants(parseInt(selectedEnfants));
    }
}

// ✅ Fonction pour mettre à jour la tarification en section 8
function updateTarification() {
    const etatCivilValue = etatCivil.value;
    const isTravailleur = travailleurAutonome.value === "Oui";

    // ✅ Réinitialisation des affichages
    tarifPersonneSeule.style.display = "none";
    tarifCouple.style.display = "none";
    tarifTravailleurAutonome.style.display = "none";

    // ✅ Cas : Marié(e) ou Conjoint(e) de fait
    if (["Marié(e)", "Conjoint(e) de fait"].includes(etatCivilValue)) {
        if (isTravailleur) {
            tarifTravailleurAutonome.style.display = "block"; 
        } else {
            tarifCouple.style.display = "block"; 
        }
    } 
    else {
        if (isTravailleur) {
            tarifTravailleurAutonome.style.display = "block"; 
        } else {
            tarifPersonneSeule.style.display = "block"; 
        }
    }
}


// ✅ Fonction pour générer dynamiquement les champs enfants
function genererChampsEnfants(nombre) {
    enfantsContainer.innerHTML = ""; 

    for (let i = 1; i <= nombre; i++) {
        let enfantHtml = `
            <div class="form-group enfant-section">
                <h3>Enfant ${i}</h3>
                
                <label>Nom </label>
                <div class="input-group">
                    <input type="text" placeholder="Prénom" required>
                    <input type="text" placeholder="Deuxième prénom">
                    <input type="text" placeholder="Nom de famille" required>
                </div>

                <label>Date de naissance </label>
                <input type="date" required>

                <label>Numéro d'assurance sociale </label>
                <input type="text" placeholder="ex: 123123123" required>

                <h4>Où vit l'enfant?</h4>
                <div class="radio-group">
                    <label><input type="radio" name="adresse-enfant-${i}" value="meme" required> Vit à la même adresse que vous</label>
                    <label><input type="radio" name="adresse-enfant-${i}" value="autre"> Vit à une autre adresse</label>
                </div>

                <div class="adresse-container" id="adresse-container-${i}">
                    <h4>Si adresse différente, veuillez la renseigner ici</h4>

                    <label>Numéro et rue </label>
                    <input type="text" placeholder="Ex: 123 Rue Principale">
                    
                    <label>Ville </label>
                    <input type="text" placeholder="Ex: Montréal">
                    
                    <label>Province </label>
                    <select>
                        <option value="">Veuillez sélectionner votre province</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">Colombie-Britannique</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">Nouveau-Brunswick</option>
                        <option value="NL">Terre-Neuve-et-Labrador</option>
                        <option value="NS">Nouvelle-Écosse</option>
                        <option value="NT">Territoires du Nord-Ouest</option>
                        <option value="NU">Nunavut</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Île-du-Prince-Édouard</option>
                        <option value="QC">Québec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="YT">Yukon</option>
                        <option value="Autre">Autre</option>
                    </select>

                    <label>Code Postal </label>
                    <input type="text" pattern="[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d" placeholder="Ex: A1A 1A1">

                    <label>Pays </label>
                    <select>
                    <option value="">Veuillez sélectionner votre pays</option>
                                <option value="Autre">Burkina Faso</option>
                                <option value="Autre">Burundi</option>
                                <option value="Autre">Cameroun</option>
                                <option value="Autre">Canada</option>
                                <option value="Autre">Cap-Vert</option>
                                <option value="Autre">Côte d'Ivoire</option>
                                <option value="Autre">Congo</option>
                                <option value="Autre">Djibouti</option>
                                <option value="Autre">Gabon</option>
                                <option value="Autre">Gambia</option>
                                <option value="Autre">Ghana</option>
                                <option value="Autre">Guinée</option>
                                <option value="Autre">Guinée-Bissau</option>
                                <option value="Autre">Léopoldville</option>
                                <option value="Autre">Liberia</option>
                                <option value="Autre">Libye</option>
                                <option value="Autre">Madagascar</option>
                                <option value="Autre">Malawi</option>
                                <option value="Autre">Mali</option>
                                <option value="Autre">Mauritanie</option>
                                <option value="Autre">Maurice</option>
                                <option value="Autre">Niger</option>
                                <option value="Autre">Nigeria</option>
                                <option value="Autre">Rwanda</option>
                                <option value="Autre">Sénégal</option>
                                <option value="Autre">Serbie</option>
                                <option value="Autre">Sierra Leone</option>
                                <option value="Autre">Tchad</option>
                                <option value="Autre">Togo</option>
                                <option value="Autre">Tunisie</option>
                                <option value="Autre">Yémen</option>
                                <option value="Autre">Zambie</option>
                                <option value="Autre">Zimbabwe</option>
                    </select>
                </div>
            </div>
        `;
        enfantsContainer.insertAdjacentHTML("beforeend", enfantHtml);
    }

    // ✅ Appliquer la gestion du masquage de l'adresse pour chaque enfant
    document.querySelectorAll(".enfant-section").forEach((enfantSection, index) => {
        const radioButtons = enfantSection.querySelectorAll(`input[name="adresse-enfant-${index + 1}"]`);
        const adresseContainer = document.getElementById(`adresse-container-${index + 1}`);

        radioButtons.forEach(radio => {
            radio.addEventListener("change", function () {
                adresseContainer.style.display = (radio.value === "meme") ? "none" : "block";
            });
        });
    });
}

function genererChampsConjoint() {
    const conjointsContainer = document.getElementById("conjoints-container");
    const etatCivilValue = document.getElementById("etat-civil").value;
    const sectionConjoint = document.getElementById("infos-conjoints"); // Section dédiée aux conjoints

    // ✅ Vérification si on est dans la section 4 avant d'afficher le formulaire
    if (currentStep !== 4) {
        sectionConjoint.style.display = "none";
        return;
    }

    // ✅ Vérification de l'état civil pour afficher ou masquer la section conjoint
    if (["Marié(e)", "Conjoint(e) de fait"].includes(etatCivilValue)) {
        sectionConjoint.style.display = "block";
    } else {
        sectionConjoint.style.display = "none";
        return; // Ne pas ajouter de champs si l'utilisateur n'est pas marié ou conjoint
    }

    // ✅ Vérifier si les champs existent déjà pour éviter la duplication
    if (!document.querySelector(".conjoint-section")) {
        let conjointHtml = `
            <div class="form-group conjoint-section">
                <h3>Informations sur l'époux(se) ou conjoint(e) de fait</h3>
                
                <label>Nom </label>
                <div class="input-group">
                    <input type="text" placeholder="Prénom" required>
                    <input type="text" placeholder="Deuxième prénom">
                    <input type="text" placeholder="Nom de famille" required>
                </div>

                <label>Date de naissance </label>
                <input type="date" required>

                <label>Numéro d'assurance sociale </label>
                <input type="text" placeholder="ex: 123123123" required>

                <h4>Où vit l'époux(se) ou conjoint(e) de fait?</h4>
                <div class="radio-group">
                    <label><input type="radio" name="adresse-conjoint" value="meme" required> Vit à la même adresse que vous</label>
                    <label><input type="radio" name="adresse-conjoint" value="autre"> Vit à une autre adresse</label>
                </div>

                <div class="adresse-container" id="adresse-conjoint-container">
                    <h4>Si adresse différente, veuillez la renseigner ici</h4>

                    <label>Numéro et rue </label>
                    <input type="text" placeholder="Ex: 123 Rue Principale">

                    <label>Ville </label>
                    <input type="text" placeholder="Ex: Montréal">

                    <label>Province </label>
                    <select>
                        <option value="">Veuillez sélectionner votre province</option>
                        <option value="AB">Alberta</option>
                        <option value="BC">Colombie-Britannique</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">Nouveau-Brunswick</option>
                        <option value="NL">Terre-Neuve-et-Labrador</option>
                        <option value="NS">Nouvelle-Écosse</option>
                        <option value="NT">Territoires du Nord-Ouest</option>
                        <option value="NU">Nunavut</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Île-du-Prince-Édouard</option>
                        <option value="QC">Québec</option>
                        <option value="SK">Saskatchewan</option>
                        <option value="YT">Yukon</option>
                        <option value="Autre">Autre</option>
                    </select>

                    <label>Code Postal </label>
                    <input type="text" pattern="[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d" placeholder="Ex: A1A 1A1">

                    <label>Pays </label>
                    <select>
                        <option value="">Veuillez sélectionner votre pays</option>
                        <option value="Autre">Burkina Faso</option>
                        <option value="Autre">Burundi</option>
                        <option value="Autre">Cameroun</option>
                        <option value="Canada">Canada</option>
                        <option value="Autre">Cap-Vert</option>
                        <option value="Autre">Côte d'Ivoire</option>
                        <option value="Autre">Congo</option>
                        <option value="Autre">Djibouti</option>
                        <option value="Autre">Gabon</option>
                        <option value="Autre">Gambia</option>
                        <option value="Autre">Ghana</option>
                        <option value="Autre">Guinée</option>
                        <option value="Autre">Guinée-Bissau</option>
                        <option value="Autre">Léopoldville</option>
                        <option value="Autre">Liberia</option>
                        <option value="Autre">Libye</option>
                        <option value="Autre">Madagascar</option>
                        <option value="Autre">Malawi</option>
                        <option value="Autre">Mali</option>
                        <option value="Autre">Mauritanie</option>
                        <option value="Autre">Maurice</option>
                        <option value="Autre">Niger</option>
                        <option value="Autre">Nigeria</option>
                        <option value="Autre">Rwanda</option>
                        <option value="Autre">Sénégal</option>
                        <option value="Autre">Serbie</option>
                        <option value="Autre">Sierra Leone</option>
                        <option value="Autre">Tchad</option>
                        <option value="Autre">Togo</option>
                        <option value="Autre">Tunisie</option>
                        <option value="Autre">Yémen</option>
                        <option value="Autre">Zambie</option>
                        <option value="Autre">Zimbabwe</option>
                    </select>
                </div>
            </div>
        `;
        conjointsContainer.innerHTML = conjointHtml; 
    }

    // ✅ Gérer l'affichage de l'adresse selon le choix de l'utilisateur
    const radioButtons = document.querySelectorAll(`input[name="adresse-conjoint"]`);
    const adresseContainer = document.getElementById(`adresse-conjoint-container`);

    radioButtons.forEach(radio => {
        radio.addEventListener("change", function () {
            adresseContainer.style.display = (radio.value === "meme") ? "none" : "block";
        });
    });
}

// ✅ Fonction pour déterminer la prochaine section
function getNextStep(step) {
    const selectedEtatCivil = document.getElementById("etat-civil").value;
    const selectedEnfants = document.querySelector("input[name='enfants']:checked")?.value || "0";
    const isTravailleur = document.getElementById("Travailleur").value === "Oui";

    if (step === 3) {
        if (["Marié(e)", "Conjoint(e) de fait"].includes(selectedEtatCivil)) {
            return 4; 
        }
        if (selectedEnfants === "0") {
            return 6; 
        }
        return 5; 
    }

    if (step === 4) {
        if (selectedEnfants === "0") {
            return 6; 
        }
        return 5;
    }

    if (step === 5 && selectedEnfants === "0") {
        return 6; 
    }

    if (step === 6 && !isTravailleur) {
        return 8; 
    }

    return step + 1; 
}

// ✅ Fonction pour déterminer la section précédente
function getPreviousStep(step) {
    const selectedEtatCivil = document.getElementById("etat-civil").value;
    const selectedEnfants = document.querySelector("input[name='enfants']:checked")?.value || "0";
    const isTravailleur = document.getElementById("Travailleur").value === "Oui";

    if (step === 5) {
        if (!["Marié(e)", "Conjoint(e) de fait"].includes(selectedEtatCivil)) {
            return 3; 
        }
        return 4; 
    }

    if (step === 6) {
        if (selectedEnfants === "0") {
            if (["Marié(e)", "Conjoint(e) de fait"].includes(selectedEtatCivil)) {
                return 4; 
            }
            return 3; 
        }
        return 5;
    }

    if (step === 8 && !isTravailleur) {
        return 6; 
    }

    return step - 1; 
}


// ✅ Validation avant de passer à la section suivante
function validateSection(step) {
    const section = document.querySelector(`[data-step="${step}"]`);
    const inputs = section.querySelectorAll("[required]");
    let isValid = true;

    inputs.forEach(input => {
        input.classList.remove("invalid");
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add("invalid");
        }
    });

    return isValid;
}

// ✅ Navigation : Bouton suivant
function nextSection() {
    if (!validateSection(currentStep)) return;

    let nextStep = getNextStep(currentStep);
    if (nextStep <= totalSteps) {
        currentStep = nextStep;
        updateStepVisibility();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// ✅ Navigation : Bouton retour
function previousSection() {
    let previousStep = getPreviousStep(currentStep);
    if (previousStep >= 1) {
        currentStep = previousStep;
        updateStepVisibility();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

// ✅ Gestion du téléversement multiple
documentsInput.addEventListener("change", function () {
    fileListContainer.innerHTML = ""; 

    if (documentsInput.files.length > 0) {
        for (const file of documentsInput.files) {
            const listItem = document.createElement("li");
            listItem.textContent = file.name; 

            // ✅ Ajout d'un bouton pour supprimer un fichier de la liste
            const removeButton = document.createElement("button");
            removeButton.textContent = "❌";
            removeButton.style.marginLeft = "10px";
            removeButton.style.cursor = "pointer";

            // ✅ Suppression du fichier de la liste visuelle (ne supprime pas réellement du input)
            removeButton.addEventListener("click", function () {
                listItem.remove();
            });

            listItem.appendChild(removeButton);
            fileListContainer.appendChild(listItem);
        }
    }
});

// ✅ Gestion de la soumission du formulaire (Compatible Netlify)
function submitForm(event) {
    // ✅ Vérification des champs obligatoires
    let form = document.getElementById("taxForm");
    let formData = new FormData(form);

    // ✅ Envoi du formulaire directement à Netlify
    fetch(form.action, {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/confirmation.html"; // Redirection après succès
        } else {
            alert("❌ Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi du formulaire :", error);
        alert("❌ Impossible d'envoyer le formulaire. Vérifiez votre connexion.");
    });
}

// ✅ Ajout des événements aux boutons
nextButton.addEventListener("click", () => { 
    if (validateSection(currentStep)) { 
        currentStep = getNextStep(currentStep); 
        updateStepVisibility();
    }
});

prevButton.addEventListener("click", () => { 
    currentStep = getPreviousStep(currentStep); 
    updateStepVisibility();
});

// ✅ Ajout des événements aux boutons
nextButton.addEventListener("click", nextSection);
prevButton.addEventListener("click", previousSection);
submitButton.addEventListener("click", submitForm);

// ✅ Ajout d'un écouteur d'événements pour surveiller les changements de l'état civil
document.getElementById("etat-civil").addEventListener("change", genererChampsConjoint);
document.addEventListener("DOMContentLoaded", genererChampsConjoint);
document.getElementById("taxForm").addEventListener("submit", submitForm);
travailleurAutonome.addEventListener("change", updateTarification);

// ✅ Initialisation
document.addEventListener("DOMContentLoaded", function () {
    updateTarification();
    updateStepVisibility();
});

document.addEventListener("DOMContentLoaded", function () {
    // Sélectionne tous les labels et vérifie si le champ correspondant est "required"
    const labels = document.querySelectorAll("label");

    labels.forEach(label => {
        let input = label.closest(".form-group")?.querySelector("input, select, textarea");
        
        if (input) {
            let requiredSpan = label.querySelector(".required-star");
            if (input.required) {
                if (!requiredSpan) {
                    label.innerHTML += " <span class='required-star' style='color: red;'>*</span>";
                }
            } else {
                if (requiredSpan) {
                    requiredSpan.remove(); 
                }
            }
        }
    });
});