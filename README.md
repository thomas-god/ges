[![Netlify Status](https://api.netlify.com/api/v1/badges/5b6c70cb-dbbb-4a9f-b537-d2eb16a7a7ea/deploy-status)](https://app.netlify.com/sites/jovial-allen-d47faf/deploys) ![combiendecarbone.fr CI](https://github.com/thomas-god/combiendecarbone/workflows/combiendecarbone.fr%20CI/badge.svg)

# combiendecarbone.fr

<!--
1 - Présenter succinctement le projet (raison d'être, philosophie)
2 - Présenter comment le lancer en local (besoin d'une clé API GMaps)
3 - Présenter comment contribuer via les issues
 -->

combiendecarbone.fr est un calculateur d'impact carbone pour les particuliers désirant réduire leurs émissions de gaz à effet de serre mais ne sachant pas par où commencer.

## Rapporter un bug ou faire une demande de nouvelle fonctionnalité

Vous pouvez [rapporter un bug](https://github.com/thomas-god/combiendecarbone/issues/new?assignees=&labels=bug&template=rapport-de-bug.md&title=) ou [demander une nouvelle fonctionnalité](https://github.com/thomas-god/combiendecarbone/issues/new?assignees=&labels=&template=demande-de-nouvelle-fonctionnalit-.md&title=) directement via les _issues_ GitHub.

## Contribuer au projet

```shell
$ npm install # Installer les dépendances
$ npm run serve # Lancer le serveur de développement sur le port 8000
$ npm run test:unit # Lancer la suite de tests
$ npm run build # Compiler le projet
```

### API Google Maps

Pour pouvoir utiliser l'[API Google Maps](https://developers.google.com/maps/documentation) pour les transports (autocomplétion des lieux et calculs des distances), il faut disposer d'une clé API autorisant les API suivantes : Directions API, Maps JavaScript API, Places API, et Geocoding API.

La clé API doit ensuite être renseignée comme variable d'environnement dans un fichier `.env` placé à la racine du projet (voir le fichier d'example `.env.example`).
