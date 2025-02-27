FROM postgres:15

COPY ./docker/postgres/init-db.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh 