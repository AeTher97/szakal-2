#!/bin/bash

export PGPASSWORD=postgres
psql -h localhost -p 5432 -U postgres -d szakal -c "drop schema public cascade;"
psql -h localhost -p 5432 -U postgres -d szakal -c "create schema public;"
psql -h localhost -p 5432 -U postgres -d szakal -f frontend/cypress/init.sql
