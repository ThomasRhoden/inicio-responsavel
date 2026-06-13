from fastapi import FastAPI
from app.api.v1 import router as api_router

app = FastAPI(
    title="Início Responsável API",
    description="Backend da plataforma de orientação fiscal e profissional para cidadãos brasileiros.",
    version="0.1.0"
)

# app.include_router(usuarios.router,   prefix="/usuarios",   tags=["Usuários"])
# app.include_router(lembretes.router,  prefix="/lembretes",  tags=["Lembretes"])
# app.include_router(simulacoes.router, prefix="/simular",    tags=["Simulações"])

app.include_router(api_router)

@app.get("/", tags=["Saúde"])
def health_check():
    return {"status": "ok", "projeto": "Início Responsável API v0.1"}