from fastapi import APIRouter

from . import calculadoras, lembretes, usuarios, gamificacao

# Router principal que agrupa os sub-rotas da API versão 1.
router = APIRouter()
router.include_router(usuarios.router, prefix="/usuarios", tags=["Usuários"])
router.include_router(lembretes.router, prefix="/lembretes", tags=["Lembretes"])
router.include_router(calculadoras.router, prefix="/simular", tags=["Simulações"])
router.include_router(gamificacao.router, prefix="/gamificacao", tags=["Gamificação"])
