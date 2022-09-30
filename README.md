**Main Features:**
-

## Prerequisites
- [Node 12.0.0+](https://nodejs.org/en/download/)

--

## Set the environment variables
The application settings are difened by environment variables. To define the settings, make a copy of the `.env.
example` file, naming for `.env`. After thar, open the file and edit the settings as needed.

| VARIABLE | DESCRIPTION | DEFAULT |
| ----- | ----- | ----- |
| `PORT` | Port used to listen for HTTP request | `5000` |
| `APP_URL` | Check  | `https://example.com` |
| `CLIEN_ID` | Id used to handle with the google actions(login, store, email sending) | `999999.apps.googleusercontent.com` |
| `CLIENT_SECRET` | Key user to handle with the google actions(login, store, email sending | `999999-9999` |
| `DB_URL` | Url used to access the db | `http://localhost:5001` |
| `EMAIL` | Email used to handle the email service(invitation, password recover, contact)  | `example@example.com` |
| `PASSWORD` | Password used to handle the email service(invitation, password recover, contact) | `999999999` |
| `REFRESH_TOKEN` | Refresh token used to handle with the google actions(login, store, email sending) | `9//99999999999999` |
| `SECRET_KEY` | Secret key used to handle with the google actions(login, store, email sending) | `s3cr37k3y` |
| `USER_PASSWORD` | Password used to handle with the google actions(login, store, email sending) | `99999999` |
| `BUCKET` | Link used to access the storage bucket(used to save images, still in test) | `example.appspot.com` |

## Instalation and execution
#### 1. Install dependencies
```sh
npm i or npm install
```

#### 2. Build
Build the project. The build artifacts will be stored in the `build` directory.  
```sh
npm run build
```

#### 3. Run server in Development mode
```sh
npm run dev
```
