// Tableau global rempli par un fetch depuis /api/evenements à chaque 
// appel de filtrer_evenements()

let evenements = []; 

// page active dans la liste paginée; remise à 1 à chaque changement de filtre
let pageCourante = 1;

// filtres

function afficher_filtres() {
    // Les filtres de la page sont générés par PHP depuis la BD.
    // Cette fonction remplit uniquement les selects du formulaire modal (admin).
    const formCat    = document.getElementById('champ-categorie');
    const formVille  = document.getElementById('champ-ville');
    const formPublic = document.getElementById('champ-public');

    if (!formCat) return; // modal absent (utilisateur non-admin)

    categories.forEach(function(c) {
        const opt = document.createElement('option');
        opt.value = c.id; opt.textContent = c.nom;
        formCat.appendChild(opt);
    });
    villes.forEach(function(v) {
        const opt = document.createElement('option');
        opt.value = v.id; opt.textContent = v.nom;
        formVille.appendChild(opt);
    });
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
        (estAdmin
            ? '<div class="evenement-actions">' +
                '<button class="btn-modifier">Modifier</button>' +
                '<button class="btn-supprimer">Supprimer</button>' +
              '</div>'
            : '');

    // clic vers la page détail 
    article.addEventListener('click', function(e) {
        if (!e.target.closest('.evenement-actions')) {
            window.location.href = 'evenement.php?id=' + evenement.id;
        }
    });

    // bouton modifier
    const btnModifier = article.querySelector('.btn-modifier');
    if (btnModifier) {
        btnModifier.addEventListener('click', function(e) {
            e.stopPropagation();
            ouvrir_formulaire_modification(evenement.id);
        });
    }

    // bouton supprimer
    const btnSupprimer = article.querySelector('.btn-supprimer');
    if (btnSupprimer) {
        btnSupprimer.addEventListener('click', function(e) {
            e.stopPropagation();
            supprimer_evenement(evenement.id);
        });
    }

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

// pagination 

// affiche les boutons Précédent / Suivant selon la page et le total retournés par l'API
function afficher_pagination(data) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    if (data.pages <= 1) return;

    if (data.page > 1) {
        const btnPrev = document.createElement('button');
        btnPrev.textContent = 'Précédent';
        btnPrev.addEventListener('click', function() {
            pageCourante = data.page - 1;
            filtrer_evenements();
        });
        pagination.appendChild(btnPrev);
    }

    if (data.page < data.pages) {
        const btnSuiv = document.createElement('button');
        btnSuiv.textContent = 'Suivant';
        btnSuiv.addEventListener('click', function() {
            pageCourante = data.page + 1;
            filtrer_evenements();
        });
        pagination.appendChild(btnSuiv);
    }
}

// filtres et tri

function filtrer_evenements() {
    // lecture des filtres
    const categorieId = parseInt(document.getElementById('choix-categories').value) || null;
    const villeId     = parseInt(document.getElementById('choix-ville').value)      || null;
    const publicId    = parseInt(document.getElementById('choix-public').value)     || null;
    const tri         = document.getElementById('choix-tri').value;
    const recherche   = document.getElementById('recherche').value.toLowerCase();

    // construction des paramètres URL
    const params = new URLSearchParams();
    if(categorieId) params.set('categorie', categorieId);
    if(villeId) params.set('ville', villeId);
    if(publicId) params.set('public', publicId);
    if(tri) params.set('tri', tri);
    params.set('page', pageCourante);

    // chargement des événements depuis l'API (catégorie/ville/public/tri côté serveur, 
    // recherche textuelle côté client)

    fetch('/api/evenements?' + params.toString())
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.erreur)
                throw new Error('Erreur reçue du serveur : ' + data.erreur);

            let resultats = data.evenements;

            if (recherche) {
                resultats = resultats.filter(function(ev) {
                    const villeEv  = villes.find(function(v) { return v.id === ev.ville_id; });
                    const nomVille = villeEv ? villeEv.nom.toLowerCase() : '';
                    return ev.titre.toLowerCase().includes(recherche)
                        || ev.lieu.toLowerCase().includes(recherche)
                        || nomVille.includes(recherche);
                });
            }

            evenements = data.evenements;
            afficher_evenements(resultats);
            afficher_pagination(data);
        })
        .catch(function(erreur) {
            const grille = document.querySelector('.grille-evenements');
            grille.innerHTML = '<p class="erreur">' + erreur.message + '</p>';
        });

}

// suppression

function supprimer_evenement(id) {
    // confirmation avant suppression
    if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return;

    // suppression persistante via l'API — retire l'événement de la base de données
    fetch('/api/evenements/' + id, { method: 'DELETE' })
        .then(function(response) {
            if (response.status === 403)
                throw new Error ('Permission refusée - vous devez être administrateur.');
            if (!response.ok)
                throw new Error('Erreur HTTP : ' + response.statusText);
            return response.json();
        })
        .then(function(data) {
            if (data.erreur)
                throw new Error('Erreur de serveur : ' + data.erreur);
            filtrer_evenements();
        })
        .catch(function(erreur) {
            alert(erreur.message);
        });
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

    // id présent = modification, absent = création
    const idExistant = document.getElementById('evenement-id').value;

    if (idExistant) {
        // mise à jour via PUT — sauvegarde les modifications en base de données
        fetch('/api/evenements/' + idExistant, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donnees)
        })
            .then(function(response) {
                if (response.status === 403)
                    throw new Error('Permission refusée - vous devez être administrateur.');
                if (!response.ok)
                    throw new Error('Erreur HTTP : ' + response.statusText);
                return response.json();
            })
            .then(function(data) {
                if (data.erreur)
                    throw new Error('Erreur reçue du serveur : ' + data.erreur);
                fermer_formulaire();
                filtrer_evenements();
            })
            .catch(function(erreur) {
                alert(erreur.message);
            });
    } else {
        // création via POST — insère le nouvel événement en base de données
        fetch('/api/evenements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donnees)
        })
            .then(function(response) {
                if (response.status === 403)
                    throw new Error('Permission refusée - vous devez être administrateur.');
                if (!response.ok)
                    throw new Error('Erreur HTTP : ' + response.statusText);
                return response.json();
            })
            .then(function(data) {
                if (data.erreur)
                    throw new Error('Erreur reçue du serveur : ' + data.erreur);
                fermer_formulaire();
                filtrer_evenements();
            })
            .catch(function(erreur) {
                alert(erreur.message);
            });
    }
}

// initialiser
document.addEventListener('DOMContentLoaded', function() {
    afficher_filtres();
    filtrer_evenements();

    // écouteurs filtres et recherche — repart toujours à la page 1 lors d'un changement de filtre
    document.getElementById('choix-categories').addEventListener('change', function() { pageCourante = 1; filtrer_evenements(); });
    document.getElementById('choix-ville').addEventListener('change',      function() { pageCourante = 1; filtrer_evenements(); });
    document.getElementById('choix-public').addEventListener('change',     function() { pageCourante = 1; filtrer_evenements(); });
    document.getElementById('choix-tri').addEventListener('change',        function() { pageCourante = 1; filtrer_evenements(); });
    document.getElementById('recherche').addEventListener('input',         function() { pageCourante = 1; filtrer_evenements(); });

    // écouteurs formulaire (absents si non-admin)
    const btnAjouter = document.getElementById('btn-ajouter');
    if (btnAjouter) btnAjouter.addEventListener('click', function() { ouvrir_formulaire(); });

    const btnFermerModal = document.getElementById('btn-fermer-modal');
    if (btnFermerModal) btnFermerModal.addEventListener('click', fermer_formulaire);

    const formEvenement = document.getElementById('form-evenement');
    if (formEvenement) formEvenement.addEventListener('submit', soumettre_formulaire);

    const modal = document.getElementById('modal-formulaire');
    if (modal) modal.addEventListener('click', function(e) {
        if (e.target === modal) fermer_formulaire();
    });
});
