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
- V2 : architecture **Data Chunking** —
  un fichier **JSON par lettre** dans `data/`, **lazy loading** à l'ouverture
  d'une lettre, recherche live, thème clair/sombre.
- V3 (**version en ligne**) : ajout du **فهرس المصدر الموحّد** `data/index.json`
  (noms de villes + fichier du حرف) avec **recherche globale + suggestions**
  (`jumpToEntry`), + **habillage patrimonial** aligné sur *Nuzhat al-Mushtaq*.

## 2. Architecture et fichiers

```
mujam-al-buldan/
├── index.html       # interface RTL patrimoniale (Aref Ruqaa + Amiri + Cairo)
    ├── .nojekyll           # GitHub Pages
    ├── tools/
    │   └── build_data.mjs  # extracteur texte intégral → JSON par lettre + index
    ├── data/
    │   ├── index.json   # فهرس المصدر الموحّد (12 292 villes → fichier du حرف)
    │   └── A…Y.json     # 28 fichiers (un par حرف, par كتاب)
    └── CONVERSATION_BACKUP.md
```

- **Alphabet → fichier** : `alphabetMap` (28 lettres dyalette) :
  A, B, T, TH, J, H, KH, D, DH, R, Z, S, SH, S2, D2, T2, Z2, E, GH, F, Q, K,
  L, M, N, H2, W, Y.
- **Format d'une fiche** : `{ id, name, type, text }`.

## 3. Fonctionnalités

- **Fond patrimonial (Nuzhat-style)** : lignes **Aref Ruqaa** (titres), textes
  classiques en **Amiri** + stack sûre (*Traditional Arabic / Scheherazade New /
  Lateef*), interface **Cairo** ; palette **or andalou** sur **brun foncé**
  (thème par défaut sombre) + thème clair « أحمر ياقوتي عتيق ».
- **فهرس أبجدي تفاعلي (A–Z)** : barre de boutons, chargement du fichier JSON de
  la lettre sélectionnée uniquement (`fetch('./data/XX.json')`).
- **بحث حي فوري (Instant Live Search)** : filtre sur la lettre actuellement
  chargée (nom + texte).
- **فهرس عام + اقتراحات (Global Index)** : `handleGlobalSearch()` dans
  `data/index.json`, suggestions `.suggestion-item`, saut direct vers la fiche
  par `jumpToEntry()` (charge le حرف puis la fiche ciblée).
- **Vue « 📜 الفهرس » complète** : bouton dans la barre d'outils → liste
  paginée (120/lot, « عرض المزيد ») de l'index entier (12 292), filtres par
  حرف (`letter-counts`) + recherche live, chaque ligne ouvre la fiche complet.
- **بطاقات الأماكن (Location Cards)** : nom, badge de type, texte justifié,
  filet doré (`::before`).
- **Thème sombre/clair persistant** (`localStorage: mujam_theme`), **sombre par
  défaut**, amorçage sans flash (script inline avant `initApp`).
- **المفضلة / Bookmarks** : étoile par fiche, sauvegarde locale
  (`localStorage: mujam_bookmarks`), bouton « ⭐ المفضلة (n) ».
- **Sécurité** : échappement HTML des contenus (`esc()`).

## 4. Déploiement

- Dépôt **créé** : `ucfzem/mujam-al-buldan` (public).
- Branche `main` = source ; branche **`gh-pages` = site publié** (mêmes fichiers,
  site statique).
- **GitHub Pages** activé sur `gh-pages` / racine → site en ligne.
- En ligne : `main` et `gh-pages` **au même commit** (fast-forward).
- Validation avant push : JSON parseable, JS `node --check` sur le script extrait.

## 4 bis. Texte intégral — extraction automatique

- **Source** : édition OpenITI/Shamela du livre **23735** (دار صادر 1995) au
  format **mARkdown** (`0626YaqutHamawi.MucjamBuldan.Shamela0023735-ara1`,
  ~10 Mo) — script **`tools/build_data.mjs`**.
- **Structure mARkdown** : articles signalés `### ||| $ Nom du lieu:` groupés
  dans les `### || باب X والـY`.
- **Résultat** : **12 292 fiches** réparties par lettre selon **le كتاب du
  livre** (bâtir sur le premier حرف nommé du باب : *باب الهمزة والواو* → fichier
  A, y compris les formes en « وآبل… ») ; **`data/index.json`** = index global
  (12 292 entrées).
- **Nettoyage** : suppression des marqueurs (`#`,`~~`, `%~%`, `ms\d+`,
  `PageVnp`, `QSxxVyy`), déduction d'un `type` (`بحر/بحيرة`, `جبل`, `نهر`,
  `وادي`, `قرية`, `كورة`, `حصن/قلعة`, …).
- **Fichiers remplacés** : A, B, Q, GH, T2 (fiches manuelles test) ← textes
  réels ; 23 nouvelles lettres (D, DH, H, … Y).
- Vérifié sur la plateforme : les 28 `data/*.json` + `index.json` répondent
  **HTTP 200** avec contenu complet (index ~1.2 Mo, A.json ~1 Mo).

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
| Commits du site (V3 + data) | https://github.com/ucfzem/mujam-al-buldan/commits/main |
| Link tree `/works` | https://ucfzem.github.io/works/ |
| Commit link tree | https://github.com/ucfzem/ucfzem.github.io/commit/e882f95 |
| Ce backup | https://github.com/ucfzem/mujam-al-buldan/blob/main/CONVERSATION_BACKUP.md |

## 7. Suite prévue

- Idéalement **paginer / afficher en différé** l'ouverture d'une lettre (ex. A :
  1 194 fiches → DOM lourd sur mobile).
- Éventuel bouton **Google Maps** par fiche (lieux existants).
- Reconstruire à tout moment avec `node tools/build_data.mjs` (nécessite le
  fichier source `shamela_mojam.txt` depuis le repo OpenITI `0650AH`).

---

*Généré automatiquement par OpenCode.*
