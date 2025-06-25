# 🎬 Cinezone – Portail local de consultation de films

## 📌 Présentation

Cinezone est un portail web local permettant de consulter un catalogue de films en s'appuyant sur l'API TMDB.  
Accessible uniquement sur un réseau local, il offre une interface fluide et responsive pour rechercher, filtrer et consulter des informations détaillées sur les films.  
Les utilisateurs peuvent également ajouter des films à leurs favoris grâce au stockage local du navigateur.

## 🚀 Fonctionnalités principales

- Recherche de films avec filtrage avancé (par titre, genre, etc.)
- Affichage des détails des films (résumé, note, date de sortie, etc.)
- Ajout de films en favoris via le `localStorage`
- Interface responsive (mobile & desktop)
- Déploiement local via Apache2 sur Debian

## 🛠️ Technologies utilisées

- HTML, CSS, JavaScript
- Visual Studio Code
- API : TMDB (The Movie Database)
- Apache2 (Debian dans VirtualBox)
- WinSCP pour le transfert

## 🗂️ Structure du projet

```

Cinezone/
├── index.html
├── catalogue.html
├── film.html
├── favoris.html
├── script.js
├── catalogue.js
├── film.js
├── favoris.js
├── img/
└── README.md

````

## ⚙️ Installation sur Debian (VM)

1. Installer Apache2 :

```bash
sudo apt update
sudo apt install apache2 -y
````

2. Créer le dossier du site :

```bash
sudo mkdir /var/www/cinezone
sudo chown -R www-data:www-data /var/www/cinezone
sudo chmod -R 755 /var/www/cinezone
```

3. Créer un fichier de configuration Apache :

```bash
sudo nano /etc/apache2/sites-available/cinezone.conf
```

**Contenu à insérer :**

```
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/cinezone
    ServerName cinezone.local
    <Directory /var/www/cinezone>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

4. Activer le site :

```bash
sudo a2ensite cinezone.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

5. Sur le poste client (dans le même réseau), modifier le fichier `/etc/hosts` :

```
192.168.X.X cinezone.local
```

## 📂 Transfert des fichiers avec WinSCP

1. Lancer WinSCP
2. Se connecter à la VM Debian avec :

   * Protocole : SFTP
   * Hôte : adresse IP de la VM
   * Port : 22
   * Identifiant : debian (ou root)
3. Glisser-déposer tous les fichiers du projet dans `/var/www/cinezone/`
4. Vérifier les droits si nécessaire :

```bash
sudo chown -R www-data:www-data /var/www/cinezone
sudo chmod -R 755 /var/www/cinezone
```

## 🔍 Accès au site

* [http://192.168.X.X](http://192.168.X.X)
* [http://cinezone.local](http://cinezone.local) *(si le fichier hosts est bien configuré)*

## 👤 Auteur

* **Nom** : Nedj
* **Formation** : BTS SIO – SISR
* **Année** : 2024–2025

