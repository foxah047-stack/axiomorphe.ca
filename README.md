# CGBVRR — Site web Jekyll

Site web du Conseil de gestion du bassin versant de la rivière Restigouche.

---

## Installation (une seule fois)

### 1. Installer Ruby et Jekyll

**Windows (PowerShell en admin) :**
```powershell
winget install RubyInstallerTeam.RubyWithDevKit
# Fermer et rouvrir PowerShell, puis :
gem install jekyll bundler
```

**Mac :**
```bash
brew install ruby
gem install jekyll bundler
```

### 2. Installer les dépendances du projet
```bash
cd cgbvrr
bundle install
```

### 3. Lancer le serveur local
```bash
bundle exec jekyll serve
# Ouvrir : http://localhost:4000
```

---

## Ajouter un article (workflow quotidien)

Les articles sont des fichiers `.md` dans le dossier `_posts/`.

### Format du nom de fichier :
```
AAAA-MM-JJ-titre-court.md
```

### Exemple d'article complet :
```markdown
---
layout: post
title: "Titre de l'article ici"
categorie: "Nouvelles"          # Nouvelles | Protection | WATERSHADE | Partenariat
projet: "WATERSHADE"            # Projet lié (optionnel)
auteur: "Équipe terrain CGBVRR" # Optionnel
excerpt: "Résumé court affiché sur la page d'accueil et dans les listes."
---

Contenu de l'article en Markdown.

## Sous-titre

Paragraphe normal.

- Point 1
- Point 2
```

### Publier :
```bash
git add .
git commit -m "Nouvelle : titre de l'article"
git push
```
GitHub Pages reconstruit le site automatiquement en ~1 minute.

---

## Mettre à jour les projets

Éditer le fichier `_data/projets.yml` directement. Les changements apparaissent sur la page d'accueil après le prochain `git push`.

---

## RSS — Comment ça fonctionne

Le fichier `feed.xml` est généré automatiquement par le plugin `jekyll-feed` à chaque build. Il contient les 20 derniers articles. URL : `https://restigouche.org/feed.xml`

Les partenaires (MPO, FCAS, etc.) peuvent s'y abonner dans leur agrégateur. Aucune action requise de votre part.

---

## Formulaires de contact et d'infolettre

Le site utilise **Formspree** (gratuit jusqu'à 50 soumissions/mois) :

1. Créer un compte sur formspree.io
2. Créer deux formulaires (contact + infolettre)
3. Remplacer `REPLACE_WITH_FORMSPREE_ID` dans :
   - `index.html` (formulaire contact)
   - `_includes/footer.html` (infolettre)

---

## Déploiement sur GitHub Pages

1. Créer un dépôt GitHub nommé `restigouche.org` (ou le nom de votre choix)
2. Pousser le code :
```bash
git init
git remote add origin https://github.com/VOTRE_NOM/cgbvrr.git
git add .
git commit -m "Lancement initial"
git push -u origin main
```
3. Dans les paramètres du dépôt → Pages → Source : `main`
4. Configurer le domaine custom `restigouche.org` si désiré

---

## Structure des fichiers

```
cgbvrr/
├── _config.yml          ← Configuration générale du site
├── _data/
│   └── projets.yml      ← Liste des projets (éditer ici)
├── _includes/
│   ├── nav.html         ← Navigation (identique sur toutes les pages)
│   ├── footer.html      ← Pied de page + infolettre
│   └── partners.html    ← Section partenaires
├── _layouts/
│   ├── default.html     ← Gabarit de base (toutes les pages)
│   └── post.html        ← Gabarit des articles de nouvelles
├── _posts/              ← ← ← VOS ARTICLES ICI
├── assets/
│   ├── css/main.css     ← Styles (modifier avec précaution)
│   └── js/main.js       ← Scripts (carte, menu mobile)
├── nouvelles/
│   └── index.html       ← Page liste des nouvelles
├── Gemfile              ← Dépendances Ruby
└── index.html           ← Page d'accueil
```
