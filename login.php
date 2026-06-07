<?php
require_once 'config.php';  // démarre la session + connexion BD

$erreur = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // 1. Nettoyer l'input
    $nom_utilisateur = trim($_POST ['nom_utilisateur']);
    $mot_de_passe = trim($_POST ['mot_de_passe']);

// 2. Vérifier que ce n'est pas vide
if ($nom_utilisateur === '' || $mot_de_passe === '') {
    $erreur = 'Veuillez remplir tous les champs.';
} else {
    $stmt = $pdo->prepare('SELECT * FROM utilisateurs WHERE nom_utilisateur = ?');
    $stmt->execute([$nom_utilisateur]);
    $utilisateur = $stmt->fetch();

    // Vérification du mot de passe si le champ est vide. 
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

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire</title>
</head>
<body>
<form action="login.php" method="post">
        <?php if ($erreur): ?>
        <p style="color:red"><?= $erreur ?></p>
    <?php endif; ?>
  Nom Utilisateur: <input type="text" name="nom_utilisateur"><br>
  Mot de passe: <input type="password" name="mot_de_passe"><br>
  <button type="submit">Soumettre</button>
</form>
    
</body>
</html>