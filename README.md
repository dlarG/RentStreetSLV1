
```
RentStreetV1.0
├─ backend
│  ├─ .env
│  ├─ alembic
│  │  ├─ env.py
│  │  ├─ script.py.mako
│  │  ├─ versions
│  │  │  ├─ 549dd39f4266_initial_schema.py
│  │  │  └─ __pycache__
│  │  │     └─ 549dd39f4266_initial_schema.cpython-310.pyc
│  │  └─ __pycache__
│  │     └─ env.cpython-310.pyc
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ core
│  │  │  ├─ config.py
│  │  │  ├─ database.py
│  │  │  ├─ enums.py
│  │  │  └─ __pycache__
│  │  │     ├─ config.cpython-310.pyc
│  │  │     ├─ config.cpython-311.pyc
│  │  │     ├─ database.cpython-310.pyc
│  │  │     ├─ database.cpython-311.pyc
│  │  │     └─ enums.cpython-310.pyc
│  │  ├─ main.py
│  │  ├─ models
│  │  │  ├─ bookings.py
│  │  │  ├─ misc.py
│  │  │  ├─ ml.py
│  │  │  ├─ properties.py
│  │  │  ├─ subscriptions.py
│  │  │  ├─ trust.py
│  │  │  ├─ users.py
│  │  │  ├─ __init__.py
│  │  │  └─ __pycache__
│  │  │     ├─ bookings.cpython-310.pyc
│  │  │     ├─ misc.cpython-310.pyc
│  │  │     ├─ ml.cpython-310.pyc
│  │  │     ├─ properties.cpython-310.pyc
│  │  │     ├─ subscriptions.cpython-310.pyc
│  │  │     ├─ trust.cpython-310.pyc
│  │  │     ├─ users.cpython-310.pyc
│  │  │     └─ __init__.cpython-310.pyc
│  │  ├─ schemas
│  │  │  └─ user.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ main.cpython-310.pyc
│  │     ├─ main.cpython-311.pyc
│  │     ├─ __init__.cpython-310.pyc
│  │     └─ __init__.cpython-311.pyc
│  └─ requirements.txt
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
└─ README.md

```
```
RentStreetV1.0
├─ backend
│  ├─ .env
│  ├─ alembic
│  │  ├─ env.py
│  │  ├─ README
│  │  ├─ script.py.mako
│  │  ├─ versions
│  │  │  ├─ 09eab76e748a_add_login_lockout_tracking_to_users.py
│  │  │  ├─ 187f2640608f_initial_schema.py
│  │  │  └─ __pycache__
│  │  │     ├─ 09eab76e748a_add_login_lockout_tracking_to_users.cpython-310.pyc
│  │  │     └─ 187f2640608f_initial_schema.cpython-310.pyc
│  │  └─ __pycache__
│  │     └─ env.cpython-310.pyc
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ api
│  │  │  ├─ deps.py
│  │  │  └─ v1
│  │  │     └─ auth.py
│  │  ├─ core
│  │  │  ├─ config.py
│  │  │  ├─ database.py
│  │  │  ├─ enums.py
│  │  │  ├─ security.py
│  │  │  └─ __pycache__
│  │  │     ├─ config.cpython-310.pyc
│  │  │     ├─ config.cpython-311.pyc
│  │  │     ├─ database.cpython-310.pyc
│  │  │     ├─ database.cpython-311.pyc
│  │  │     ├─ enums.cpython-310.pyc
│  │  │     └─ security.cpython-310.pyc
│  │  ├─ main.py
│  │  ├─ models
│  │  │  ├─ bookings.py
│  │  │  ├─ misc.py
│  │  │  ├─ ml.py
│  │  │  ├─ properties.py
│  │  │  ├─ subscriptions.py
│  │  │  ├─ trust.py
│  │  │  ├─ users.py
│  │  │  ├─ __init__.py
│  │  │  └─ __pycache__
│  │  │     ├─ bookings.cpython-310.pyc
│  │  │     ├─ misc.cpython-310.pyc
│  │  │     ├─ ml.cpython-310.pyc
│  │  │     ├─ properties.cpython-310.pyc
│  │  │     ├─ subscriptions.cpython-310.pyc
│  │  │     ├─ trust.cpython-310.pyc
│  │  │     ├─ users.cpython-310.pyc
│  │  │     └─ __init__.cpython-310.pyc
│  │  ├─ schemas
│  │  │  ├─ auth.py
│  │  │  └─ user.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ main.cpython-310.pyc
│  │     ├─ main.cpython-311.pyc
│  │     ├─ __init__.cpython-310.pyc
│  │     └─ __init__.cpython-311.pyc
│  ├─ requirements.txt
│  └─ scripts
│     ├─ seed_users.py
│     └─ __pycache__
│        └─ seed_users.cpython-310.pyc
├─ frontend
│  ├─ .env
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ asset
│  │  │  ├─ hero
│  │  │  │  ├─ 1.jpg
│  │  │  │  ├─ 2.jpg
│  │  │  │  ├─ 3.jpg
│  │  │  │  └─ 4.jpg
│  │  │  └─ logo
│  │  │     ├─ 1.png
│  │  │     ├─ 2.png
│  │  │     ├─ 3.png
│  │  │     ├─ 4.png
│  │  │     ├─ 5-circled-modified.png
│  │  │     ├─ 5-circled.png
│  │  │     ├─ 5-logo-modified.png
│  │  │     ├─ 5-logo-modifiedv1.png
│  │  │     ├─ 5-logo.png
│  │  │     ├─ 5-modified.png
│  │  │     ├─ 5.png
│  │  │     ├─ 6-circled.png
│  │  │     ├─ 6.png
│  │  │     ├─ 7-circled.png
│  │  │     ├─ 7.png
│  │  │     ├─ 8-circled.png
│  │  │     └─ 8.png
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ asdas
│  │  │  ├─ layouts
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ Login.jsx
│  │  │  │  │  └─ Register.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ landing
│  │  │  │  │  ├─ ContactUs.jsx
│  │  │  │  │  ├─ FAQ.jsx
│  │  │  │  │  ├─ Hero.jsx
│  │  │  │  │  ├─ Pricing.jsx
│  │  │  │  │  └─ WhyUs.jsx
│  │  │  │  └─ Navbar.jsx
│  │  │  └─ pages
│  │  │     ├─ asdas
│  │  │     └─ LandingPage.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  └─ vite.config.js
├─ PROGRESS.md
└─ README.md

```