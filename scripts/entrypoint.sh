#!/bin/sh

/app/scripts/wait-for-it.sh db:5432 --timeout=0 --strict -- echo "db is up"

npm run kn:latest
echo "Migration done !"
npm run kn:seed
echo "Seed done !"

npm run dev