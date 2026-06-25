<?php
require_once 'config.php';
$estConnecte = isset($_SESSION['utilisateur']);
$estAdmin    = $estConnecte && $_SESSION['utilisateur']['type'] === 'admin';

$categories    = get_categories($pdo);
$villes        = get_villes($pdo);
$publics       = get_publics($pdo);
$mots_cles_js  = get_mots_cles($pdo);

$categories_js = array_map(function($c) { return ['id' => (int)$c['id'], 'nom' => $c['nom']]; }, $categories);
$villes_js     = array_map(function($v) { return ['id' => (int)$v['id'], 'nom' => $v['nom']]; }, $villes);
$publics_js    = array_map(function($p) { return ['id' => (int)$p['id'], 'nom' => $p['nom']]; }, $publics);
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sorties Culturelles</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="evenement.css">
</head>
<body>
<div class="zone-principal">
<header>
    <div class="entete-contenu">
        <a href="index.php" class="lien-retour">&larr; Retour aux événements</a>
        <h1 id="ev-titre"></h1>
    </div>
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
    <main>

        <div class="grille-evenement">
            <div class="colonne-image">
                <img id="ev-image" src="" alt="">
            </div>
            <div class="colonne-infos">

                <h4 id="ev-lieu"></h4>

                <p><strong>Date : </strong><time id="ev-date"></time></p>
                <p><strong>Adresse :</strong> <span id="ev-adresse"></span></p>
                <p><strong>Ville :</strong> <span id="ev-ville"></span></p>
                <p><strong>Prix :</strong> <span id="ev-prix"></span></p>
                <p><strong>Public :</strong> <span id="ev-public"></span></p>
                <p><strong>Catégorie :</strong> <span id="ev-categorie"></span></p>
                <p><strong>Accessibilité :</strong> <span id="ev-accessibilite"></span></p>

                <h2>Description</h2>
                <p id="ev-description-longue"></p>

                <a id="ev-lien-externe" href="#" target="_blank" class="ev-lien-cache">
                    <button class="favorite styled" type="button">Plus d'informations</button>
                </a>
            </div>
        </div>
        <section>
            <h2>Événements similaires</h2>
            <div class="grille-similaires" id="grille-similaires"></div>
        </section>
    </main>

    <footer>
        <p>Mots-clés</p>
        <ul id="ev-mots-cles" class="mots-cles"></ul>
    </footer>
</div>

<script>
const categories = <?= json_encode($categories_js) ?>;
const villes     = <?= json_encode($villes_js) ?>;
const publics    = <?= json_encode($publics_js) ?>;
const mots_cles  = <?= json_encode($mots_cles_js) ?>;
</script>
<script src="evenement.js"></script>
</body>
</html>
