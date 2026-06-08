<?php
// Script à exécuter UNE SEULE FOIS depuis le navigateur pour créer le compte admin.
// Accéder à : http://localhost:8000/creer_admin.php
// SUPPRIMER ce fichier après utilisation.

require_once 'config.php';

$nom_utilisateur = 'admin';
$mot_de_passe    = 'Admin1234!';

$stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE nom_utilisateur = ?');
$stmt->execute([$nom_utilisateur]);

if ($stmt->fetch()) {
    echo 'Le compte admin existe déjà.';
} else {
    $hash = password_hash($mot_de_passe, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare(
        'INSERT INTO utilisateurs (nom, prenom, nom_utilisateur, mot_de_passe, type)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute(['Admin', 'Admin', $nom_utilisateur, $hash, 'admin']);
    echo 'Compte admin créé. Identifiants : admin / Admin1234!';
}
