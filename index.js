// 4. filtres

function afficher_filtres() {
    // sélecteurs du filtre
    const selCategorie = document.getElementById('choix-categories');
    const selVille     = document.getElementById('choix-ville');
    const selPublic    = document.getElementById('choix-public');

    // options catégories
    selCategorie.innerHTML = '<option value="">Toutes les catégories</option>';
    categories.forEach(function(c) {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nom;
        selCategorie.appendChild(opt);
    });

    // options villes
    selVille.innerHTML = '<option value="">Toutes les villes</option>';
    villes.forEach(function(v) {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = v.nom;
        selVille.appendChild(opt);
    });

    // options publics
    selPublic.innerHTML = '<option value="">Tous les publics</option>';
    publics.forEach(function(p) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nom;
        selPublic.appendChild(opt);
    });

    // sélecteurs du formulaire
    const formCat    = document.getElementById('champ-categorie');
    const formVille  = document.getElementById('champ-ville');
    const formPublic = document.getElementById('champ-public');

    // options formulaire catégories
    categories.forEach(function(c) {
        const opt = document.createElement('option');
        opt.value = c.id; opt.textContent = c.nom;
        formCat.appendChild(opt);
    });
    // options formulaire villes
    villes.forEach(function(v) {
        const opt = document.createElement('option');
        opt.value = v.id; opt.textContent = v.nom;
        formVille.appendChild(opt);
    });
    // options formulaire publics
    publics.forEach(function(p) {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.nom;
        formPublic.appendChild(opt);
    });
}

// affichage de cartes

function afficher_evenement_resume(evenement) {
    // recherche catégorie, ville, public
    const categorie  = categories.find(function(c) { return c.id === evenement.categorie_id; });
    const ville      = villes.find(function(v) { return v.id === evenement.ville_id; });
    const publicVise = publics.find(function(p) { return p.id === evenement.public_id; });

    // noms lisibles
    const nomCategorie  = categorie  ? categorie.nom  : '';
    const nomVille      = ville      ? ville.nom      : '';
    const nomPublicVise = publicVise ? publicVise.nom : '';

    // prix gratuit ou montant
    const prix = evenement.prix === 0 ? 'Gratuit' : evenement.prix.toFixed(2) + ' $';

    // création de la carte
    const article = document.createElement('article');
    article.className = 'evenement';
    article.dataset.id = evenement.id;

    // contenu HTML de la carte
    article.innerHTML =
        '<img src="' + evenement.image + '" alt="' + evenement.titre + '" />' +
        '<span class="categorie-badge">' + nomCategorie + '</span>' +
        '<div class="evenement-info">' +
            '<time datetime="' + evenement.date_heure + '">' + evenement.date_heure + '</time>' +
            '<h2>' + evenement.titre + '</h2>' +
            '<p class="description-courte">' + evenement.description_courte + '</p>' +
            '<dl>' +
                '<dt>Lieu</dt>   <dd>' + evenement.lieu + '</dd>' +
                '<dt>Ville</dt>  <dd>' + nomVille + '</dd>' +
                '<dt>Public</dt> <dd>' + nomPublicVise + '</dd>' +
                '<dt>Prix</dt>   <dd>' + prix + '</dd>' +
            '</dl>' +
        '</div>' +
        '<div class="evenement-actions">' +
            '<button class="btn-modifier">Modifier</button>' +
            '<button class="btn-supprimer">Supprimer</button>' +
        '</div>';

    // clic vers la page détail 
    article.addEventListener('click', function(e) {
        if (!e.target.closest('.evenement-actions')) {
            window.location.href = 'evenement.html?id=' + evenement.id;
        }
    });

    // bouton modifier
    article.querySelector('.btn-modifier').addEventListener('click', function(e) {
        e.stopPropagation();
        ouvrir_formulaire_modification(evenement.id);
    });

    // bouton supprimer
    article.querySelector('.btn-supprimer').addEventListener('click', function(e) {
        e.stopPropagation();
        supprimer_evenement(evenement.id);
    });

    return article;
}

// affichage de la liste

function afficher_evenements(liste) {
    const grille = document.querySelector('.grille-evenements');
    grille.innerHTML = '';

    // aucun résultat
    if (liste.length === 0) {
        grille.innerHTML = '<p class="aucun-resultat">Aucun événement trouvé.</p>';
        return;
    }

    // ajout de chaque carte
    liste.forEach(function(ev) { grille.appendChild(afficher_evenement_resume(ev)); });
}

// filtres et tri

function filtrer_evenements() {
    // lecture des filtres
    const categorieId = parseInt(document.getElementById('choix-categories').value) || null;
    const villeId     = parseInt(document.getElementById('choix-ville').value)      || null;
    const publicId    = parseInt(document.getElementById('choix-public').value)     || null;
    const tri         = document.getElementById('choix-tri').value;
    const recherche   = document.getElementById('recherche').value.toLowerCase();

    // application des filtres
    let resultats = evenements.filter(function(ev) {
        if (categorieId && ev.categorie_id !== categorieId) return false;
        if (villeId     && ev.ville_id      !== villeId)    return false;
        if (publicId    && ev.public_id     !== publicId)   return false;
        if (recherche) {
            // recherche dans titre, lieu, ville
            const villeEv  = villes.find(function(v) { return v.id === ev.ville_id; });
            const nomVille = villeEv ? villeEv.nom.toLowerCase() : '';
            const match = ev.titre.toLowerCase().includes(recherche)
                       || ev.lieu.toLowerCase().includes(recherche)
                       || nomVille.includes(recherche);
            if (!match) return false;
        }
        return true;
    });

    // tri par date ou prix
    if (tri === 'date') {
        resultats.sort(function(a, b) { return a.date_heure.localeCompare(b.date_heure); });
    } else if (tri === 'prix') {
        resultats.sort(function(a, b) { return a.prix - b.prix; });
    }

    afficher_evenements(resultats);
}

// suppression

function supprimer_evenement(id) {
    // confirmation avant suppression
    if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
    evenements = evenements.filter(function(e) { return e.id !== id; });
    filtrer_evenements();
}

// formulaire modal

function ouvrir_formulaire(evenementAModifier) {
    const modal = document.getElementById('modal-formulaire');
    const form  = document.getElementById('form-evenement');

    // réinitialisation
    form.reset();
    vider_erreurs();
    document.getElementById('evenement-id').value = '';
    // titre selon mode ajout ou modification
    document.getElementById('modal-titre').textContent = evenementAModifier
        ? 'Modifier l\'événement'
        : 'Ajouter un événement';

    // pré-remplissage si modification
    if (evenementAModifier) {
        document.getElementById('evenement-id').value             = evenementAModifier.id;
        document.getElementById('champ-titre').value              = evenementAModifier.titre;
        document.getElementById('champ-image').value              = evenementAModifier.image;
        document.getElementById('champ-description-courte').value = evenementAModifier.description_courte;
        document.getElementById('champ-description-longue').value = evenementAModifier.description_longue;
        document.getElementById('champ-date').value               = evenementAModifier.date_heure;
        document.getElementById('champ-lieu').value               = evenementAModifier.lieu;
        document.getElementById('champ-adresse').value            = evenementAModifier.adresse;
        document.getElementById('champ-ville').value              = evenementAModifier.ville_id;
        document.getElementById('champ-categorie').value          = evenementAModifier.categorie_id;
        document.getElementById('champ-public').value             = evenementAModifier.public_id;
        document.getElementById('champ-prix').value               = evenementAModifier.prix;
    }

    // affichage modal
    modal.style.display = 'flex';
}

function ouvrir_formulaire_modification(id) {
    // recherche et ouverture
    const ev = evenements.find(function(e) { return e.id === id; });
    if (ev) ouvrir_formulaire(ev);
}

function fermer_formulaire() {
    // masquage modal
    document.getElementById('modal-formulaire').style.display = 'none';
}

function vider_erreurs() {
    // effacement des messages d'erreur
    document.querySelectorAll('.erreur-champ').forEach(function(el) { el.textContent = ''; });
}

function afficher_erreur(champId, message) {
    // affichage d'un message sous le champ
    const el = document.getElementById('erreur-' + champId);
    if (el) el.textContent = message;
}

function valider_formulaire(donnees) {
    let valide = true;
    vider_erreurs();

    // vérification champs obligatoires
    if (!donnees.titre)              { afficher_erreur('titre',              'Le titre est requis.');                   valide = false; }
    if (!donnees.image)              { afficher_erreur('image',              'L\'URL de l\'image est requise.');        valide = false; }
    if (!donnees.description_courte) { afficher_erreur('description-courte', 'La description courte est requise.');    valide = false; }
    if (!donnees.description_longue) { afficher_erreur('description-longue', 'La description longue est requise.');    valide = false; }
    if (!donnees.date_heure)         { afficher_erreur('date',               'La date est requise.');                  valide = false; }
    if (!donnees.lieu)               { afficher_erreur('lieu',               'Le lieu est requis.');                   valide = false; }
    if (!donnees.adresse)            { afficher_erreur('adresse',            'L\'adresse est requise.');               valide = false; }
    if (!donnees.ville_id)           { afficher_erreur('ville',              'La ville est requise.');                 valide = false; }
    if (!donnees.categorie_id)       { afficher_erreur('categorie',          'La catégorie est requise.');             valide = false; }
    if (!donnees.public_id)          { afficher_erreur('public',             'Le public est requis.');                 valide = false; }
    if (isNaN(donnees.prix) || donnees.prix < 0) { afficher_erreur('prix',  'Le prix doit être un nombre positif.'); valide = false; }

    return valide;
}

function soumettre_formulaire(e) {
    e.preventDefault();  //eviter le rechargement par default

    // lecture des données du formulaire
    const donnees = {
        titre:              document.getElementById('champ-titre').value,
        image:              document.getElementById('champ-image').value,
        description_courte: document.getElementById('champ-description-courte').value,
        description_longue: document.getElementById('champ-description-longue').value,
        date_heure:         document.getElementById('champ-date').value,
        lieu:               document.getElementById('champ-lieu').value,
        adresse:            document.getElementById('champ-adresse').value,
        ville_id:           parseInt(document.getElementById('champ-ville').value)     || null,
        categorie_id:       parseInt(document.getElementById('champ-categorie').value) || null,
        public_id:          parseInt(document.getElementById('champ-public').value)    || null,
        prix:               parseFloat(document.getElementById('champ-prix').value),
    };

    if (!valider_formulaire(donnees)) return;

    const idExistant = document.getElementById('evenement-id').value;

    if (idExistant) {
        // mise à jour événement existant
        const idx = evenements.findIndex(function(e) { return e.id === parseInt(idExistant); });
        if (idx !== -1) {
            evenements[idx].titre              = donnees.titre;
            evenements[idx].image              = donnees.image;
            evenements[idx].description_courte = donnees.description_courte;
            evenements[idx].description_longue = donnees.description_longue;
            evenements[idx].date_heure         = donnees.date_heure;
            evenements[idx].lieu               = donnees.lieu;
            evenements[idx].adresse            = donnees.adresse;
            evenements[idx].ville_id           = donnees.ville_id;
            evenements[idx].categorie_id       = donnees.categorie_id;
            evenements[idx].public_id          = donnees.public_id;
            evenements[idx].prix               = donnees.prix;
        }
    } else {
        // nouvel id unique
        let nouvelId = 1;
        for (let i = 0; i < evenements.length; i++) {
            if (evenements[i].id >= nouvelId) {
                nouvelId = evenements[i].id + 1;
            }
        }
        // ajout du nouvel événement
        const nouvelEvenement = {
            id:                 nouvelId,
            titre:              donnees.titre,
            image:              donnees.image,
            description_courte: donnees.description_courte,
            description_longue: donnees.description_longue,
            date_heure:         donnees.date_heure,
            lieu:               donnees.lieu,
            adresse:            donnees.adresse,
            ville_id:           donnees.ville_id,
            categorie_id:       donnees.categorie_id,
            public_id:          donnees.public_id,
            prix:               donnees.prix,
            mots_cles_ids:      [],
            lien_externe:       null
        };
        evenements.push(nouvelEvenement);
    }

    fermer_formulaire();
    filtrer_evenements();
}

// initialiser
document.addEventListener('DOMContentLoaded', function() {
    afficher_filtres();
    filtrer_evenements();

    // écouteurs filtres et recherche
    document.getElementById('choix-categories').addEventListener('change', filtrer_evenements);
    document.getElementById('choix-ville').addEventListener('change', filtrer_evenements);
    document.getElementById('choix-public').addEventListener('change', filtrer_evenements);
    document.getElementById('choix-tri').addEventListener('change', filtrer_evenements);
    document.getElementById('recherche').addEventListener('input', filtrer_evenements);

    // écouteurs formulaire
    document.getElementById('btn-ajouter').addEventListener('click', function() { ouvrir_formulaire(); });
    document.getElementById('btn-fermer-modal').addEventListener('click', fermer_formulaire);
    document.getElementById('form-evenement').addEventListener('submit', soumettre_formulaire);

    // fermeture modal sur clic dehors
    document.getElementById('modal-formulaire').addEventListener('click', function(e) {
        if (e.target === document.getElementById('modal-formulaire')) fermer_formulaire();
    });
});
