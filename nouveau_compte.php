<?php
require_once 'config.php';

$erreurs = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom             = trim($_POST['nom']             ?? '');
    $prenom          = trim($_POST['prenom']          ?? '');
    $nom_utilisateur = trim($_POST['nom_utilisateur'] ?? '');
    $mot_de_passe    =      $_POST['mot_de_passe']    ?? '';
    $confirmation    =      $_POST['confirmation']    ?? '';

    if ($nom === '')    $erreurs['nom']    = 'Le nom est requis.';
    if ($prenom === '') $erreurs['prenom'] = 'Le prénom est requis.';

    if ($nom_utilisateur === '') {
        $erreurs['nom_utilisateur'] = 'Le nom d\'utilisateur est requis.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE nom_utilisateur = ?');
        $stmt->execute([$nom_utilisateur]);
        if ($stmt->fetch()) {
            $erreurs['nom_utilisateur'] = 'Ce nom d\'utilisateur est déjà pris.';
        }
    }

    if (strlen($mot_de_passe) < 8) {
        $erreurs['mot_de_passe'] = 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    if ($mot_de_passe !== $confirmation) {
        $erreurs['confirmation'] = 'Les mots de passe ne correspondent pas.';
    }

    if (empty($erreurs)) {
        $hash = password_hash($mot_de_passe, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare(
            'INSERT INTO utilisateurs (nom, prenom, nom_utilisateur, mot_de_passe, type)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$nom, $prenom, $nom_utilisateur, $hash, 'utilisateur']);
        header('Location: login.php');
        exit;
    }
}

$estConnecte = isset($_SESSION['utilisateur']);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Créer un compte — Sorties Culturelles</title>
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
            <a href="login.php" class="nav-lien">Connexion</a>
        <?php endif; ?>
    </nav>
</header>

<main class="connexion-main">
    <section class="connexion-boite">
        <h2>Créer un compte</h2>
        <form action="nouveau_compte.php" method="post" novalidate>

            <div class="form-groupe">
                <label for="nom">Nom *</label>
                <input type="text" id="nom" name="nom"
                       value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>">
                <?php if (!empty($erreurs['nom'])): ?>
                    <span class="erreur-champ"><?= htmlspecialchars($erreurs['nom']) ?></span>
                <?php endif; ?>
            </div>

            <div class="form-groupe">
                <label for="prenom">Prénom *</label>
                <input type="text" id="prenom" name="prenom"
                       value="<?= htmlspecialchars($_POST['prenom'] ?? '') ?>">
                <?php if (!empty($erreurs['prenom'])): ?>
                    <span class="erreur-champ"><?= htmlspecialchars($erreurs['prenom']) ?></span>
                <?php endif; ?>
            </div>

            <div class="form-groupe">
                <label for="nom_utilisateur">Nom d'utilisateur *</label>
                <input type="text" id="nom_utilisateur" name="nom_utilisateur"
                       value="<?= htmlspecialchars($_POST['nom_utilisateur'] ?? '') ?>">
                <?php if (!empty($erreurs['nom_utilisateur'])): ?>
                    <span class="erreur-champ"><?= htmlspecialchars($erreurs['nom_utilisateur']) ?></span>
                <?php endif; ?>
            </div>

            <div class="form-groupe">
                <label for="mot_de_passe">Mot de passe * (8 caractères minimum)</label>
                <input type="password" id="mot_de_passe" name="mot_de_passe">
                <?php if (!empty($erreurs['mot_de_passe'])): ?>
                    <span class="erreur-champ"><?= htmlspecialchars($erreurs['mot_de_passe']) ?></span>
                <?php endif; ?>
            </div>

            <div class="form-groupe">
                <label for="confirmation">Confirmer le mot de passe *</label>
                <input type="password" id="confirmation" name="confirmation">
                <?php if (!empty($erreurs['confirmation'])): ?>
                    <span class="erreur-champ"><?= htmlspecialchars($erreurs['confirmation']) ?></span>
                <?php endif; ?>
            </div>

            <button type="submit" class="btn-soumettre">Créer le compte</button>
        </form>
        <p class="lien-compte">Déjà un compte ?
            <a href="login.php">Se connecter</a>
        </p>
    </section>
</main>

<footer>
    <p>Xin &amp; Olivier</p>
</footer>
</body>
</html>
