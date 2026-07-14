from http import HTTPStatus
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/api/health')
def health():
    return JSONResponse({'status': 'ok'}, status_code=HTTPStatus.OK)
