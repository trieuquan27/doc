# doc

Danh mục các artifact trên tài khoản Claude: https://trieu-docs.pages.dev

Chạy trên Cloudflare Pages (miễn phí). Dữ liệu nằm trong database Cloudflare D1 `trieu-docs`, sửa trực tiếp trên web bằng nút ✏️ Sửa (cần mật khẩu, lưu trong secret `EDIT_PASSWORD`).

- `public/`: giao diện web
- `functions/api/artifacts.js`: API đọc (`GET`) và lưu (`PUT`, cần mật khẩu) danh mục
- `schema.sql`, `seed.sql`: cấu trúc bảng và dữ liệu ban đầu
- `redirect/`: trang trên GitHub Pages tự chuyển sang link Cloudflare

## Deploy lại sau khi sửa code

Wrangler cần Node 22+:

```sh
npx -y -p node@22 -p wrangler@4 -- wrangler pages deploy --project-name trieu-docs --branch main
```

## Đổi mật khẩu sửa

```sh
npx -y -p node@22 -p wrangler@4 -- wrangler pages secret put EDIT_PASSWORD --project-name trieu-docs
```

## Chạy thử ở máy

```sh
echo 'EDIT_PASSWORD=test123' > .dev.vars
npx -y -p node@22 -p wrangler@4 -- wrangler d1 execute trieu-docs --local --file schema.sql
npx -y -p node@22 -p wrangler@4 -- wrangler d1 execute trieu-docs --local --file seed.sql
npx -y -p node@22 -p wrangler@4 -- wrangler pages dev public
```
