FROM denoland/deno:1.46.3

WORKDIR /app

# Copy app + templates
COPY api/ ./api/
COPY templates/ ./api/templates/

# Cache remote deps
RUN deno cache api/main.ts

EXPOSE 3700

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "api/main.ts"]
