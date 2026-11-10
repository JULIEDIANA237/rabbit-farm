# Mettre RabbitFarm en ligne

L'app est hébergée en deux parties :

| Partie | Hébergeur | Pourquoi |
| --- | --- | --- |
| API NestJS (`backend/`) | **Render** (offre gratuite) | Il lui faut un serveur qui tourne en continu (GraphQL, photos, connexion à Neon). |
| Interface Next.js (`frontend/`) | **Vercel** (offre gratuite) | C'est la plateforme faite pour Next.js. |
| Base de données | **Neon** (déjà en place) | Aucun changement. |
| Photos | **Supabase Storage** (déjà en place) | Aucun changement. |

Compte environ 20 minutes. Fais les étapes dans l'ordre : Vercel a besoin de l'adresse de l'API.

---

## Avant de commencer

Prépare ces valeurs. Elles se trouvent dans ton `backend/.env` actuel, sauf la clé Gemini :

- `DATABASE_URL` : l'adresse Neon **avec** `-pooler`.
- `DATABASE_URL_UNPOOLED` : l'adresse Neon **sans** `-pooler`. Elle sert aux migrations.
- `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
- **Une clé Gemini**, à créer sur <https://aistudio.google.com/apikey> (bouton *Create API key*). L'offre gratuite suffit pour démarrer.

> 🔒 Ne colle jamais ces valeurs dans une discussion ni dans un fichier du dépôt. Elles vont uniquement dans les réglages de Render et de Vercel.

---

## 1. L'API sur Render

1. Crée un compte sur <https://render.com> avec ton compte GitHub.
2. Clique sur **New → Blueprint**, choisis le dépôt `rabbit-farm`, puis **Connect**.
   Render lit le fichier `render.yaml` et prépare le service `rabbitfarm-api`.
3. Render te demande les valeurs marquées comme secrètes :
   - `DATABASE_URL`, `DATABASE_URL_UNPOOLED` : tes adresses Neon.
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` : tes valeurs Supabase.
   - `GOOGLE_GENERATIVE_AI_API_KEY` : ta clé Gemini.
   - `CORS_ORIGINS` : mets `http://localhost:3000` pour l'instant. Tu la corrigeras à l'étape 3.

   `JWT_SECRET` est généré automatiquement.
4. Clique sur **Apply**. Le premier déploiement prend 5 à 10 minutes. Il installe les dépendances, applique les migrations sur Neon, puis compile l'API.
5. Une fois le service *Live*, copie son adresse en haut de la page, par exemple `https://rabbitfarm-api.onrender.com`.
   Pour vérifier, ouvre cette adresse dans le navigateur : tu dois voir `Hello World!`.

> ℹ️ Sur l'offre gratuite, l'API s'endort après 15 minutes sans visite. La première requête suivante prend alors environ 1 minute, puis tout redevient rapide. L'offre *Starter* (≈ 7 $/mois) supprime cette mise en veille.

## 2. L'interface sur Vercel

1. Crée un compte sur <https://vercel.com> avec ton compte GitHub.
2. Clique sur **Add New → Project** et importe le dépôt `rabbit-farm`.
3. À côté de **Root Directory**, clique sur **Edit** et choisis `frontend`.
4. Dans **Environment Variables**, ajoute ces deux variables, en remplaçant par l'adresse Render de l'étape 1 :

   | Nom | Valeur |
   | --- | --- |
   | `NEXT_PUBLIC_GRAPHQL_URL` | `https://rabbitfarm-api.onrender.com/graphql` |
   | `NEXT_PUBLIC_API_URL` | `https://rabbitfarm-api.onrender.com` |

5. Clique sur **Deploy**. Au bout de 2 à 3 minutes, Vercel te donne l'adresse de l'app, par exemple `https://rabbit-farm.vercel.app`.

## 3. Relier les deux

1. Retourne sur Render, ouvre le service **rabbitfarm-api**, puis l'onglet **Environment**.
2. Remplace `CORS_ORIGINS` par l'adresse Vercel, sans `/` à la fin. Par exemple :
   `https://rabbit-farm.vercel.app`
   Si tu as plusieurs adresses, sépare-les par des virgules.
3. Clique sur **Save Changes**. Render redémarre l'API.
4. Ouvre l'adresse Vercel et crée ton compte : l'app est en ligne. 🎉

---

## Changer de modèle d'IA

Les réglages se font dans l'onglet **Environment** du service Render :

- **Rester sur Gemini** (par défaut) : `AI_PROVIDER=google`, avec la clé `GOOGLE_GENERATIVE_AI_API_KEY`.
- **Passer à Claude** : `AI_PROVIDER=anthropic` et `ANTHROPIC_API_KEY`, une clé à créer sur <https://console.anthropic.com>.
- `AI_MODEL` (optionnel) : impose un modèle précis. Par défaut, c'est `gemini-flash-latest` ou `claude-haiku-5-5`.
- `AI_DAILY_LIMIT` (optionnel, 150 par défaut) : nombre maximum de demandes IA par ferme et par jour. Ça plafonne le coût.
- `AI_FALLBACK_MODEL` (optionnel) : modèle essayé automatiquement quand le premier est saturé (erreur 429 ou 5xx). Par défaut `gemini-flash-lite-latest` avec Google, aucun avec Anthropic ; `none` désactive.
- `AI_TIMEOUT_MS` (optionnel, 45000 par défaut) : au-delà de ce délai, l'assistant abandonne et affiche un message clair au lieu de rester sur « réfléchit… ».

Sans clé, l'app marche normalement et les boutons d'IA sont simplement masqués.

## Mises à jour

Chaque fusion sur `main` redéploie automatiquement Render et Vercel. Les nouvelles migrations sont appliquées pendant le déploiement de Render.

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| « Failed to fetch » dans l'app | `CORS_ORIGINS` ne contient pas l'adresse Vercel | Corrige la variable dans Render (étape 3). |
| L'app met 1 minute à répondre le matin | L'API gratuite était en veille | C'est normal, ou passe à l'offre *Starter*. |
| Erreur P1001 ou P2028 dans les logs Render | Neon en veille ou adresse incorrecte | Vérifie `DATABASE_URL` et `DATABASE_URL_UNPOOLED`, puis redéploie (*Manual Deploy*). |
| « L'assistant IA ne répond pas » | Clé Gemini absente ou invalide, ou quota dépassé | Vérifie la clé dans Render et ton quota sur aistudio.google.com. |
| Le build Render échoue sur `bcrypt` | Compilation du module natif | Dans *Settings → Build Command*, ajoute `npm rebuild bcrypt &&` après `npm ci --include=dev &&`. |
