#! /bin/bash

set -e

if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Error: docker-compose no está instalado." >&2
  exit 1
fi

echo "Iniciando el contenedor Docker..."
docker-compose up -d

if ! docker-compose ps | grep android-builder | grep Up > /dev/null; then
  echo "Error: El contenedor no está corriendo." >&2
  docker-compose logs android-builder
  exit 1
fi

echo "Contenedor Docker iniciado y corriendo correctamente."
