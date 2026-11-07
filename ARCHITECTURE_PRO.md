# Architecture Professionnelle — NoTime

## 1. Rendu SVG Dynamique & Memento Mori
Génération d'une matrice vectorielle de 52 colonnes (semaines) sur 80 lignes (années).
Mise en cache HTTP avec en-têtes ETag et stale-while-revalidate pour absorber les pics d'actualisation iOS à 6h du matin.
