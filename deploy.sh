#!/usr/bin/env bash
set -e

echo "=================================================="
echo "  🚀 Déploiement Local - WebApp, Prometheus & Grafana"
echo "=================================================="

cd /vagrant 2>/dev/null || cd "$(dirname "$0")"

echo "1. Exécution des tests automatisés Jest..."
npm test

echo "2. Démarrage de la stack Docker Compose (WebApp + Prometheus + Grafana)..."
docker compose up -d --build

echo "=================================================="
echo "  ✅ Stack déployée avec succès !"
echo "=================================================="
echo "  🌐 Web App    : http://localhost:8080"
echo "  📈 Grafana    : http://localhost:3001"
echo "  🔥 Prometheus : http://localhost:9090"
echo "=================================================="
docker compose ps
