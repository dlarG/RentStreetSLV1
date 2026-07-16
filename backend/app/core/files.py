import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status

UPLOAD_ROOT = Path("app/static/uploads")
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
MAX_FILE_SIZE_MB = 5


async def save_upload(file: UploadFile, subfolder: str, allowed_types: set[str]) -> str:
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{file.filename}' must be a PDF, JPG, or PNG file.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{file.filename}' is larger than {MAX_FILE_SIZE_MB}MB.",
        )

    folder = UPLOAD_ROOT / subfolder
    folder.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix
    unique_name = f"{uuid.uuid4()}{ext}"
    dest = folder / unique_name

    with open(dest, "wb") as f:
        f.write(contents)

    return f"/static/uploads/{subfolder}/{unique_name}"