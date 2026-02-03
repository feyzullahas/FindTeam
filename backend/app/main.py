from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth_routes import router as auth_router
from app.users.user_routes import router as user_router
from app.posts.post_routes import router as post_router

app = FastAPI(title="FindTeam API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for simplicity in deployment (or configure specific domains)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Trust proxy headers (Critical for Render/Heroku HTTPS)
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

# Include routers
app.include_router(auth_router, tags=["auth"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(post_router, prefix="/posts", tags=["posts"])

@app.get("/")
def root():
    return {"status": "API çalışıyor"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)