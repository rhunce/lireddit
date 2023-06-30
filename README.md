# Project: Raddit (A lightweight Reddit clone)

## About

![Raddit Project Screen Shot](images/screenshot.png)

This project is a fullstack application that is basically a lightweight version of Reddit.

Basic functionality includes registering, logging in and out, session storage, creating posts, liking/disliking posts, and editing and deleting your own posts.

## **Click [HERE](https://rhunce.com/) to see and use the application in production!**

## Future Roadmap

- [ ] Improve styling
- [ ] Add Dark Mode functionality
- [ ] Create Raddit Categories
  - [ ] Relate messages to Categories
- [ ] Implement message filtering
  - [ ] Filter by Categories
- [ ] Implement message sorting
- [ ] Implement message threads
- [ ] Implement User profile page
  - [ ] Allow user to upload avatar

## Project Architecture

[![Typescript]][Typescript-url]
[![React.js]][React-url]
[![Node.js]][Node-url]
[![GraphQL]][GraphQL-url]
[![PostgreSQL]][PostgreSQL-url]
[![Redis]][Redis-url]

- Frontend
  - Typescript
  - React
- Backend
  - Node.js
  - GraphQL API
  - PostgreSQL database
  - Redis memory store

## Deployment Architecture

[![Vercel]][Vercel-url]
[![DigitalOcean]][DIgitalOcean-url]
[![Docker]][Docker-url]

- Frontend deployed on Vercel
- Backend deployed on a DigitalOcean VPS (Virtual Private Server) using Dokku to manage application lifecycle
- Nginx sitting in front proxying requests to Node.js server
- Server architecture:
  - GraphQL API
  - PostgreSQL database (Docker containerized)
  - Redis memory store (Docker containerized)

## Other Technologies Used

Other resources used in this project:

- [TypeORM](https://typeorm.io/) - ORM for Node.js (and more)
- [TypeGraphQL](https://typegraphql.com/) - Framework for GraphQL API in Node.js
- [ExpressJS](https://expressjs.com/) - Web framework for Node.js API
- [Apollo Server](https://www.apollographql.com/) - GraphQL server that's compatible with any GraphQL client
- [node-argon2](https://www.npmjs.com/package/argon2) - NPM package to hash passwords
- [express-session](https://www.npmjs.com/package/express-session) - NPM package to create sessions
- [connect-redis](https://www.npmjs.com/package/connect-redis) - NPM package to create Redis sessions for Express
- [Chakra](https://chakra-ui.com/) - Component library for React applications
- [Formik](https://formik.org/) - React and React Native library for building Forms
- [URQL](https://formidable.com/open-source/urql/) - GraphQL client for React, Svelte, Vue, or plain JavaScript
- [Codegen](https://the-guild.dev/graphql/codegen/docs/guides/react-vue) - Provides an unified way to get TypeScript types from GraphQL operations
- [Nodemailer](https://nodemailer.com/about/) - Module for Node.js applications to allow easy email sending
- [dataloader](https://www.npmjs.com/package/dataloader) - NPM package for application's data fetching layer
- [dokku-postgres](https://github.com/dokku/dokku-postgres) - Official postgres plugin for dokku
- [dokku-redis](https://github.com/dokku/dokku-redis) - Official redis plugin for dokku
- [dokku-letsencrypt](https://github.com/dokku/dokku-letsencrypt) - Official plugin for dokku that gives the ability to automatically retrieve and install TLS certificates from letsencrypt.org

## Getting Started (Locally)

To get a local copy up and running, follow these steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- PostgreSQL installed and running in background
- Redis installed and running in background

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/rhunce/raddit.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file under the `web` directory and set the following environmental variables:

- NEXT_PUBLIC_API_URL
  - ex. NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

4. Create a `.env` file under the `server` directory and set the following environmental variables:

- DATABASE_URL
  - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lireddit2
- REDIS_URL
  - REDIS_URL=127.0.0.1:6379
- PORT
  - PORT=4000
- SESSION_SECRET
  - SESSION_SECRET=hvfxdhxchjkbouyfirtyuhkbl
  - This is just any random set of alphanumeric characters
- CORS_ORIGIN
  - CORS_ORIGIN=http://localhost:3000

4. In your terminal, from the `server` directory, run

```
$ npm run watch
```

5. In another terminal, from the `server` directory, run

```
$ npm run dev
```

6. In another terminal, from the `web` directory, run

```
$ npm run codegen
```

7. In the same terminal, from the `web` directory, run

```
$ npm run dev
```

Open up the project locally in your browser and start developing!

<!-- ROADMAP -->

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

[![MIT License][license-shield]][license-url]

## Contact

Raymond Hunce - hunce18c@gmail.com

GitHub Project Link: [https://github.com/rhunce/raddit](https://github.com/rhunce/raddit)

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- MARKDOWN LINKS & IMAGES -->

<!-- License -->

[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://opensource.org/license/mit/

<!-- LinkedIn -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/raymondhunce/

<!-- Next -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/

<!-- React -->

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

<!-- Vercel -->

[Vercel]: https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com

<!-- DigitalOcean -->

[DigitalOcean]: https://img.shields.io/badge/digitalocean-fff?style=for-the-badge&logo=digitalocean&logoColor=blue
[DIgitalOcean-url]: https://www.digitalocean.com/

<!-- Docker -->

[Docker]: https://img.shields.io/badge/docker-white?style=for-the-badge&logo=docker&logoColor=blue
[Docker-url]: https://www.docker.com/

<!-- TypeScript -->

[Typescript]: https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/

<!-- Node.js -->

[Node.js]: https://img.shields.io/badge/node.js-gray?style=for-the-badge&logo=nodedotjs&logoColor=339933
[Node-url]: https://nodejs.org/

<!-- GraphQL -->

[GraphQL]: https://img.shields.io/badge/graphql-18191A?style=for-the-badge&logo=graphql&logoColor=E10098
[GraphQL-url]: https://graphql.org/

<!-- PostgreSQL -->

[PostgreSQL]: https://img.shields.io/badge/postgresql-white?style=for-the-badge&logo=postgresql&logoColor=4169E1
[PostgreSQL-url]: https://www.postgresql.org/

<!-- Redis -->

[Redis]: https://img.shields.io/badge/redis-white?style=for-the-badge&logo=redis&logoColor=DC382D
[Redis-url]: https://redis.com/
