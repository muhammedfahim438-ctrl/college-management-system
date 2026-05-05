# College Management System

## Project Overview

This project is a Django-based **College Management System** developed as a mini project submission.

It includes:

* Public website (frontend)
* Custom admin dashboard (backend)
* Student management system
* Carousel management
* Gallery management
* Contact management
* REST APIs using Django REST Framework
* JWT authentication
* Email OTP verification

---

## Technologies Used

* **Backend:** Django
* **API:** Django REST Framework
* **Authentication:** JWT Authentication
* **Frontend:** HTML, CSS, Bootstrap
* **Database:** SQLite
* **Email Service:** Gmail SMTP

---

## Features

### Public Website

* Home page
* About section
* Courses section
* Gallery section
* Contact section

### Dynamic Content

* Dynamic homepage carousel
* Dynamic gallery images

### Contact Form

* Stores user messages in database
* Messages visible in admin dashboard

### Admin Dashboard

* Admin login
* Student CRUD operations
* Carousel image management
* Gallery image management
* Contact message management

---

## Student Fields

* Name
* Email
* Phone
* Course
* Date of Joining

---

## API Endpoints

### Authentication APIs

#### JWT Login

**POST** `/api/login/`

Returns:

* Access token
* Refresh token

---

### OTP APIs

#### Send OTP

**POST** `/api/send-otp/`

#### Verify OTP

**POST** `/api/verify-otp/`

---

### Student APIs

#### Get all students

**GET** `/api/students/`

#### Create student

**POST** `/api/students/`

#### Get one student

**GET** `/api/students/<id>/`

#### Update student

**PUT** `/api/students/<id>/`

#### Delete student

**DELETE** `/api/students/<id>/`

---

### Carousel API

**GET** `/api/carousel/`

---

### Gallery API

**GET** `/api/gallery/`

---

### Contact API

**GET** `/api/contacts/`

---

## Project Structure

```text
college_management/
│
├── accounts/
├── students/
├── website/
├── gallery/
├── carousel/
├── api/
├── templates/
├── media/
└── manage.py
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/muhammedfahim438-ctrl/college-management-system.git
cd college-management-system
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows**

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt pillow
```

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Run development server

```bash
python manage.py runserver
```

---

## Gmail SMTP Configuration

Add the following in `settings.py`

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'your_email@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
EMAIL_USE_TLS = True
```

---

## Default URLs

### Public Website

`http://127.0.0.1:8000/`

### Custom Admin Login

`http://127.0.0.1:8000/admin/login/`

### API Base URL

`http://127.0.0.1:8000/api/`

---

## Project Outcome

This project demonstrates:

* Django CRUD operations
* Template rendering
* Media upload handling
* REST API development
* JWT authentication
* Email OTP verification
* Custom admin dashboard

---

## GitHub Repository

https://github.com/muhammedfahim438-ctrl/college-management-system
