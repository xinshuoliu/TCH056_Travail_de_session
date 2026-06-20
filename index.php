<?php
require_once 'config.php';

$categories = get_categories($pdo);
$villes     = get_villes($pdo);
$publics    = get_publics($pdo);
$evenements_js = get_evenements($pdo);

$categories_js = array_map(function($c) { return ['id' => (int)$c['id'], 'nom' => $c['nom']]; }, $categories);
$villes_js     = array_map(function($v) { return ['id' => (int)$v['id'], 'nom' => $v['nom']]; }, $villes);
$publics_js    = array_map(function($p) { return ['id' => (int)$p['id'], 'nom' => $p['nom']]; }, $publics);

$estConnecte = isset($_SESSION['utilisateur']);
$estAdmin    = $estConnecte && $_SESSION['utilisateur']['type'] === 'admin';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agenda culturel local</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="index.css">
</head>
<body>
<div class="container">
    <header>
        <h1>Agenda culturel local</h1>
        <nav>
            <?php if ($estConnecte): ?>
                <span class="nav-utilisateur">
                    <?= htmlspecialchars($_SESSION['utilisateur']['prenom']) ?>
                </span>
                <a href="deconnexion.php" class="nav-lien">Déconnexion</a>
            <?php else: ?>
                <a href="login.php" class="nav-lien">Connexion</a>
            <?php endif; ?>
        </nav>
    </header>

    <nav class="filtres">
        <div class="filtre">
            <label for="recherche">Recherche</label>
            <input type="text" id="recherche" placeholder="Titre, lieu, ville">
        </div>
        <div class="filtre">
            <label for="choix-categories">Catégorie</label>
            <select id="choix-categories">
                <option value="">Toutes les catégories</option>
                <?php foreach ($categories as $cat): ?>
                    <option value="<?= (int)$cat['id'] ?>"><?= htmlspecialchars($cat['nom']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="filtre">
            <label for="choix-ville">Ville</label>
            <select id="choix-ville">
                <option value="">Toutes les villes</option>
                <?php foreach ($villes as $ville): ?>
                    <option value="<?= (int)$ville['id'] ?>"><?= htmlspecialchars($ville['nom']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="filtre">
            <label for="choix-public">Public</label>
            <select id="choix-public">
                <option value="">Tous les publics</option>
                <?php foreach ($publics as $pub): ?>
                    <option value="<?= (int)$pub['id'] ?>"><?= htmlspecialchars($pub['nom']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="filtre">
            <label for="choix-tri">Tri</label>
            <select id="choix-tri">
                <option value="date">Date croissante</option>
                <option value="prix">Prix croissant</option>
            </select>
        </div>
    </nav>

    <main>
        <div class="main-entete">
            <h2>Événements</h2>
            <?php if ($estAdmin): ?>
                <button id="btn-ajouter" class="btn-ajouter-principal">Ajouter</button>
            <?php endif; ?>
        </div>
        <div class="grille-evenements"></div>
    </main>

    <footer>
        <p>Xin &amp; Olivier</p>
    </footer>
</div>

<?php if ($estAdmin): ?>
<div id="modal-formulaire" role="dialog" aria-modal="true">
    <div class="modal-contenu">
        <div class="modal-entete">
            <h2 id="modal-titre">Ajouter un événement</h2>
            <button id="btn-fermer-modal" type="button" aria-label="Fermer">&times;</button>
        </div>
        <form id="form-evenement" novalidate>
            <input type="hidden" id="evenement-id">

            <div class="form-groupe">
                <label for="champ-titre">Titre *</label>
                <input type="text" id="champ-titre">
                <span id="erreur-titre" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-image">URL de l'image *</label>
                <input type="text" id="champ-image">
                <span id="erreur-image" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-description-courte">Description courte *</label>
                <input type="text" id="champ-description-courte">
                <span id="erreur-description-courte" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-description-longue">Description longue *</label>
                <textarea id="champ-description-longue" rows="4"></textarea>
                <span id="erreur-description-longue" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-date">Date et heure *</label>
                <input type="text" id="champ-date" placeholder="ex: 2026-06-12 à 20:00">
                <span id="erreur-date" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-lieu">Lieu *</label>
                <input type="text" id="champ-lieu">
                <span id="erreur-lieu" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-adresse">Adresse *</label>
                <input type="text" id="champ-adresse">
                <span id="erreur-adresse" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-ville">Ville *</label>
                <select id="champ-ville">
                    <option value="">Choisir une ville</option>
                </select>
                <span id="erreur-ville" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-categorie">Catégorie *</label>
                <select id="champ-categorie">
                    <option value="">Choisir une catégorie</option>
                </select>
                <span id="erreur-categorie" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-public">Public visé *</label>
                <select id="champ-public">
                    <option value="">Choisir un public</option>
                </select>
                <span id="erreur-public" class="erreur-champ"></span>
            </div>
            <div class="form-groupe">
                <label for="champ-prix">Prix ($) *</label>
                <input type="number" id="champ-prix" min="0" step="0.01" placeholder="0.00">
                <span id="erreur-prix" class="erreur-champ"></span>
            </div>

            <button type="submit" class="btn-soumettre">Enregistrer</button>
        </form>
    </div>
</div>

<?php endif; ?>

<script>
const estAdmin   = <?= $estAdmin ? 'true' : 'false' ?>;
const categories = <?= json_encode($categories_js) ?>;
const villes     = <?= json_encode($villes_js) ?>;
const publics    = <?= json_encode($publics_js) ?>;
let evenements   = <?= json_encode($evenements_js) ?>;
</script>
<script src="index.js"></script>
</body>
</html>
