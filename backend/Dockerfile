FROM php:8.2-apache

# Installe les dépendances nécessaires pour PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copie ton code dans le dossier web
COPY . /var/www/html/

# Donne les bons droits
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
