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
- V4 : **texte intégral** (12 292 fiches) + **vue « 📜 الفهرس » complète**
  (liste paginée filtrable par حرف).
- V4.1 (**tweaks mobiles**) : `normalizeArabic()` = recherche tolérante aux
  formes (أ/إ/آ ← ا, ى ← ي, ؤ ← و, ئ ← ي, sans tashkîl) côté suggestions, filtre
  de حرف, vue الفهرس et saut direct ; **barre alphabétique collante**
  (`position: sticky`) ; **scroll-to-top** au changement de حرف ; fermeture des
  suggestions au clic extérieur.

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
| Commit déployé (`main`=`gh-pages`) | https://github.com/ucfzem/mujam-al-buldan/commit/e66b973 |
| Commit « texte intégral » | https://github.com/ucfzem/mujam-al-buldan/commit/7d1a38e |
| Tout l'historique (V2→V4) | https://github.com/ucfzem/mujam-al-buldan/commits/main |
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

## 7. Thème — apparence « Nuzhat al-Mushtaq (version originale ancienne) »

**Demande** : donner à `mujam-al-buldan` les **mêmes polices / thèmes / mode
sombre-clair** que `nuzhat-al-mushtaq.vercel.app` (version d'origine).

**Polices** : `Cairo` (UI) + `Amiri` (corps du texte) — lien Google Fonts
identique à Nuzhat. (Retrait d'`Aref Ruqaa`, remplacé par `Amiri`.)

**Palette d'origine (d'après la capture Nuzhat)** :

| Rôle | Sombre (défaut) | Clair |
|------|-----------------|-------|
| Fond page `--bg-color` | `#181816` | `#faf5e9` |
| Texte `--text-color` | `#e0e0e0` | `#2b2118` |
| En-tête `--header-bg` | `#2d5a42` (vert forêt) | `#2d5a42` |
| Titre en-tête `--header-text` | `#a8d5ba` (sauge) | `#f5eeda` |
| Accent or `--primary-color` | `#c2a15d` | `#a9792f` |
| Accent n°2 `--accent-color` | `#a8d5ba` | `#1f5c46` |
| Carte `--card-bg` | `#1e1e1b` | `#fffdf6` |

**Mode sombre/clair** : `:root` = sombre (défaut) ; `[data-theme="light"]` =
clair ; amorçage `mujam_theme` ou `prefers-color-scheme` (sombre par défaut),
comme Nuzhat. Bouton **soleil/lune** (`☀️`/`🌙`).

**En plus (façon Nuzhat)** : contrôles de taille du texte **A− / A+**
(variable `--content-font-size`, persistée `mujam_fontsize`).

**Typographie (tolfa moderne + patrimoniale)** — 3 familles :

- **Cairo** (Kufi géométrique moderne, graisse **800**, `letter-spacing:-0.5px`)
  pour les **titres, en-têtes, badges, boutons et UI** (`h1`, `.entry-title`,
  `.section-heading`, `.entry-badge`, `.btn-theme`), avec
  **IBM Plex Sans Arabic** en repli ;
- **Amiri** (Naskh classique) pour le **corps des textes** (`.entry-content`,
  suggestions, noms d'index, barre alphabétique) ;
- **Aref Ruqaa** pour les **phrases d'ouverture** (`.calligraphy-heading`).

Lien Google Fonts : `Amiri` + `Aref Ruqaa` + `Cairo:400;600;700;800;900` +
`IBM Plex Sans Arabic:500;700`.

**Commits** :

| Étape | Commit |
|-------|--------|
| Thème palette Nuzhat (1re passe) | `863eda5` |
| Apparence originale ancienne + A−/A+ | `314d28a` |
| Typographie Kufi moderne (Cairo 800) | `c52674c` |

**Description (sous-titre)** : police **Cairo Play** (Google Fonts),
couleur **`#92b1a3`**, taille **1.25rem**, poids **500**, `direction: rtl`
(classe `.description` appliquée au `<p>` de l'en-tête).

### Correction — saut horizontal au rafraîchissement (RTL)

Symptôme : en actualisant la page, le contenu sautait vers la droite. Cause :
**débordement horizontal** (page RTL → la barre de défilement horizontale
place la vue à droite). Correctifs (commit `299df4c`) :

- `html { overflow-x: clip; }` et `body { overflow-x: clip; max-width:100%; }`
  — `clip` **ne crée pas** de conteneur de défilement, donc `position: sticky`
  (barre alphabétique) continue de fonctionner ;
- `if ('scrollRestoration' in history) history.scrollRestoration = 'manual';`
  — empêche la restauration d'une position de défilement erronée ;
- `.entry-header { flex-wrap: wrap; }`, `.entry-title { min-width:0;
  overflow-wrap: break-word; font-size: clamp(1.6rem,6vw,2.4rem); }`,
  `.entry-content { overflow-wrap: break-word; }`.

| Étape | Commit |
|-------|--------|
| Description Cairo Play + fix saut horizontal RTL | `299df4c` |

**Couleur du titre** : le titre `معجم البلدان` est **beige `#f5eeda`**
dans **les deux** modes (sombre et clair). En mode sombre, `--header-text`
est passé de `#a8d5ba` (pistache) à `#f5eeda` — plus de vert pistache pour
le titre. Commit `68dc4aa`.

---

*Généré automatiquement par OpenCode.*
