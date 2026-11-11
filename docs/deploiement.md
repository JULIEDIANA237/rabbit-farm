# Mettre RabbitFarm en ligne

Toute l'app est hébergée sur **Vercel**, en deux projets créés à partir du même dépôt GitHub :

| Partie | Hébergeur | Remarque |
| --- | --- | --- |
| API NestJS (`backend/`) | **Vercel** (offre gratuite *Hobby*) | Tourne en fonctions : pas de serveur qui s'endort. |
| Interface Next.js (`frontend/`) | **Vercel** (offre gratuite) | La plateforme faite pour Next.js. |
| Base de données | **Neon** (déjà en place) | Aucun changement. |
| Photos | **Supabase Storage** (déjà en place) | Aucun changement. |
| E-mails « mot de passe oublié » | **Resend** (offre gratuite) | Facultatif. |

Compte environ 30 minutes. Fais les étapes dans l'ordre : l'interface a besoin de l'adresse de l'API.

> ℹ️ Le fichier `render.yaml` reste dans le dépôt si tu préfères un jour héberger l'API sur Render, mais ce guide suit Vercel.

---

## Avant de commencer

Prépare ces valeurs. Elles se trouvent dans ton `backend/.env` actuel, sauf les nouvelles clés :

- `DATABASE_URL` : l'adresse Neon **avec** `-pooler`.
- `DATABASE_URL_UNPOOLED` : l'adresse Neon **sans** `-pooler`. Elle sert aux migrations.
- `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
- `JWT_SECRET` : une longue phrase aléatoire. Tu peux en générer une avec `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- **Une clé Gemini**, à créer sur <https://aistudio.google.com/apikey>.
- **Les clés des notifications** : dans le dossier `backend`, lance `npx web-push generate-vapid-keys`. Garde la *Public Key* et la *Private Key*.
- `CRON_SECRET` : une autre phrase aléatoire (16 caractères minimum), même commande que pour `JWT_SECRET`.
- *(Facultatif)* **Une clé Resend** sur <https://resend.com> → *API Keys*, pour envoyer les e-mails « mot de passe oublié ».

> 🔒 Ne colle jamais ces valeurs dans une discussion ni dans un fichier du dépôt. Elles vont uniquement dans les réglages de Vercel.

---

## 1. L'API sur Vercel

1. Sur <https://vercel.com>, clique sur **Add New → Project** et importe le dépôt `rabbit-farm`.
2. À côté de **Root Directory**, clique sur **Edit** et choisis `backend`. Vercel reconnaît NestJS tout seul.
3. Dans **Environment Variables**, ajoute :

   | Nom | Valeur |
   | --- | --- |
   | `DATABASE_URL` | adresse Neon avec `-pooler` |
   | `DATABASE_URL_UNPOOLED` | adresse Neon sans `-pooler` |
   | `JWT_SECRET` | ta phrase aléatoire |
   | `SUPABASE_URL` | ton URL Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | ta clé secrète Supabase |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | ta clé Gemini |
   | `VAPID_PUBLIC_KEY` | la *Public Key* générée |
   | `VAPID_PRIVATE_KEY` | la *Private Key* générée |
   | `VAPID_SUBJECT` | `mailto:` suivi de ton e-mail |
   | `CRON_SECRET` | ta deuxième phrase aléatoire |
   | `CORS_ORIGINS` | `http://localhost:3000` pour l'instant (corrigé à l'étape 3) |
   | `RESEND_API_KEY` | *(facultatif)* ta clé Resend |

4. Clique sur **Deploy**. Le script `vercel-build` applique les migrations sur Neon puis compile l'API (2 à 4 minutes).
5. Copie l'adresse du projet, par exemple `https://rabbitfarm-api.vercel.app`.
   Pour vérifier, ouvre-la dans le navigateur : tu dois voir `Hello World!`.

Le fichier `backend/vercel.json` déclare une **tâche planifiée** qui appelle `/cron/daily-reminders` chaque matin (entre 6 h et 7 h, heure du Cameroun) pour envoyer les rappels du jour. Rien à configurer de plus : Vercel l'active au premier déploiement.

## 2. L'interface sur Vercel

1. Encore **Add New → Project**, le même dépôt `rabbit-farm`, mais cette fois **Root Directory** = `frontend`.
2. Dans **Environment Variables**, ajoute (avec l'adresse de l'étape 1) :

   | Nom | Valeur |
   | --- | --- |
   | `NEXT_PUBLIC_GRAPHQL_URL` | `https://rabbitfarm-api.vercel.app/graphql` |
   | `NEXT_PUBLIC_API_URL` | `https://rabbitfarm-api.vercel.app` |

3. Clique sur **Deploy**. Au bout de 2 à 3 minutes, Vercel donne l'adresse de l'app, par exemple `https://rabbit-farm.vercel.app`.

## 3. Relier les deux

1. Retourne dans le projet de l'API → **Settings → Environment Variables**.
2. Remplace `CORS_ORIGINS` par l'adresse de l'interface, sans `/` à la fin, par exemple `https://rabbit-farm.vercel.app`. Plusieurs adresses : sépare-les par des virgules.
3. Ajoute `FRONTEND_URL` avec la même adresse : elle sert aux liens des e-mails « mot de passe oublié ».
4. Onglet **Deployments** → menu **⋯** du dernier déploiement → **Redeploy**, pour prendre en compte les nouvelles valeurs.
5. Ouvre l'adresse de l'interface et crée ton compte : l'app est en ligne. 🎉

---

## E-mails « mot de passe oublié »

- **Sans `RESEND_API_KEY`** : rien n'est envoyé. Le lien de réinitialisation est écrit dans les logs de l'API (Vercel → projet API → **Logs**). Pratique pour tester.
- **Avec la clé** : les e-mails partent depuis `onboarding@resend.dev`, qui n'envoie qu'à l'adresse de ton compte Resend. Pour écrire à tous les éleveurs, ajoute ton nom de domaine dans Resend (*Domains*), puis mets `MAIL_FROM="RabbitFarm <noreply@ton-domaine.com>"`.

## Rappels du jour (notifications)

Chaque utilisateur les active dans **Paramètres → Rappels du jour → Activer sur cet appareil**. Sur Android, ça marche dans Chrome. Sur iPhone, il faut d'abord installer l'app sur l'écran d'accueil (iOS 16.4 ou plus).

Pour déclencher un rappel à la main (test) :

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://rabbitfarm-api.vercel.app/cron/daily-reminders
```

## Changer de modèle d'IA

Les réglages se font dans les variables du projet de l'API :

- **Rester sur Gemini** (par défaut) : `AI_PROVIDER=google`, avec la clé `GOOGLE_GENERATIVE_AI_API_KEY`.
- **Passer à Claude** : `AI_PROVIDER=anthropic` et `ANTHROPIC_API_KEY`, une clé à créer sur <https://console.anthropic.com>.
- `AI_MODEL` (optionnel) : impose un modèle précis. Par défaut, c'est `gemini-flash-latest` ou `claude-haiku-5-5`.
- `AI_DAILY_LIMIT` (optionnel, 150 par défaut) : nombre maximum de demandes IA par ferme et par jour. Le compteur est enregistré en base. Ça plafonne le coût.
- `AI_FALLBACK_MODEL` (optionnel) : modèle essayé automatiquement quand le premier est saturé (erreur 429 ou 5xx). Par défaut `gemini-flash-lite-latest` avec Google, aucun avec Anthropic ; `none` désactive.
- `AI_TIMEOUT_MS` (optionnel, 45000 par défaut) : au-delà de ce délai, l'assistant abandonne et affiche un message clair.

Sans clé, l'app marche normalement et les boutons d'IA sont simplement masqués.

## Mises à jour et tests automatiques

- Chaque fusion sur `main` redéploie automatiquement les deux projets Vercel. Les nouvelles migrations sont appliquées pendant le déploiement de l'API.
- Chaque pull request lance les tests automatiques (onglet **Actions** sur GitHub) : tests de l'API sur une base PostgreSQL temporaire, puis vérification et compilation de l'interface. Fusionne seulement quand la coche est verte.

## Bon à savoir sur Vercel

- Les photos sont réduites dans le navigateur avant l'envoi (environ 1600 px) : elles passent sous la limite de 4,5 Mo des fonctions Vercel.
- La première requête après un moment sans visite prend 1 à 3 secondes, le temps que la fonction démarre.
- Sur l'offre gratuite, une tâche planifiée ne peut tourner qu'une fois par jour : c'est suffisant pour le rappel du matin.

## En cas de problème

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| « Failed to fetch » dans l'app | `CORS_ORIGINS` ne contient pas l'adresse de l'interface | Corrige la variable puis **Redeploy** l'API (étape 3). |
| Erreur P1001 ou P2028 dans les logs | Neon en veille ou adresse incorrecte | Vérifie `DATABASE_URL` et `DATABASE_URL_UNPOOLED`, puis **Redeploy**. |
| Le déploiement de l'API échoue sur `prisma migrate deploy` | `DATABASE_URL_UNPOOLED` absente ou fausse | Ajoute l'adresse Neon sans `-pooler`. |
| « L'assistant IA ne répond pas » | Clé Gemini absente ou invalide, ou quota dépassé | Vérifie la clé et ton quota sur aistudio.google.com. |
| Aucun e-mail reçu | Pas de `RESEND_API_KEY`, ou domaine non vérifié | Regarde le lien dans les logs, ou configure Resend (voir plus haut). |
| « Les notifications ne sont pas encore configurées » | Clés VAPID absentes | Ajoute `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` puis **Redeploy**. |
| Erreur 413 sur une photo | Photo très lourde dans un format non lisible (HEIC) | Choisis une photo JPG ou PNG. |
