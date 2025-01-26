# Imagine de bază
FROM node:18

# Setează directorul de lucru în container
WORKDIR /atelier-server

# Copiază pachetele
COPY package*.json ./

# Instalează dependințele
RUN npm install

# Copiază codul aplicației
COPY . .

# Expune portul
EXPOSE 5000

# Pornirea serverului
CMD ["node", "app.js"]
