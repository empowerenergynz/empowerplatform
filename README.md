# Empower Energy

https://empowerenergy.org.nz/
A project to manage charitable donations of electricity within New Zealand, facilitating residential
and community groups to donate their solar energy credits to people in financial hardship.

## New Developer Setup

1. Clone this repository
2. Copy the example environment file with `cp .env.example .env`
3. (optional) Update `APP_HOST` in .env to a different domain
4. Install frontend dependencies with `npm install --legacy-peer-deps` (Use the Node version in `.nvmrc`)
5. Install [Docker](https://www.docker.com/products/docker-desktop/) containers with `docker compose pull && docker compose up -d`
6. Install backend dependencies with `docker compose exec php composer install`
7. Set the app key with `docker compose exec php php artisan key:generate`
8. Install husky hooks with `npx husky install`
9. Build frontend assets with `npm run watch`
10. Seed the database with new data `npm run data:fresh-seed` (will clear any existing data)
11. Visit [the site](https://localhost/)
12. Login with super-admin@empower.local and password 'password' (see [other logins](database/seeders/UserSeeder.php))

## Linting and formatting

- PHP: `npm run ecs:fix`
- TS: `npm run eslint:fix` and `npm run prettier:fix`

Linting and formatting is performed automatically on commit. This means the docker containers must be running to commit code.  To bypass use `git commit --no-verify`

## Running Tests

- PHP: `npm run phpunit`
- Jest: `npx jest`
- Cypress `npx cypress open` (or `npx cypress run` to run headless). Ensure database is seeded and frontend build is up to date (`npm run test:e2e` will do this for you)

All tests will be run on `git push`.  To bypass use `git push --no-verify`.

## SQLite

Optionally, this repo can use SQLite as a lighter-weight alternative to Postgres.  To do so, edit the `.env` file, eg
```
DB_CONNECTION=sqlite
DB_DATABASE=/app/storage/app/database.sqlite
```

## 3rd Party APIs

- [Search](docs/search.md) (Algolia)
- Address autocomplete (Google Places)
  - Create API key at https://console.cloud.google.com/project/_/google/maps-apis/credentials
  - Set `MIX_GOOGLEPLACES_API_KEY` in .env
- Error tracking (Sentry)
  - Create API key at https://docs.sentry.io/api/guides/create-auth-token/#create-a-api-authentication-token
  - Set `SENTRY_LARAVEL_DSN` in .env

## AWS Hosting

* Create a GitHub webhook for AWS CodePipeline builds
* Create a new Personal App Token through https://github.com/settings/tokens with permissions for `admin_repo` (to create webhooks) and `public_repo` (to grab the source)
* Create a new SecretsManager secret through https://ap-southeast-2.console.aws.amazon.com/secretsmanager/newsecret?region=ap-southeast-2 ("Other type of secret") called `GitHubSecret` and add a new value with "Secret key" of `token` and "Secret value" of the PAT from above `ghp_...`
* Create a new Parameter Store param called `/empower-energy/{env}/.env` (replacing `{env}` with the test/prod environment) name, and add the contents of a freshly generated `.env` file as the value https://ap-southeast-2.console.aws.amazon.com/systems-manager/parameters/aws/create?region=ap-southeast-2
* Manually create an SES email identity https://ap-southeast-2.console.aws.amazon.com/ses/home
* Install the CloudFormation scripts in numerical order in `infra/cloud-formation`
    * Make sure the 'Build' stage in [CodePipeline](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines) finishes before deploying ECS
* After the ECS script is installed, open CodePipeline and enable the Deploy stage (click the lock icon between the Build and Deploy stages)
    * It is normal for the ECS CloudFormation stack to show in a pending state
* Create a DNS record CNAME to point to the ECS [load balancer](https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#LoadBalancers:)
