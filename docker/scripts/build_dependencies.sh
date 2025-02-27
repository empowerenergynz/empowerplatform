#!/bin/sh

BUILD_DEPENDENCIES="
 curl-dev
 freetds-dev
 freetype-dev
 gettext-dev
 icu-dev
 imagemagick-dev
 jpeg-dev
 libjpeg-turbo-dev
 libpng-dev
 libwebp-dev
 libxml2-dev
 libzip-dev
 zlib-dev
 autoconf
 build-base
 oniguruma-dev
 linux-headers
 postgresql-libs
 postgresql-dev
"

# linux-headers: https://github.com/php/php-src/issues/8681

export BUILD_DEPENDENCIES
