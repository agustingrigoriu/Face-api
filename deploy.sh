echo "Actualizo BD aplicando update.sql"
psql -U postgres -h 127.0.0.1 -p 5511 smartmonitor < db/update.sql
