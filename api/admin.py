from http import HTTPStatus
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get('/admin')
@app.get('/admin/')
def admin_root():
    return JSONResponse({'detail': 'Admin is disabled in this deployment'}, status_code=HTTPStatus.NOT_IMPLEMENTED)
