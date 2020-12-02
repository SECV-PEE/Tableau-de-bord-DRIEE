#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist


echo 'climat-energie-idf.fr' > CNAME
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:bounim/Tableau-de-bord-DRIEE.git master:gh-pages

cd -
