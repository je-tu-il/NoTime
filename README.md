# NoTime • Fond d'Écran iPhone Memento Mori

Actualisez automatiquement votre fond d'écran iPhone chaque matin à 6h00 avec une grille représentant toute votre vie en semaines.

- **1 point = 1 semaine de vie** (52 colonnes = 1 an par ligne, 80 lignes = 80 ans).
- **Points blancs** : les semaines déjà vécues.
- **Point rouge (ou accent)** : la semaine actuelle (où vous en êtes aujourd'hui).
- **Points gris** : le futur / le temps qu'il vous reste.
- **Fond noir pur OLED (#000000)** : économise la batterie sur iPhone et sublime l'écran.
- **Zone sécurisée iOS** : les points sont parfaitement placés sous l'horloge et les widgets de l'écran verrouillé.

---

## 💰 Coût & Architecture

- **Coût** : **0,00 €** à vie.
- **Consommation** : 1 requête par jour (soit ~30 requêtes/mois sur les 100 000 gratuites accordées chaque mois par Vercel).
- **Batterie iPhone** : quasi nulle (l'iPhone télécharge une image légère de 160 Ko en 0,2s puis l'applique).

---

## 🚀 1. Lancer et tester en local

```bash
# Dans le dossier NoTime
npm install
npm start
```

Ouvrez ensuite votre navigateur sur :
👉 `http://localhost:3000`

Vous aurez l'interface de prévisualisation en direct sur un iPhone 16 Pro, le calcul de vos statistiques (semaines vécues, pourcentage) et votre lien d'API personnalisé.

---

## ☁️ 2. Déployer gratuitement en ligne (Vercel)

Pour que votre iPhone puisse actualiser le fond d'écran sans dépendre de votre ordinateur allumé :

### Méthode A : Avec la CLI Vercel (le plus rapide, 1 minute)
```bash
npx vercel
```
1. Suivez les instructions rapides (connectez votre compte Vercel gratuit ou GitHub).
2. Validez les options par défaut (`Enter`).
3. Vercel vous donne votre URL publique (ex: `https://notime-xxx.vercel.app`).

### Méthode B : Via GitHub
1. Poussez ce dossier sur un dépôt GitHub (`git init`, `git add .`, `git commit -m "init"`, `git push`).
2. Rendez-vous sur [vercel.com](https://vercel.com) > **Add New Project** > importez votre repo.
3. Cliquez sur **Deploy**. C'est en ligne !

---

## 📱 3. Configuration du Raccourci iPhone (à faire 1 seule fois)

Sur votre iPhone :

1. Ouvrez l'application **Raccourcis** (installée par défaut sur iOS).
2. En bas au milieu, touchez l'onglet **Automatisations**.
3. Touchez **+** (en haut à droite) pour créer une nouvelle automatisation.
4. Choisissez **Heure de la journée** :
   - Réglez l'heure sur **06:00**.
   - Cochez **Répéter : Tous les jours**.
   - Cochez **Exécuter immédiatement** (très important pour que l'action se fasse sans vous demander confirmation).
   - Décochez **M'avertir lors de l'exécution** (pour ne pas recevoir de notification inutile à 6h).
5. Touchez **Suivant**, puis sélectionnez **Nouvelle automatisation vide**.
6. Touchez **Ajouter une action** et ajoutez ces deux actions simples :
   - **Action 1** : Cherchez `Obtenir le contenu de l'URL`.
     - Collez votre lien d'API : `https://ton-site.vercel.app/api/wallpaper?dob=AAAA-MM-JJ`
   - **Action 2** : Cherchez `Définir le fond d'écran`.
     - Laissez le paramètre sur `Contenu de l'URL`.
     - Choisissez `Écran verrouillé` (ou `Tous les deux`).
     - Touchez la petite flèche bleue/chevron de l'action et désactivez **Afficher l'aperçu**.
7. Touchez **Terminé**.

🎉 **Tout est prêt !** Dès demain matin à 6h00 (et chaque jour de votre vie), votre fond d'écran affichera le point exact de votre vie.
