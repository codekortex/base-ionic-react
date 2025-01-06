#! /bin/bash

set -e

if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Error: docker-compose no está instalado." >&2
  exit 1
fi

if ! docker-compose ps | grep android-builder | grep Up > /dev/null; then
  echo "Error: El contenedor no está corriendo. Ejecuta primero start-container.sh." >&2
  exit 1
fi

echo "Verificando que el contenedor esté listo..."
for i in {1..30}; do
  if docker-compose exec android-builder bash -c "exit" 2>/dev/null; then
    echo "Contenedor está listo."
    break
  fi
  echo "Esperando... ($i/30)"
  sleep 1
done

if ! docker-compose ps | grep android-builder | grep Up > /dev/null; then
  echo "Error: El contenedor no está corriendo." >&2
  docker-compose logs android-builder
  exit 1
fi

echo "Ejecutando comandos de compilación dentro del contenedor..."
docker-compose exec android-builder bash -c "
  set -e
  ionic build &&
  ionic cap sync android &&
  cd android &&
  ./gradlew assembleRelease
"

if [ $? -ne 0 ]; then
  echo "Error: La compilación falló." >&2
  docker-compose logs android-builder
  exit 1
fi

echo "Compilación completada exitosamente."
echo "El APK se encuentra en android/app/build/outputs/apk/release/"
