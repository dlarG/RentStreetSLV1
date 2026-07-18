
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
│  │  │     ├─ business_permits
│  │  │     │  └─ c02c8898-0bc4-4f4e-bb9b-6653ae83bd99.pdf
│  │  │     ├─ profile_photos
│  │  │     │  ├─ 5a675559-2b0f-4bdb-9d0d-dd1cefd65104.jpg
│  │  │     │  ├─ 7a7ba783-f8bc-43d4-b5d8-16e19005ccfd.jpg
│  │  │     │  └─ c9e7ae56-6716-4286-a58f-d0f48a3677f3.jpg
│  │  │     ├─ property_images
│  │  │     │  └─ 35bbff03-85ae-4bcb-8720-7d8711bee9e4.jpg
│  │  │     ├─ registration_images
│  │  │     │  └─ b9f65fc6-462f-4771-8711-e43c98566708.jpg
│  │  │     ├─ room_images
│  │  │     │  ├─ 16117455-09a1-48fc-8d8e-02f9136f04da.jpg
│  │  │     │  ├─ 383f4f2e-3366-4136-896a-3e9d4f6417ce.jpg
│  │  │     │  ├─ 81f2948a-fda4-4a51-b4d8-8bc3781323fb.jpg
│  │  │     │  ├─ e82eff4d-38c6-45a8-a012-1187bf31378f.jpg
│  │  │     │  ├─ f7b7244b-bbcd-4810-8b7d-0a1c87332caf.jpg
│  │  │     │  └─ fd25d9ec-ab19-4587-a8a4-ef4e5f46b6fc.jpg
│  │  │     ├─ valid_ids
│  │  │     │  └─ 3f7151a3-ad48-4fb3-b241-f2629dbb2308.pdf
│  │  │     └─ valid_ids_renters
│  │  │        ├─ a29308b5-c475-4c5b-af05-b96b2528b49d.jpg
│  │  │        └─ ee760a7b-4ba9-4549-a3aa-9fc8fa950944.jpg
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