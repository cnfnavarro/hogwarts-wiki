#!/bin/bash
# Abre la Hogwarts Wiki: arranca un servidor local en ESTA carpeta y la abre en el navegador.
# Uso: doble clic en este archivo. Para cerrar la wiki, cierra esta ventana de Terminal (o pulsa Ctrl+C).

cd "$(dirname "$0")" || exit 1

# Busca un puerto libre a partir del 5173
PUERTO=5173
while lsof -nP -iTCP:$PUERTO -sTCP:LISTEN >/dev/null 2>&1; do
  PUERTO=$((PUERTO + 1))
done

URL="http://localhost:$PUERTO"
echo "⚡ Hogwarts Wiki"
echo "   Carpeta: $(pwd)"
echo "   Dirección: $URL"
echo "   (Cierra esta ventana o pulsa Ctrl+C para detenerla)"
echo

(sleep 1 && open "$URL") &
exec python3 -m http.server "$PUERTO" --bind 127.0.0.1
