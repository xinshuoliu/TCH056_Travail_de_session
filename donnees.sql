
USE sorties_culturelles;

INSERT INTO categories (nom) VALUES
    ('Concert'),
    ('Activité'),
    ('Art'),
    ('Sport');

INSERT INTO villes (nom) VALUES
    ('Montréal'),
    ('Toronto'),
    ('New York'),
    ('Vancouver');

INSERT INTO publics (nom) VALUES
    ('Tous publics'),
    ('Familles'),
    ('Adultes'),
    ('Adolescents');

INSERT INTO mots_cles (mot) VALUES
    ('jazz'),
    ('blues'),
    ('concert'),
    ('hip-hop'),
    ('festival'),
    ('agriculture'),
    ('urbain'),
    ('art'),
    ('exposition'),
    ('hockey'),
    ('randonnée'),
    ('plein air'),
    ('basketball'),
    ('sport');  


INSERT INTO evenements (titre, image, description_courte, description_longue, date_heure, lieu, adresse, ville_id, categorie_id, public_id, prix) VALUES
    
        ('Soirée Jazz au quai',
        'images_evenement/jazz-photo.jpg',
        'Concert de jazz contemporain au bord du fleuve.',
        'Une soirée consacrée au jazz contemporain avec des musiciens de la scène locale. Le public est invité à découvrir des compositions originales dans une ambiance détendue.',
        '2026-06-12 à 20:00',
        'Maison de la Culture du Vieux-Port',
        'Montréal, Québec, Canada',
        1, 1, 1, 25.00), 


        ('Rolling Loud',
        'images_index/RollingL.png',
        'Un festival hip-hop explosif réunissant les plus grands noms du rap international sur scène.',
        'Rolling Loud réunit des centaines d''artistes sur plusieurs scènes pendant trois jours. Une expérience incontournable pour les amateurs de rap et de musique urbaine.',
        '2026-07-30 à 18:00',
        'Sony Hall',
        'New York, États-Unis',
        3, 1, 3, 150.00),


        ('Ferme en ville',
        'images_index/farm.jpg',
        'Découvrez l''agriculture urbaine en visitant des jardins et fermes communautaires au cœur de Montréal.',
        'Des visites guidées de jardins communautaires, de toits verts et de serres collectives au cœur de Montréal. Une belle occasion de sensibiliser les enfants à l''alimentation locale.',
        '2026-06-02 à 10:00',
        'Jardins communautaires de Montréal',
        'Montréal, Québec, Canada',
        1, 2, 2, 0.00),


        ('Exposition Banksy',
        'images_index/Banksy.jpg',
        'Une plongée dans l''univers provocateur et engagé du célèbre artiste urbain anonyme Banksy.',
        'Plus de 100 œuvres originales et reproductions grand format retracent l''évolution de Banksy, des rues de Bristol à ses installations mondiales. Vidéos et installations interactives incluses.',
        '2026-06-15 à 10:00',
        'Musée d''art contemporain de Montréal',
        'Montréal, Québec, Canada',
        1, 3, 1, 18.00),

        ('Match des Canadiens',
        'images_index/canadiens.png',
        'Encouragez le Tricolore lors d''un match palpitant au Centre Bell dans une atmosphère électrisante.',
        'Un match des Canadiens de Montréal au Centre Bell. Des milliers de partisans réunis pour soutenir le Tricolore dans une ambiance incomparable.',
        '2026-05-20 à 19:30',
        'Centre Bell',
        'Montréal, Québec, Canada',
        1, 4, 1, 65.00),


        ('Festival de Jazz de Montréal',
        'images_index/jazz.jpg',
        'Le plus grand festival de jazz au monde prend vie dans les rues de Montréal.',
        'Pendant deux semaines, des centaines de concerts gratuits et payants animent le Quartier des spectacles avec des artistes de renommée internationale.',
        '2026-06-27 à 18:00',
        'Quartier des spectacles',
        'Montréal, Québec, Canada',
        1, 1, 1, 0.00),

        ('Randonnée au Mont-Royal',
        'images_index/mont-royal.jpg',
        'Explorez les sentiers du Mont-Royal et profitez d''une vue panoramique sur la ville.',
        'Une randonnée guidée à travers le parc du Mont-Royal. Les participants découvriront la faune et la flore locales, avec des points de vue sur la ville et le fleuve Saint-Laurent.',
        '2026-05-10 à 09:00',
        'Parc du Mont-Royal',
        'Montréal, Québec, Canada',
        1, 2, 1, 0.00),


        ('Tournoi de Basketball 3x3',
        'images_index/basketball.jpg',
        'Assistez à un tournoi de basketball 3 contre 3 intense où les meilleures équipes de la région s''affrontent.',
        'Les meilleures équipes amateurs et semi-professionnelles de l''Ontario et du Québec s''affrontent en plein air, avec animations et musique pour les spectateurs.',
        '2026-08-05 à 10:00',
        'Harbourfront Centre',
        'Toronto, Ontario, Canada',
        2, 4, 1, 12.00);


-- Compte admin : exécuter creer_admin.php dans le navigateur 
-- Identifiants : admin / Admin1234!

INSERT INTO evenements_mots_cles (evenement_id, mot_cle_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 4),
    (2, 5),
    (3, 6),
    (3, 7),
    (4, 8),
    (4, 9), 
    (4, 7),
    (5, 10),
    (5, 14),
    (6, 1), 
    (6, 3),
    (6, 5),
    (7, 11),
    (7, 12),
    (8, 13),
    (8, 14);

