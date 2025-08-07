# Utilise une image PHP avec Apache
FROM php:8.2-apache

# Active les extensions nécessaires
RUN docker-php-ext-install pdo pdo_pgsql

# Copie ton code dans le dossier web
COPY . /var/www/html/

# Donne les bons droits
RUN chown -R www-data:www-data /var/www/html

# Expose le port 80
EXPOSE 80
