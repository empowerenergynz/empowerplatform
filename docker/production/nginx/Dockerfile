FROM public.ecr.aws/nginx/nginx:stable-alpine-slim

WORKDIR /app

COPY ./docker/production/nginx/templates /etc/nginx/templates
COPY ./docker/production/nginx/ssl /etc/ssl
COPY ./public /app/public
