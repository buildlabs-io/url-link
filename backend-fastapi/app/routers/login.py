import json
from urllib.parse import urlsplit

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from app.service.auth import Auth
from common.config import conf

router = APIRouter(prefix="/login", tags=["login"])


@router.get("/google_login")
async def google_login(request: Request):
    return Auth.google_login(request)


@router.get("/google_callback", response_class=HTMLResponse)
async def google_callback(request: Request):
    tok = await Auth.google_callback_issue_token(request)
    frontend_url = urlsplit(conf.FRONTEND_URL)
    frontend_origin = json.dumps(f"{frontend_url.scheme}://{frontend_url.netloc}")
    html = f"""<!doctype html><meta charset="utf-8" />
<script>
try {{
  window.opener && window.opener.postMessage({{ token: "{tok.token}" }}, {frontend_origin});
}} catch (e) {{}}
window.close();
</script>"""
    return HTMLResponse(html)
