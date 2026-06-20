<?php
require_once 'config.php';  // démarre la session + connexion BD

$erreur = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        //  Nettoyer l'input
    $nom_utilisateur = trim($_POST ['nom_utilisateur']);
    $mot_de_passe = trim($_POST ['mot_de_passe']);

// Vérifier que c'est pas vide
if ($nom_utilisateur === '' || $mot_de_passe === '') {
    $erreur = 'Veuillez remplir tous les champs.';
} else {
    $stmt = $pdo->prepare('SELECT * FROM utilisateurs WHERE nom_utilisateur = ?');
    $stmt->execute([$nom_utilisateur]);
    $utilisateur = $stmt->fetch();

    // Vérification mot de passe si champ est vide. 
    if ($utilisateur && password_verify($mot_de_passe, $utilisateur['mot_de_passe'])) {
        $_SESSION['utilisateur'] = [
            'id'              => $utilisateur['id'],
            'prenom'          => $utilisateur['prenom'],
            'nom_utilisateur' => $utilisateur['nom_utilisateur'],
            'type'            => $utilisateur['type']
        ];
        header('Location: index.php');
        exit;
    } else {
        $erreur = 'Identifiants incorrects.';
    }
}

}

$estConnecte = isset($_SESSION['utilisateur']);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion — Sorties Culturelles</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="login.css">
</head>
<body>
<header>
    <h1>Agenda culturel local</h1>
    <nav>
        <?php if ($estConnecte): ?>
            <span class="nav-utilisateur">
                <?= htmlspecialchars($_SESSION['utilisateur']['prenom']) ?>
            </span>
            <a href="deconnexion.php" class="nav-lien">Déconnexion</a>
        <?php else: ?>
            <a href="index.php" class="nav-lien">Événements</a>
        <?php endif; ?>
    </nav>
</header>

<main class="connexion-main">
    <section class="connexion-boite">
        <h2>Connexion</h2>
        <form action="login.php" method="post" novalidate>
            <?php if ($erreur): ?>
                <p class="erreur-connexion"><?= htmlspecialchars($erreur) ?></p>
            <?php endif; ?>

            <div class="form-groupe">
                <label for="nom_utilisateur">Nom d'utilisateur</label>
                <input type="text" id="nom_utilisateur" name="nom_utilisateur"
                       value="<?= htmlspecialchars($_POST['nom_utilisateur'] ?? '') ?>">
            </div>
            <div class="form-groupe">
                <label for="mot_de_passe">Mot de passe</label>
                <input type="password" id="mot_de_passe" name="mot_de_passe">
            </div>

            <button type="submit" class="btn-soumettre">Se connecter</button>
        </form>
        <p class="lien-compte">Pas encore de compte ?
            <a href="nouveau_compte.php">Créer un compte</a>
        </p>
    </section>
</main>

<footer>
    <p>Xin &amp; Olivier</p>
</footer>
</body>
</html>