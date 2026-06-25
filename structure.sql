USE mydatabase;

CREATE TABLE categories (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);
CREATE TABLE villes (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);
CREATE TABLE publics (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);
CREATE TABLE mots_cles (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    mot VARCHAR(100) NOT NULL
);
CREATE TABLE evenements (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    titre              VARCHAR(255) NOT NULL,
    image              VARCHAR(500),
    description_courte TEXT,
    description_longue TEXT,
    date_heure         VARCHAR(50),
    lieu               VARCHAR(255),
    adresse            VARCHAR(255),
    ville_id           INT,
    categorie_id       INT,
    public_id          INT,
    prix               DECIMAL(10,2) DEFAULT 0.00,
    accessibilite      VARCHAR(100),
    lien_externe       VARCHAR(500),
    FOREIGN KEY (ville_id)     REFERENCES villes(id)     ON DELETE SET NULL,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (public_id)    REFERENCES publics(id)    ON DELETE SET NULL
);

CREATE TABLE evenements_mots_cles (
    evenement_id INT NOT NULL,
    mot_cle_id   INT NOT NULL,
    PRIMARY KEY (evenement_id, mot_cle_id),
    FOREIGN KEY (evenement_id) REFERENCES evenements(id),
    FOREIGN KEY (mot_cle_id)   REFERENCES mots_cles(id)
);

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom                 VARCHAR(100) NOT NULL,
    prenom              VARCHAR(100) NOT NULL,
    nom_utilisateur     VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe        VARCHAR(255),
    type ENUM('admin', 'utilisateur') DEFAULT 'utilisateur'
);


