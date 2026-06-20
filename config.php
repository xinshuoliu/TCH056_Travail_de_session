<?php
session_start();

try {
    $pdo = new PDO("mysql:host=db;dbname=mydatabase;charset=utf8mb4",
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

function get_mots_cles($pdo) {
    $stmt = $pdo->query('SELECT id, mot FROM mots_cles ORDER BY mot');
    return array_map(function($m) {
        return ['id' => (int)$m['id'], 'mot' => $m['mot']];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function get_evenements($pdo) {
    $stmt = $pdo->query(
        'SELECT id, titre, image, description_courte, description_longue, date_heure,
                lieu, adresse, ville_id, categorie_id, public_id, prix, lien_externe
         FROM evenements ORDER BY date_heure'
    );
    $evs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $mots_stmt = $pdo->query('SELECT evenement_id, mot_cle_id FROM evenements_mots_cles');
    $mots_map = [];
    foreach ($mots_stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $mots_map[(int)$row['evenement_id']][] = (int)$row['mot_cle_id'];
    }

    return array_map(function($ev) use ($mots_map) {
        $id = (int)$ev['id'];
        return [
            'id'                 => $id,
            'titre'              => $ev['titre'],
            'image'              => $ev['image'],
            'description_courte' => $ev['description_courte'],
            'description_longue' => $ev['description_longue'],
            'date_heure'         => $ev['date_heure'],
            'lieu'               => $ev['lieu'],
            'adresse'            => $ev['adresse'],
            'ville_id'           => (int)$ev['ville_id'],
            'categorie_id'       => (int)$ev['categorie_id'],
            'public_id'          => (int)$ev['public_id'],
            'prix'               => (float)$ev['prix'],
            'mots_cles_ids'      => $mots_map[$id] ?? [],
            'lien_externe'       => $ev['lien_externe'],
        ];
    }, $evs);
}