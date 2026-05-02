#!/bin/bash
cd "$(dirname "$0")"

BORE=/tmp/bore
BORE_PORT=19918
CLOUDFLARED=/tmp/cloudflared

# Download bore if needed
if [ ! -f "$BORE" ]; then
  echo "📥 下载 bore..."
  curl -sL https://github.com/ekzhang/bore/releases/download/v0.5.2/bore-v0.5.2-x86_64-unknown-linux-musl.tar.gz -o /tmp/bore.tar.gz
  tar xzf /tmp/bore.tar.gz -C /tmp/ 2>/dev/null
  rm /tmp/bore.tar.gz
fi

# Download cloudflared if needed (backup)
if [ ! -f "$CLOUDFLARED" ]; then
  curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CLOUDFLARED"
  chmod +x "$CLOUDFLARED"
fi

# Kill any existing server on 8080
fuser -k 8080/tcp 2>/dev/null
sleep 1

echo "╔══════════════════════════════════════════════╗"
echo "║          🌸  oyz_blog  v2.0                 ║"
echo "║     2024-H 代码逐行注释  固定域名版          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Start HTTP server
python3 -m http.server 8080 --bind 0.0.0.0 &
SERVER_PID=$!
sleep 1
echo "✅ HTTP Server (PID: $SERVER_PID)"

# Start bore (primary - fixed port)
echo "🔗 启动固定域名隧道..."
"$BORE" local 8080 --to bore.pub --port "$BORE_PORT" 2>&1 | while read line; do
  if echo "$line" | grep -q "listening at"; then
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║  🌍 固定公网地址 (随便什么网都能访问)        ║"
    echo "║  http://bore.pub:$BORE_PORT                   ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""
    echo "📱 手机/平板/任何设备浏览器打开即可"
    echo "📍 只要这个终端不关, 地址永远不变"
    echo ""
    echo "按 Ctrl+C 停止"
  fi
done &
BORE_PID=$!

# Cleanup on exit
cleanup() {
  echo ""
  echo "🛑 停止服务..."
  kill $SERVER_PID $BORE_PID 2>/dev/null
  echo "已停止"
}
trap cleanup EXIT INT TERM

wait
