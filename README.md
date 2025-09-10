# PokéTask App 

## Prérequis

### 1. Node.js
- **Version requise** : Node.js 18.x ou supérieur
- **Installation** :
    - Téléchargez depuis [nodejs.org](https://nodejs.org/)
    - Ou utilisez un gestionnaire de versions comme `nvm` :
      ```bash
      # Installation de nvm (Linux/Mac)
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
      
      # Installation de Node.js 18
      nvm install 18
      nvm use 18
      ```

### 2. npm ou yarn
- **npm** : Inclus avec Node.js
- **yarn** (optionnel) :
  ```bash
  npm install -g yarn
  ```

### 3. Expo CLI
```bash
npm install -g @expo/cli
```

### 5. Backend API
- Un serveur backend doit être en cours d'exécution
- L'API doit être accessible via l'URL configurée dans les variables d'environnement

## ��️ Installation

### 1. Cloner le repository
```bash
git clone <url-du-repository>
cd poketask-app
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_API_URL={IP}:3000/api
```

Remplacez l'IP de cette manière

```bash
#MACOS
ipconfig getifaddr en0
#LINUX
hostname -I | awk '{print $1}'
# ou
ip addr show | grep "inet " | grep -v 127.0.0.1
#WINDOWS (Powershell)
Get-NetIPAddress -AddressFamily IPv4 | Select-Object IPAddress
```

### 4. Démarrer l'application

Il est nécessaire de posséder l'application Expo Go, elle est gratuite et disponible sur les stores

```bash
expo start
```