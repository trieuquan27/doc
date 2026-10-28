# trieuquan.github.io

Danh mục các artifact trên tài khoản Claude, deploy bằng GitHub Actions lên GitHub Pages.

Web chỉ chứa tên + link về claude.ai, không chứa nội dung artifact.

## Thêm / sửa artifact

Sửa `artifacts.json` (mỗi mục gồm `title`, `url`, `updated`, `group`), commit và push lên `main`. Workflow `.github/workflows/deploy.yml` sẽ tự deploy.

## Xem thử ở máy

```sh
python3 -m http.server 8000
# mở http://localhost:8000
```
