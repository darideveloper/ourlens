#!/bin/bash
# dev.sh — One-command dev environment for Ourlens
# Prerequisites: tmux, cloudflared
# Tmux keybindings:
#   Ctrl+b n  - Next window
#   Ctrl+b p  - Previous window
#   Ctrl+b d  - Detach (keep processes running)

PROJECT_NAME=$(basename "$PWD")
SESSION_NAME="${PROJECT_NAME}_dev"

if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "Session $SESSION_NAME already exists. Attaching..."
    tmux attach -t $SESSION_NAME
    exit 0
fi

command -v tmux >/dev/null 2>&1 || { echo "tmux is not installed. Please install it first."; exit 1; }
command -v cloudflared >/dev/null 2>&1 || { echo "cloudflared is not installed. Please install it first."; exit 1; }

PORT=4321

echo "Using port: $PORT"
echo "Access publicly: https://${PROJECT_NAME}.darideveloper.com"
echo ""
echo "Tmux keybindings:"
echo "  Ctrl+b n  - Next window"
echo "  Ctrl+b p  - Previous window"
echo "  Ctrl+b d  - Detach (keep processes running)"

tmux new-session -d -s $SESSION_NAME -n 'astro' -c "$PWD" \
    "bash -c 'pnpm astro dev --port $PORT; read'"

TUNNEL_CONFIG=$(mktemp /tmp/cloudflared-ourlens-XXXXXX.yml)
cat > $TUNNEL_CONFIG << EOF
tunnel: ourlens
credentials-file: /home/daridev/.cloudflared/47a39b37-7a64-4b5a-9cd1-51b39f6b1ae2.json
ingress:
  - hostname: ourlens.darideveloper.com
    service: http://localhost:$PORT
  - service: http_status:404
EOF

tmux new-window -t $SESSION_NAME -n 'tunnel' -c "$PWD" \
    "bash -c 'cloudflared tunnel --config $TUNNEL_CONFIG run ourlens; read'"

tmux select-window -t $SESSION_NAME:0
tmux attach -t $SESSION_NAME
