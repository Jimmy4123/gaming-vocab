#!/usr/bin/env bash
set -euo pipefail

# rotate-key.sh
# Helper script to store a new GEMINI_API_KEY locally and show commands to set it in Vercel.
# WARNING: This script writes a local .env.local file for development use. Do NOT commit real keys.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.local"

function usage() {
  cat <<EOF
Usage: $0 [NEW_KEY]

If NEW_KEY is provided as an argument it will be written to ${ENV_FILE} (overwriting any existing file).
If no argument is provided, you'll be prompted to paste the new key securely.

After creating the local file the script prints recommended commands to set the key in Vercel
and a checklist to rotate/revoke the old key.

Note: This script does not talk to external services. To set the value in Vercel you'll need the Vercel CLI
or the Vercel web UI.
EOF
}

NEW_KEY=""
if [[ ${1:-} == "--help" || ${1:-} == "-h" ]]; then
  usage
  exit 0
fi

if [[ ${#} -ge 1 ]]; then
  NEW_KEY="$1"
else
  read -rs -p "Paste new GEMINI_API_KEY (input hidden): " NEW_KEY
  echo
fi

if [[ -z "$NEW_KEY" ]]; then
  echo "No key provided. Aborting." >&2
  exit 1
fi

echo "Writing local env file to: $ENV_FILE"
cat > "$ENV_FILE" <<EOL
# Local environment variables (do NOT commit)
GEMINI_API_KEY="$NEW_KEY"
EOL

echo "\nDONE. .env.local created. Do NOT commit this file."

echo "\nNext recommended steps:\n"
echo "1) Rotate/revoke the old key in Google Cloud Console (IAM & Admin / APis & Services → Credentials)."
echo "   - Create a NEW API key for Gemini and restrict it to the needed API and HTTP referrers / IPs."

echo "2) Add the new key to Vercel (recommended for production):"
echo "   - Using the web UI: Project → Settings → Environment Variables → Add 'GEMINI_API_KEY' (production/staging)."
echo "   - Or using the Vercel CLI (if you are logged in):"
echo "\n     # example (you will be prompted to paste the value):"
echo "     vercel env add GEMINI_API_KEY production"
echo "\n   If you prefer to set the value non-interactively (careful with shell history):"
echo "\n     # Example using --token and piping the value (adjust to your CLI version):"
echo "     printf '%s' \"$NEW_KEY\" | vercel env add GEMINI_API_KEY production --confirm"

echo "\n3) Trigger a new deploy in Vercel (push a commit or redeploy from the Vercel dashboard)."
echo "\n4) After successful deploy, revoke the old key in Google Cloud Console."

echo "\nOptional: Add .env.local to your .gitignore if not already present."
echo "If you'd like, I can create a .env.example file and add .env.local to .gitignore for you."

exit 0
