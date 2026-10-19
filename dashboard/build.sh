#!/bin/sh
# Builds dashboard/index.html, the page published as the Portfolio Desk artifact, from src/.
set -e
cd "$(dirname "$0")/src"
{
  cat head.html base.css extra.css body.html
  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>'
  cat core.js p1.js p2.js p3.js p4.js
} > ../index.html
echo "built $(wc -c < ../index.html) bytes"
