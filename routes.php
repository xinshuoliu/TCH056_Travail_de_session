<?php

$router->get('/', function() use ($pdo) {
    require 'index.php';
});

$router->get('/index.php', function() use ($pdo) {
    require 'index.php';
});

$router->get('/evenement.php', function() use ($pdo) {
    require 'evenement.php';
});

$router->get('/login.php', function() {
    require 'login.php';
});

$router->post('/login.php', function() {
    require 'login.php';
});

$router->get('/nouveau_compte.php', function() {
    require 'nouveau_compte.php';
});

$router->post('/nouveau_compte.php', function() {
    require 'nouveau_compte.php';
});

function verifier_admin() {
    if (!isset($_SESSION['utilisateur']) || $_SESSION['utilisateur']['type'] !== 'admin') {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Accès refusé']);
        exit;
    }
}

$router->get('/api/evenements/:id/similaires', function($id) use ($pdo) {
    $id = (int)$id;

    $stmt = $pdo->prepare('SELECT categorie_id, ville_id FROM evenements WHERE id = ?');
    $stmt->execute([$id]);
    $ev = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ev) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Événement introuvable']);
        return;
    }

    $stmt = $pdo->prepare(
        'SELECT id, titre, image, description_courte, date_heure, lieu, adresse,
                ville_id, categorie_id, public_id, prix, lien_externe
         FROM evenements
         WHERE id != ? AND (categorie_id = ? OR ville_id = ?)
         LIMIT 4'
    );
    $stmt->execute([$id, (int)$ev['categorie_id'], (int)$ev['ville_id']]);
    $similaires = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($similaires as &$s) {
        $s['id']           = (int)$s['id'];
        $s['ville_id']     = (int)$s['ville_id'];
        $s['categorie_id'] = (int)$s['categorie_id'];
        $s['public_id']    = (int)$s['public_id'];
        $s['prix']         = (float)$s['prix'];
    }

    header('Content-Type: application/json');
    echo json_encode($similaires);
});

$router->get('/api/evenements/:id', function($id) use ($pdo) {
    $id = (int)$id;

    $stmt = $pdo->prepare(
        'SELECT id, titre, image, description_courte, description_longue, date_heure,
                lieu, adresse, ville_id, categorie_id, public_id, prix, accessibilite, lien_externe
         FROM evenements WHERE id = ?'
    );
    $stmt->execute([$id]);
    $ev = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ev) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Événement introuvable']);
        return;
    }

    $ev['id']           = (int)$ev['id'];
    $ev['ville_id']     = (int)$ev['ville_id'];
    $ev['categorie_id'] = (int)$ev['categorie_id'];
    $ev['public_id']    = (int)$ev['public_id'];
    $ev['prix']         = (float)$ev['prix'];

    $stmt = $pdo->prepare('SELECT mot_cle_id FROM evenements_mots_cles WHERE evenement_id = ?');
    $stmt->execute([$id]);
    $ev['mots_cles_ids'] = array_map(function($r) { return (int)$r['mot_cle_id']; }, $stmt->fetchAll(PDO::FETCH_ASSOC));

    header('Content-Type: application/json');
    echo json_encode($ev);
});

$router->get('/api/evenements', function() use ($pdo) {
    $categorie = $_GET['categorie'] ?? null;
    $ville     = $_GET['ville']     ?? null;
    $public    = $_GET['public']    ?? null;
    $tri       = $_GET['tri']       ?? 'date';
    $recherche = trim($_GET['recherche'] ?? '');
    $page      = max(1, (int)($_GET['page'] ?? 1));
    $par_page  = 12;

    $conditions = [];
    $params     = [];

    if ($categorie) { $conditions[] = 'e.categorie_id = ?'; $params[] = (int)$categorie; }
    if ($ville)     { $conditions[] = 'e.ville_id = ?';     $params[] = (int)$ville; }
    if ($public)    { $conditions[] = 'e.public_id = ?';    $params[] = (int)$public; }
    if ($recherche) {
        $conditions[] = '(e.titre LIKE ? OR e.lieu LIKE ? OR v.nom LIKE ?)';
        $params[] = '%' . $recherche . '%';
        $params[] = '%' . $recherche . '%';
        $params[] = '%' . $recherche . '%';
    }

    $where  = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';
    $ordre  = $tri === 'prix' ? 'e.prix' : 'e.date_heure';
    $offset = ($page - 1) * $par_page;

    $stmt = $pdo->prepare(
        "SELECT e.id, e.titre, e.image, e.description_courte, e.description_longue,
                e.date_heure, e.lieu, e.adresse, e.ville_id, e.categorie_id, e.public_id,
                e.prix, e.accessibilite, e.lien_externe
         FROM evenements e
         LEFT JOIN villes v ON e.ville_id = v.id
         $where ORDER BY $ordre LIMIT $par_page OFFSET $offset"
    );
    $stmt->execute($params);
    $evs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($evs as &$ev) {
        $ev['id']           = (int)$ev['id'];
        $ev['ville_id']     = (int)$ev['ville_id'];
        $ev['categorie_id'] = (int)$ev['categorie_id'];
        $ev['public_id']    = (int)$ev['public_id'];
        $ev['prix']         = (float)$ev['prix'];
    }

    $countStmt = $pdo->prepare(
        "SELECT COUNT(*) FROM evenements e LEFT JOIN villes v ON e.ville_id = v.id $where"
    );
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    header('Content-Type: application/json');
    echo json_encode([
        'evenements' => $evs,
        'total'      => $total,
        'page'       => $page,
        'pages'      => (int)ceil($total / $par_page)
    ]);
});

$router->post('/api/evenements', function() use ($pdo) {
    verifier_admin();

    $donnees = json_decode(file_get_contents('php://input'), true);

    if (!$donnees || empty($donnees['titre']) || empty($donnees['date_heure'])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Données invalides']);
        return;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO evenements (titre, image, description_courte, description_longue,
                                 date_heure, lieu, adresse, ville_id, categorie_id,
                                 public_id, prix, accessibilite, lien_externe)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $donnees['titre'],
        $donnees['image']              ?? null,
        $donnees['description_courte'] ?? null,
        $donnees['description_longue'] ?? null,
        $donnees['date_heure'],
        $donnees['lieu']               ?? null,
        $donnees['adresse']            ?? null,
        $donnees['ville_id']           ?? null,
        $donnees['categorie_id']       ?? null,
        $donnees['public_id']          ?? null,
        $donnees['prix']               ?? 0,
        $donnees['accessibilite']      ?? null,
        $donnees['lien_externe']       ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();

    $stmt2 = $pdo->prepare('SELECT * FROM evenements WHERE id = ?');
    $stmt2->execute([$id]);
    $ev = $stmt2->fetch(PDO::FETCH_ASSOC);

    $ev['id']            = (int)$ev['id'];
    $ev['ville_id']      = (int)$ev['ville_id'];
    $ev['categorie_id']  = (int)$ev['categorie_id'];
    $ev['public_id']     = (int)$ev['public_id'];
    $ev['prix']          = (float)$ev['prix'];
    $ev['mots_cles_ids'] = [];

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($ev);
});

$router->put('/api/evenements/:id', function($id) use ($pdo) {
    verifier_admin();

    $id      = (int)$id;
    $donnees = json_decode(file_get_contents('php://input'), true);

    if (!$donnees || empty($donnees['titre']) || empty($donnees['date_heure'])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Données invalides']);
        return;
    }

    $stmt = $pdo->prepare(
        'UPDATE evenements
         SET titre=?, image=?, description_courte=?, description_longue=?,
             date_heure=?, lieu=?, adresse=?, ville_id=?, categorie_id=?,
             public_id=?, prix=?, accessibilite=?, lien_externe=?
         WHERE id=?'
    );
    $stmt->execute([
        $donnees['titre'],
        $donnees['image']              ?? null,
        $donnees['description_courte'] ?? null,
        $donnees['description_longue'] ?? null,
        $donnees['date_heure'],
        $donnees['lieu']               ?? null,
        $donnees['adresse']            ?? null,
        $donnees['ville_id']           ?? null,
        $donnees['categorie_id']       ?? null,
        $donnees['public_id']          ?? null,
        $donnees['prix']               ?? 0,
        $donnees['accessibilite']      ?? null,
        $donnees['lien_externe']       ?? null,
        $id,
    ]);

    $stmt2 = $pdo->prepare('SELECT * FROM evenements WHERE id = ?');
    $stmt2->execute([$id]);
    $ev = $stmt2->fetch(PDO::FETCH_ASSOC);

    if (!$ev) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Événement introuvable']);
        return;
    }

    $ev['id']           = (int)$ev['id'];
    $ev['ville_id']     = (int)$ev['ville_id'];
    $ev['categorie_id'] = (int)$ev['categorie_id'];
    $ev['public_id']    = (int)$ev['public_id'];
    $ev['prix']         = (float)$ev['prix'];

    header('Content-Type: application/json');
    echo json_encode($ev);
});

$router->delete('/api/evenements/:id', function($id) use ($pdo) {
    verifier_admin();

    $id = (int)$id;

    $stmt = $pdo->prepare('SELECT id FROM evenements WHERE id = ?');
    $stmt->execute([$id]);

    if (!$stmt->fetch()) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['erreur' => 'Événement introuvable']);
        return;
    }

    $pdo->prepare('DELETE FROM evenements_mots_cles WHERE evenement_id = ?')->execute([$id]);
    $pdo->prepare('DELETE FROM evenements WHERE id = ?')->execute([$id]);

    header('Content-Type: application/json');
    echo json_encode(['message' => 'Événement supprimé']);
});
