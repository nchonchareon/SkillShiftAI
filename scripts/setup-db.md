# PostgreSQL + pgvector Setup Guide (Windows)

## Prerequisites

- Windows 10/11
- Administrator access

---

## Step 1: Install PostgreSQL 17

1. Download PostgreSQL 17 from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer (`postgresql-17.x.x-windows-x64.exe`)
3. During setup:
   - Set password to `postgres` (or update `.env.example` accordingly)
   - Keep default port `5432`
   - Select locale as default
4. Complete the installation

Verify installation:
```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT version();"
```

---

## Step 2: Install pgvector Extension

### Option A: Using Stack Builder (recommended)
1. Open **Stack Builder** from Start Menu
2. Select your PostgreSQL 17 installation
3. Expand "Categories > Extensions"
4. Check **pgvector** extension
5. Download and install

### Option B: Manual install
1. Download pgvector for Windows from [https://github.com/pgvector/pgvector/releases](https://github.com/pgvector/pgvector/releases)
2. Copy the files to your PostgreSQL installation directory:
   ```
   C:\Program Files\PostgreSQL\17\share\extension\
   C:\Program Files\PostgreSQL\17\lib\
   ```

### Enable the extension
```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

---

## Step 3: Create the Database

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE skillshiftai;"
```

---

## Step 4: Configure Environment

Copy `.env.example` to `.env.local` and verify the connection string:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillshiftai?schema=public"
```

Adjust username/password if you set different values during PostgreSQL installation.

---

## Step 5: Run Prisma Migrate

From the project root:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

---

## Step 6: Create pgvector Index

After `prisma db push` creates the tables:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d skillshiftai -c "CREATE EXTENSION IF NOT EXISTS vector;"

& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d skillshiftai -c "CREATE INDEX idx_master_skills_embedding ON master_skills USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);"
```

---

## Step 7: Seed the Database

```bash
npx prisma db seed
```

### Alternative: Seed via SQL

If you prefer raw SQL or the Prisma seed fails:

```bash
npx ts-node prisma/seed-sql.ts > prisma/seed.sql
```

Then run the generated SQL:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d skillshiftai -f prisma/seed.sql
```

---

## Step 8: Verify

```bash
npx prisma studio
```

This opens a browser UI to inspect all tables and data.

---

## Troubleshooting

### Connection refused
- Ensure PostgreSQL service is running: check Services app (`services.msc`)
- Verify port 5432 is not blocked by firewall

### pgvector extension not found
- Ensure pgvector is installed in the correct extension directory
- Restart PostgreSQL service after installing pgvector

### Permission denied
- Ensure the `postgres` user has correct password
- Try: `& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost`

### Seed fails with duplicate key errors
- Tables already have data. Drop and recreate:
  ```powershell
  & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "DROP DATABASE skillshiftai;"
  & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE skillshiftai;"
  ```
- Then repeat Steps 5-7
