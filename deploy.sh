#!/usr/bin/env bash
set -e

echo "=================================================="
echo "  🚀 Déploiement Local - WebApp Docker"
echo "=================================================="

# Se placer dans le dossier du projet
cd /vagrant 2>/dev/null || cd "$(dirname "$0")"

echo "1. Exécution des tests automatisés Jest..."
npm test

echo "2. Construction de la nouvelle image Docker..."
docker build -t webapp-cicd:latest .

echo "3. Arrêt et suppression de l'ancien conteneur..."
docker stop webapp-container 2>/dev/null || true
docker rm webapp-container 2>/dev/null || true

echo "4. Démarrage du nouveau conteneur sur le port 80..."
docker run -d --name webapp-container --restart always -v /vagrant/public:/app/public -p 80:3000 webapp-cicd:latest

echo "=================================================="
echo "  ✅ Déploiement réussi sur le port 80 !"
echo "=================================================="
docker ps --filter "name=webapp-container"
