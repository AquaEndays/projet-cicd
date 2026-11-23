# Projet CI/CD & DevOps - Conteneurisation Docker & GitHub Actions

Application web moderne propulsée par **Node.js / Express**, conteneurisée avec **Docker**, et déployée automatiquement via un pipeline **GitHub Actions** exécuté sur un **Self-Hosted Runner** hébergé dans une machine virtuelle **Ubuntu (Vagrant / VirtualBox)**.

---

## 🏗️ Architecture du Projet

- **Site Web & API :** Node.js 20, Express, HTML5/CSS3 responsive avec badge dynamique.
- **Tests Automatisés :** Jest + Supertest (`npm test`).
- **Conteneurisation :** Dockerfile multi-stage léger (`node:20-alpine`) exposé sur le port 80.
- **CI/CD :** Pipeline GitHub Actions (`runs-on: self-hosted`) déclenché à chaque `push` sur la branche `main`.
- **Infrastructure :** Machine virtuelle Ubuntu 22.04 gérée par Vagrant en mode réseau Pont (`public_network`), accessible sur le réseau local Wi-Fi à l'adresse `http://192.168.1.128`.

---

## 🚀 Pipeline CI/CD

À chaque commit poussé sur `main` :
1. **Checkout :** Récupération du code source.
2. **Install :** Installation propre des dépendances (`npm ci`).
3. **Tests :** Exécution de la suite de tests automatisés (`npm test`).
4. **Build :** Construction de l'image Docker `webapp-cicd:latest`.
5. **Redéploiement :** Arrêt de l'ancien conteneur `webapp-container` et lancement de la nouvelle version sur le port 80 avec `--restart always`.

---

## 🌐 Accès à l'application

- **Réseau Local (PC / Téléphone) :** `http://192.168.1.128`
- **Port VM :** `80` (redirigé en interne vers le port `3000` de l'application)
