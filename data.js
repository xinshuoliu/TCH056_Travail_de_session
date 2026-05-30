const categories = [
    { id: 1, nom: "Concert" },
    { id: 2, nom: "Activité" },
    { id: 3, nom: "Art" },
    { id: 4, nom: "Sport" }
];

const villes = [
    { id: 1, nom: "Montréal" },
    { id: 2, nom: "Toronto" },
    { id: 3, nom: "New York" },
    { id: 4, nom: "Vancouver" }
];

const publics = [
    { id: 1, nom: "Tous publics" },
    { id: 2, nom: "Familles" },
    { id: 3, nom: "Adultes" },
    { id: 4, nom: "Adolescents" }
];

const mots_cles = [
    { id: 1,  mot: "jazz" },
    { id: 2,  mot: "blues" },
    { id: 3,  mot: "concert" },
    { id: 4,  mot: "hip-hop" },
    { id: 5,  mot: "festival" },
    { id: 6,  mot: "agriculture" },
    { id: 7,  mot: "urbain" },
    { id: 8,  mot: "art" },
    { id: 9,  mot: "exposition" },
    { id: 10, mot: "hockey" },
    { id: 11, mot: "randonnée" },
    { id: 12, mot: "plein air" },
    { id: 13, mot: "basketball" },
    { id: 14, mot: "sport" }
];

const evenements = [
    {
        id: 1,
        titre: "Soirée Jazz au quai",
        image: "images_evenement/jazz-photo.jpg",
        description_courte: "Concert de jazz contemporain au bord du fleuve.",
        description_longue: "Une soirée consacrée au jazz contemporain avec des musiciens de la scène locale. Le public est invité à découvrir des compositions originales dans une ambiance détendue.",
        date_heure: "2026-06-12 à 20:00",
        lieu: "Maison de la Culture du Vieux-Port",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 1,
        public_id: 1,
        prix: 25.00,
        mots_cles_ids: [1, 2, 3],
        lien_externe: null
    },
    {
        id: 2,
        titre: "Rolling Loud",
        image: "images_index/RollingL.png",
        description_courte: "Un festival hip-hop explosif réunissant les plus grands noms du rap international sur scène.",
        description_longue: "Rolling Loud réunit des centaines d'artistes sur plusieurs scènes pendant trois jours. Une expérience incontournable pour les amateurs de rap et de musique urbaine.",
        date_heure: "2026-07-30 à 18:00",
        lieu: "Sony Hall",
        adresse: "New York, États-Unis",
        ville_id: 3,
        categorie_id: 1,
        public_id: 3,
        prix: 150.00,
        mots_cles_ids: [4, 5],
        lien_externe: null
    },
    {
        id: 3,
        titre: "Ferme en ville",
        image: "images_index/farm.jpg",
        description_courte: "Découvrez l'agriculture urbaine en visitant des jardins et fermes communautaires au cœur de Montréal.",
        description_longue: "Des visites guidées de jardins communautaires, de toits verts et de serres collectives au cœur de Montréal. Une belle occasion de sensibiliser les enfants à l'alimentation locale.",
        date_heure: "2026-06-02 à 10:00",
        lieu: "Jardins communautaires de Montréal",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 2,
        public_id: 2,
        prix: 0,
        mots_cles_ids: [6, 7],
        lien_externe: null
    },
    {
        id: 4,
        titre: "Exposition Banksy",
        image: "images_index/Banksy.jpg",
        description_courte: "Une plongée dans l'univers provocateur et engagé du célèbre artiste urbain anonyme Banksy.",
        description_longue: "Plus de 100 œuvres originales et reproductions grand format retracent l'évolution de Banksy, des rues de Bristol à ses installations mondiales. Vidéos et installations interactives incluses.",
        date_heure: "2026-06-15 à 10:00",
        lieu: "Musée d'art contemporain de Montréal",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 3,
        public_id: 1,
        prix: 18.00,
        mots_cles_ids: [8, 9, 7],
        lien_externe: null
    },
    {
        id: 5,
        titre: "Match des Canadiens",
        image: "images_index/canadiens.png",
        description_courte: "Encouragez le Tricolore lors d'un match palpitant au Centre Bell dans une atmosphère électrisante.",
        description_longue: "Un match des Canadiens de Montréal au Centre Bell. Des milliers de partisans réunis pour soutenir le Tricolore dans une ambiance incomparable.",
        date_heure: "2026-05-20 à 19:30",
        lieu: "Centre Bell",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 4,
        public_id: 1,
        prix: 65.00,
        mots_cles_ids: [10, 14],
        lien_externe: null
    },
    {
        id: 6,
        titre: "Festival de Jazz de Montréal",
        image: "images_index/jazz.jpg",
        description_courte: "Le plus grand festival de jazz au monde prend vie dans les rues de Montréal.",
        description_longue: "Pendant deux semaines, des centaines de concerts gratuits et payants animent le Quartier des spectacles avec des artistes de renommée internationale.",
        date_heure: "2026-06-27 à 18:00",
        lieu: "Quartier des spectacles",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 1,
        public_id: 1,
        prix: 0,
        mots_cles_ids: [1, 3, 5],
        lien_externe: null
    },
    {
        id: 7,
        titre: "Randonnée au Mont-Royal",
        image: "images_index/mont-royal.jpg",
        description_courte: "Explorez les sentiers du Mont-Royal et profitez d'une vue panoramique sur la ville.",
        description_longue: "Une randonnée guidée à travers le parc du Mont-Royal. Les participants découvriront la faune et la flore locales, avec des points de vue sur la ville et le fleuve Saint-Laurent.",
        date_heure: "2026-05-10 à 09:00",
        lieu: "Parc du Mont-Royal",
        adresse: "Montréal, Québec, Canada",
        ville_id: 1,
        categorie_id: 2,
        public_id: 1,
        prix: 0,
        mots_cles_ids: [11, 12],
        lien_externe: null
    },
    {
        id: 8,
        titre: "Tournoi de Basketball 3x3",
        image: "images_index/basketball.jpg",
        description_courte: "Assistez à un tournoi de basketball 3 contre 3 intense où les meilleures équipes de la région s'affrontent.",
        description_longue: "Les meilleures équipes amateurs et semi-professionnelles de l'Ontario et du Québec s'affrontent en plein air, avec animations et musique pour les spectateurs.",
        date_heure: "2026-08-05 à 10:00",
        lieu: "Harbourfront Centre",
        adresse: "Toronto, Ontario, Canada",
        ville_id: 2,
        categorie_id: 4,
        public_id: 1,
        prix: 12.00,
        mots_cles_ids: [13, 14],
        lien_externe: null
    }
];
