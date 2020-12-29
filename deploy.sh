#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist


echo 'climat-energie-idf.fr' > CNAME
git init
git config user.name "SECV-PEE"
git config user.email "crcae.idf@gmail.com"
git remote add origin https://SECV-PEE:Tableaubord2020!@github.com/SECV-PEE/Tableau-de-bord-DRIEE.git
git add -A
git commit -m 'deploy'
git push -f https://github.com/SECV-PEE/Tableau-de-bord-DRIEE.git master:gh-pages

cd -
