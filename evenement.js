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
    document.getElementById('ev-accessibilite').textContent      = evenement.accessibilite || 'Non précisé';
    document.getElementById('ev-description-longue').textContent = evenement.description_longue;

    // mots-clés
    const listeMots = document.getElementById('ev-mots-cles');
    listeMots.innerHTML = '';
    evenement.mots_cles_ids.forEach(function(mcId) {
        const mc = mots_cles.find(function(m) { return m.id === mcId; });
        if (mc) {
            // ajout item par mot-clé
            const li = document.createElement('li');
            li.textContent = mc.mot;
            listeMots.appendChild(li);
        }
    });

    // lien externe 
    if (evenement.lien_externe) {
        const lien = document.getElementById('ev-lien-externe');
        lien.href = evenement.lien_externe;
        lien.classList.remove('ev-lien-cache');
    }
}

// reçoit le tableau de similaires directement depuis api
function afficher_similaires(similaires) {
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

        // contenu html de la carte
        article.innerHTML =
            '<img src="' + ev.image + '" alt="' + ev.titre + '">' +
            '<h2>' + ev.titre + '</h2>' +
            '<time datetime="' + ev.date_heure + '">' + ev.date_heure + '</time>' +
            '<address>' + nomVille + '</address>' +
            '<p>' + ev.description_courte + '</p>';

        // clic vers la page de lévénement
        article.addEventListener('click', function() {
            window.location.href = 'evenement.php?id=' + ev.id;
        });

        grille.appendChild(article);
    });
}

// initialiser

document.addEventListener('DOMContentLoaded', function() {
    // lecture du paramètre id dans l'URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    // chargement de l'événement depuis l'API, puis des similaires
    fetch('/api/evenements/' + id)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.erreur)
                throw new Error('Erreur reçue du serveur : ' + data.erreur);

            afficher_evenement(data);

            fetch('/api/evenements/' + id + '/similaires')
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Erreur HTTP : ' + response.statusText);
                    }
                    return response.json();
                })
                .then(function(similaires) {
                    afficher_similaires(similaires);
                })
                .catch(function(erreur) {
                    document.getElementById('grille-similaires').innerHTML = '<p>' + erreur.message + '</p>';
                });
        })
        .catch(function(erreur) {
            document.querySelector('main').innerHTML = '<p>' + erreur.message + '</p>';
        });
});
