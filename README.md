```
RentStreetV1.0
├─ backend
│  ├─ .env
│  ├─ alembic
│  │  ├─ env.py
│  │  ├─ README
│  │  ├─ script.py.mako
│  │  ├─ versions
│  │  │  ├─ 187f2640608f_initial_schema.py
│  │  │  ├─ 26b305738b4a_move_approval_workflow_to_landlord_.py
│  │  │  ├─ bf5af67fac32_add_approval_workflow_to_users.py
│  │  │  ├─ d0fc76636256_add_registration_image_to_boarding_.py
│  │  │  ├─ ef4674cc6a7a_add_renter_id_upload_registration_ip_.py
│  │  │  └─ __pycache__
│  │  │     ├─ 09eab76e748a_add_login_lockout_tracking_to_users.cpython-310.pyc
│  │  │     ├─ 187f2640608f_initial_schema.cpython-310.pyc
│  │  │     ├─ 26b305738b4a_move_approval_workflow_to_landlord_.cpython-310.pyc
│  │  │     ├─ 280c07502e71_add_login_lockout_tracking_to_users.cpython-310.pyc
│  │  │     ├─ 293d92aae38b_test_should_be_empty.cpython-310.pyc
│  │  │     ├─ bf5af67fac32_add_approval_workflow_to_users.cpython-310.pyc
│  │  │     ├─ d0fc76636256_add_registration_image_to_boarding_.cpython-310.pyc
│  │  │     └─ ef4674cc6a7a_add_renter_id_upload_registration_ip_.cpython-310.pyc
│  │  └─ __pycache__
│  │     └─ env.cpython-310.pyc
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ api
│  │  │  ├─ deps.py
│  │  │  ├─ v1
│  │  │  │  ├─ admin.py
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ landlord.py
│  │  │  │  ├─ __init__.py
│  │  │  │  └─ __pycache__
│  │  │  │     ├─ admin.cpython-310.pyc
│  │  │  │     ├─ auth.cpython-310.pyc
│  │  │  │     ├─ landlord.cpython-310.pyc
│  │  │  │     └─ __init__.cpython-310.pyc
│  │  │  ├─ __init__.py
│  │  │  └─ __pycache__
│  │  │     ├─ deps.cpython-310.pyc
│  │  │     └─ __init__.cpython-310.pyc
│  │  ├─ core
│  │  │  ├─ config.py
│  │  │  ├─ database.py
│  │  │  ├─ enums.py
│  │  │  ├─ files.py
│  │  │  ├─ security.py
│  │  │  └─ __pycache__
│  │  │     ├─ config.cpython-310.pyc
│  │  │     ├─ config.cpython-311.pyc
│  │  │     ├─ database.cpython-310.pyc
│  │  │     ├─ database.cpython-311.pyc
│  │  │     ├─ enums.cpython-310.pyc
│  │  │     ├─ files.cpython-310.pyc
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
│  │  │  ├─ admin.py
│  │  │  ├─ auth.py
│  │  │  ├─ property.py
│  │  │  ├─ user.py
│  │  │  └─ __pycache__
│  │  │     ├─ admin.cpython-310.pyc
│  │  │     ├─ auth.cpython-310.pyc
│  │  │     └─ property.cpython-310.pyc
│  │  ├─ static
│  │  │  ├─ asd
│  │  │  └─ uploads
│  │  │
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ main.cpython-310.pyc
│  │     ├─ main.cpython-311.pyc
│  │     ├─ __init__.cpython-310.pyc
│  │     └─ __init__.cpython-311.pyc
│  ├─ requirements.txt
│  └─ scripts
│     ├─ seed_amenities.py
│     ├─ seed_users.py
│     └─ __pycache__
│        ├─ seed_amenities.cpython-310.pyc
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
│  │  │  │  │  ├─ LoginPage.jsx
│  │  │  │  │  └─ RegisterPage.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ landing
│  │  │  │  │  ├─ ContactUs.jsx
│  │  │  │  │  ├─ FAQ.jsx
│  │  │  │  │  ├─ Hero.jsx
│  │  │  │  │  ├─ Pricing.jsx
│  │  │  │  │  └─ WhyUs.jsx
│  │  │  │  └─ Navbar.jsx
│  │  │  ├─ pages
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ AdminDashboard.jsx
│  │  │  │  │  ├─ AdminNavbar.jsx
│  │  │  │  │  ├─ AdminOverview.jsx
│  │  │  │  │  ├─ AdminPropertyManagement.jsx
│  │  │  │  │  ├─ AdminSidebar.jsx
│  │  │  │  │  ├─ LandLordManagement.jsx
│  │  │  │  │  └─ TenantManagement.jsx
│  │  │  │  ├─ asdas
│  │  │  │  ├─ LandingPage.jsx
│  │  │  │  ├─ NotFound.jsx
│  │  │  │  └─ users
│  │  │  │     ├─ landlord
│  │  │  │     │  ├─ LandLordDashboard.jsx
│  │  │  │     │  ├─ LandLordNavbar.jsx
│  │  │  │     │  ├─ LandLordOverview.jsx
│  │  │  │     │  ├─ LandLordSidebar.jsx
│  │  │  │     │  ├─ MyTenant.jsx
│  │  │  │     │  ├─ PropertyFormModal.jsx
│  │  │  │     │  ├─ PropertyManagement.jsx
│  │  │  │     │  └─ RoomsModal.jsx
│  │  │  │     └─ TenantDashboard.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ api.js
│  │  │  └─ leafletIconFix.js
│  │  └─ main.jsx
│  └─ vite.config.js
├─ PROGRESS.md
└─ README.md

```
