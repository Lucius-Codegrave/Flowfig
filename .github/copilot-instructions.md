# Instructions Copilot pour le projet Flowfig

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexte du projet
Ce projet **Flowfig** est une API REST de gestion de tâches avec les fonctionnalités suivantes :
- **Node.js + Express.js** avec TypeScript
- **PostgreSQL** avec Prisma ORM
- **Authentification JWT** avec bcrypt
- **Tests Jest** complets avec mocks
- **Validation Zod** et middlewares sécurisés
- **Architecture Clean** (Controllers → Services → Database)
- **pnpm** comme gestionnaire de packages

## Instructions spécifiques
- Utiliser le pattern **Given-When-Then** pour tous les tests
- Privilégier les **commentaires JSDoc** détaillés en anglais
- Respecter l'**isolation utilisateur** (users only access their own data)
- Utiliser **TypeScript strict** avec interfaces explicites
- Suivre les **conventions de sécurité** (JWT, bcrypt, validation)
- Écrire **tout le code en anglais** (variables, fonctions, commentaires)
- Implémenter la **gestion d'erreurs centralisée** avec AppError
- Mocker **Prisma, bcrypt, jsonwebtoken** dans les tests

## Structure recommandée
- Controllers dans `src/controllers/` (HTTP handling)
- Services dans `src/services/` (Business logic)
- Middlewares dans `src/middlewares/` (Auth, validation, errors)
- Routes dans `src/routes/` (Route definitions)
- Validators dans `src/validators/` (Zod schemas)
- Tests avec suffix `.test.ts` à côté des fichiers source

## Commandes disponibles
- `pnpm dev` : Développement avec hot-reload
- `pnpm build` : Build TypeScript de production
- `pnpm test` : Tests Jest avec coverage
- `pnpm test:watch` : Tests en mode watch
- `pnpm lint` : ESLint + markdown lint
- `pnpm db:push` : Synchroniser base de données
