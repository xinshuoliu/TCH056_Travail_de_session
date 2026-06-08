<?php
session_start();

try {
    $pdo = new PDO("mysql:host=db;dbname=sorties_culturelles;charset=utf8mb4",
        "root", "rootpassword");
     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e){
    die('Erreur de connexion : ' . $e->getMessage());

}

function get_categories($pdo){
    $stmt = $pdo->query('SELECT id, nom FROM categories ORDER BY nom');
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function get_villes($pdo){
    $stmt = $pdo->query('SELECT id, nom FROM villes ORDER BY nom');
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function get_publics($pdo){
    $stmt = $pdo->query('SELECT id, nom FROM publics ORDER BY nom');
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}