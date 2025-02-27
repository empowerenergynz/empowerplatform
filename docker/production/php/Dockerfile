### --- BEGIN /docker/production/php/Dockerfile
FROM php:8.2-fpm-alpine3.21

ENV PHP_OPCACHE_ENABLE ${PHP_OPCACHE_ENABLE:-1} \
    PHP_OPCACHE_ENABLE_CLI ${PHP_OPCACHE_ENABLE_CLI:-1} \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS ${PHP_OPCACHE_VALIDATE_TIMESTAMPS:-0} \
    PHP_OPCACHE_MAX_ACCELERATED_FILES ${PHP_OPCACHE_MAX_ACCELERATED_FILES:-10000} \
    PHP_OPCACHE_MEMORY_CONSUMPTION ${PHP_OPCACHE_MEMORY_CONSUMPTION:-192} \
    PHP_OPCACHE_MAX_WASTED_PERCENTAGE ${PHP_OPCACHE_MAX_WASTED_PERCENTAGE:-10} \
    PHP_OPCACHE_JIT ${PHP_OPCACHE_JIT:-tracing} \
    PHP_OPCACHE_JIT_BUFFER_SIZE ${PHP_OPCACHE_JIT_BUFFER_SIZE:-100M}

COPY ./docker/config /tmp/config
COPY ./docker/scripts /tmp/scripts

# Install system packages
RUN source /tmp/scripts/build_dependencies.sh && \
    apk update && \
    apk upgrade && \
    apk add --no-cache \
        bash \
        freetds \
        freetype \
        icu \
        imagemagick \
        libintl \
        libldap \
        libjpeg \
        libjpeg-turbo \
        libpng \
        libpq \
        libwebp \
        libzip \
        libgomp \
        composer \
        poppler-utils \
        ca-certificates && \
    apk add --no-cache --virtual build-dependencies ${BUILD_DEPENDENCIES} && \
# Install PHP extensions
    /tmp/scripts/configure_gd.sh && \
    docker-php-ext-install -j$(getconf _NPROCESSORS_ONLN) gd && \
# Install pecl
    pecl install \
      redis && \
    docker-php-ext-configure pdo_dblib --with-libdir=lib/ && \
    docker-php-ext-install \
        bcmath \
        curl \
        dom \
        gettext \
        exif \
        intl \
        mbstring \
        pdo_mysql \
        session \
        soap \
        sockets \
        zip \
        pcntl \
        pgsql \
        pdo_pgsql \
        opcache && \
# Compile and Install Imagick
    /tmp/scripts/install_imagick.sh && \
    docker-php-ext-enable \
    redis && \
# Delete build dependencies
    apk del build-dependencies
# Update composer script to use PHP version
RUN printf "#!/bin/sh\n\n/usr/local/bin/php /usr/bin/composer.phar \"\$@\"\n" \
		> /usr/bin/composer
# Download trusted certs
RUN mkdir -p /etc/ssl/certs && update-ca-certificates && \
# Copy php configuration
    cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    cat /tmp/config/php/conf.d/docker-php-ext-opcache.ini >> "$PHP_INI_DIR/conf.d/docker-php-ext-opcache.ini" && \
    cp /tmp/config/entrypoint.sh /entrypoint.sh && \
    cp /tmp/config/php-fpm/zz-www-overrides.conf /usr/local/etc/php-fpm.d/zz-www-overrides.conf && \
    rm -rf /tmp/config && \
    rm -rf /tmp/scripts && \
    chmod a+x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

WORKDIR /app

COPY --chown=www-data:www-data ./ /app

# Copy php configuration
RUN cp /app/docker/production/php/config/php.ini /usr/local/etc/php/php.ini && \
# Tidy up
    cp /app/docker/production/php/entrypoint.sh /entrypoint.sh && \
    cp /app/docker/production/php/ecs-start.sh /app/ecs-start.sh && \
    chmod +x /entrypoint.sh && \
    chmod +x /app/ecs-start.sh && \
    rm -rf /app/docker

# Change user to www-data to create folder and cache configs
USER www-data

RUN mkdir -p /app/storage/framework/cache/data
# change back user to root
USER root

CMD ["php-fpm"]
