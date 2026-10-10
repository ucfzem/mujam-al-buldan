# Backup de conversation — Projet **Mujam al-Buldan**

> Sauvegarde de l'échange ayant conduit à la création et au déploiement de la
> version numérique de **« معجم البلدان »** de شهاب الدين ياقوت الحموي (ت 626 هـ),
> dans le même esprit que les projets précédents (dont *Al-Istibsar*).

---

## 1. Demande (utilisateur)

- Nouveau **projet livre** (« a new project book in the same way as others ») :
  l'immense **معجم البلدان** de Yaqut al-Hamawi, classé par ordre alphabétique
  (حروف المعجم) — idéal pour une navigation A–Z rapide, adaptée aux mobiles.
- V1 : une page `index.html` autonome (prototype).
- V2 (**version retenue**) : architecture **Data Chunking** —
  un fichier **JSON par lettre** dans `data/`, **lazy loading** à l'ouverture
  d'une lettre, recherche live, thème clair/sombre.

## 2. Architecture et fichiers

```
mujam-al-buldan/
├── index.html          # interface RTL (Amiri + Cairo)
├── .nojekyll           # GitHub Pages
├── data/
│   ├── A.json          # إشبيلية
│   ├── B.json          # بغداد
│   ├── Q.json          # قرطبة
│   ├── GH.json         # غرناطة
│   └── T2.json         # طنجة، طرسوس
└── CONVERSATION_BACKUP.md
```

- **Alphabet → fichier** : `alphabetMap` (28 lettres dyalette) :
  A, B, T, TH, J, H, KH, D, DH, R, Z, S, SH, S2, D2, T2, Z2, E, GH, F, Q, K,
  L, M, N, H2, W, Y.
- **Format d'une fiche** : `{ id, name, type, text }`.

## 3. Fonctionnalités

- **فهرس أبجدي تفاعلي (A–Z)** : barre de boutons, chargement du fichier JSON de
  la lettre sélectionnée uniquement (`fetch('./data/XX.json')`).
- **بحث حي فوري (Instant Live Search)** : filtre sur la lettre actuellement
  chargée (nom + texte).
- **بطاقات الأماكن (Location Cards)** : nom, badge de type, texte justifié.
- **Thème sombre/clair** persistant (`localStorage: mujam_theme`) + amorçage
  sans flash (`prefers-color-scheme`).
- **المفضلة / Bookmarks** : étoile par fiche, sauvegarde locale
  (`localStorage: mujam_bookmarks`), bouton « ⭐ المفضلة ».
- **Sécurité** : échappement HTML des contenus (`esc()`).

## 4. Déploiement

- Dépôt **créé** : `ucfzem/mujam-al-buldan` (public).
- Branche `main` = source ; branche **`gh-pages` = site publié** (mêmes fichiers,
  site statique).
- **GitHub Pages** activé sur `gh-pages` / racine → site en ligne.
- Vérifications live : la page répond **HTTP 200** ; les **5 fichiers**
  `data/*.json` répondent **HTTP 200** avec le bon nombre de fiches.

## 5. Intégration au link tree `/works`

Fichier : `ucfzem/ucfzem.github.io` → **`works/index.html`** (section ouverte
**« Projets publics »**).

- Insertion **au milieu** de la liste, **juste après Al-Istibsar** →
  **position 9**.
- **Icône** : **📚** (dictionnaire / lexique). **Tag** : `Geography`.
- URL : `https://ucfzem.github.io/mujam-al-buldan/` (nouvel onglet).
- Sous-titre mis à jour : « 16 projets publics » → **« 17 projets publics »**.
- **JSON-LD** (`ItemList`) : nouvelle entrée en position 9 + renumérotation
  `9 → 10` … `19 → 20`.
- **Sécurité** : fichier sauvegardé, diff vérifié ligne par ligne, validations
  automatiques (JSON-LD parsable, tableau JS valide, `num` séquentiels 1→17,
  URLs uniques, **16 projets précédents intacts**) avant commit.

## 6. Liens

| Ressource | URL |
|-----------|-----|
| Site en ligne | https://ucfzem.github.io/mujam-al-buldan/ |
| Dépôt (source) | https://github.com/ucfzem/mujam-al-buldan |
| Branche de déploiement | https://github.com/ucfzem/mujam-al-buldan/tree/gh-pages |
| Commit initial du site | https://github.com/ucfzem/mujam-al-buldan/commit/ad0d587 |
| Link tree `/works` | https://ucfzem.github.io/works/ |
| Commit link tree | https://github.com/ucfzem/ucfzem.github.io/commit/e882f95 |
| Ce backup | https://github.com/ucfzem/mujam-al-buldan/blob/main/CONVERSATION_BACKUP.md |

## 7. Suite prévue

- **Enrichir `data/*.json`** avec le texte intégral, lettre par lettre, depuis
  المكتبة الشاملة ou **OpenITI** (textes libres de droits).
- Ajouter éventuellement un bouton **Google Maps** par fiche (lieux existants).

---

*Généré automatiquement par OpenCode.*
