// affichage de l'événement

function afficher_evenement(evenement) {
    // recherche categorie, ville, public
    const categorie  = categories.find(function(c) { return c.id === evenement.categorie_id; });
    const ville      = villes.find(function(v) { return v.id === evenement.ville_id; });
    const publicVise = publics.find(function(p) { return p.id === evenement.public_id; });

    // noms lisibles
    const nomCategorie  = categorie  ? categorie.nom  : '';
    const nomVille      = ville      ? ville.nom      : '';
    const nomPublicVise = publicVise ? publicVise.nom : '';
    
    // prix gratuit ou montant
    const affichagePrix = evenement.prix === 0 ? 'Gratuit' : evenement.prix.toFixed(2) + ' $';

    // remplissage des champs
    document.getElementById('ev-titre').textContent              = evenement.titre;
    document.getElementById('ev-image').src                      = evenement.image;
    document.getElementById('ev-image').alt                      = evenement.titre;
    document.getElementById('ev-lieu').textContent               = evenement.lieu;
    document.getElementById('ev-date').textContent               = evenement.date_heure;
    document.getElementById('ev-date').setAttribute('datetime', evenement.date_heure);
    document.getElementById('ev-adresse').textContent            = evenement.adresse;
    document.getElementById('ev-ville').textContent              = nomVille;
    document.getElementById('ev-prix').textContent               = affichagePrix;
    document.getElementById('ev-public').textContent             = nomPublicVise;
    document.getElementById('ev-categorie').textContent          = nomCategorie;
    document.getElementById('ev-description-longue').textContent = evenement.description_longue;

    // mots-clés
    const listeMots = document.getElementById('ev-mots-cles');
    listeMots.innerHTML = '';
    evenement.mots_cles_ids.forEach(function(mcId) {
        const mc = mots_cles.find(function(m) { return m.id === mcId; });
        if (mc) {
            // ajout d'un item par mot-clé
            const li = document.createElement('li');
            li.textContent = mc.mot;
            listeMots.appendChild(li);
        }
    });

    // lien externe optionnel
    if (evenement.lien_externe) {
        const lien = document.getElementById('ev-lien-externe');
        lien.href = evenement.lien_externe;
        // affichage du lien
        lien.style.display = '';
    }
}

// événements similaires

function afficher_similaires(evenement) {
    // même catégorie ou même ville, exclu lui-même
    const similaires = evenements.filter(function(ev) {
        if (ev.id === evenement.id) return false;
        return ev.categorie_id === evenement.categorie_id || ev.ville_id === evenement.ville_id;
    });

    const grille = document.getElementById('grille-similaires');
    grille.innerHTML = '';

    // aucun résultat
    if (similaires.length === 0) {
        grille.innerHTML = '<p>Aucun événement similaire.</p>';
        return;
    }

    similaires.forEach(function(ev) {
        // création de la carte
        const article = document.createElement('article');
        article.className = 'evenement';

        const ville = villes.find(function(v) { return v.id === ev.ville_id; });
        const nomVille = ville ? ville.nom : '';

        // contenu HTML de la carte
        article.innerHTML =
            '<img src="' + ev.image + '" alt="' + ev.titre + '">' +
            '<h2>' + ev.titre + '</h2>' +
            '<time datetime="' + ev.date_heure + '">' + ev.date_heure + '</time>' +
            '<address>' + nomVille + '</address>' +
            '<p>' + ev.description_courte + '</p>';

        // clic vers la page de l'événement
        article.addEventListener('click', function() {
            window.location.href = 'evenement.html?id=' + ev.id;
        });

        grille.appendChild(article);
    });
}

// initialiser

document.addEventListener('DOMContentLoaded', function() {
    // lecture du paramètre id dans l'URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    // recherche de l'événement
    const evenement = evenements.find(function(e) { return e.id === id; });

    if (evenement) {
        afficher_evenement(evenement);
        afficher_similaires(evenement);
    } else {
        // événement non trouvé
        document.querySelector('main').innerHTML = '<p>Événement introuvable.</p>';
    }
});
