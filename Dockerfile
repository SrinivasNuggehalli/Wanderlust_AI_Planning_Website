version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_GOOGLE_PLACE_API_KEY: /run/secrets/google_place_api_key
      VITE_GOOGLE_AUTH_CLIENT_ID: /run/secrets/google_auth_client_id
      VITE_GOOGLE_GEMINI_AI_API_KEY: /run/secrets/google_gemini_ai_api_key
    secrets:
      - google_place_api_key
      - google_auth_client_id
      - google_gemini_ai_api_key

secrets:
  google_place_api_key:
    external: true
  google_auth_client_id:
    external: true
  google_gemini_ai_api_key:
    external: true