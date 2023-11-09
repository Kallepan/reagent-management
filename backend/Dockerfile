FROM python:3.10.12-alpine

# necessary for entrypoint.sh and psycopg
RUN apk add --no-cache bash build-base

RUN adduser -D app
RUN mkdir -p /home/app/web
WORKDIR /home/app/web

COPY requirements.txt .

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    python3 -m pip install --no-cache -r requirements.txt && \
    apk --purge del .build-deps

COPY src/ .
COPY entrypoint.sh .
RUN chown -R app:app . && chmod 775 entrypoint.sh

USER app

ENTRYPOINT ["/home/app/web/entrypoint.sh"]
