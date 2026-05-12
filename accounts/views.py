import random
import json

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from students.models import Student
from carousel.models import Carousel
from gallery.models import Gallery
from website.models import Contact
from .models import EmailOTP
from django.views.decorators.cache import never_cache


# ── AUTH ──────────────────────────────────────────────────────────

def admin_login(request):
    if request.user.is_authenticated:
        logout(request)

    show_otp = False
    user_id = request.session.get('otp_user_id')
    if user_id:
        show_otp = True

    if request.method == 'POST':
        if 'otp' in request.POST:
            entered_otp = request.POST.get('otp')
            user_id = request.session.get('otp_user_id')
            if not user_id:
                messages.error(request, 'Session expired. Please login again.')
                return redirect('admin_login')
            user = User.objects.get(id=user_id)
            try:
                otp_obj = EmailOTP.objects.get(user=user)
                if otp_obj.is_expired():
                    otp_obj.delete()
                    del request.session['otp_user_id']
                    messages.error(request, 'OTP expired. Please login again.')
                    return redirect('admin_login')
                if otp_obj.otp == entered_otp:
                    login(request, user)
                    otp_obj.delete()
                    del request.session['otp_user_id']
                    return redirect('dashboard')
                else:
                    show_otp = True
                    messages.error(request, 'Invalid OTP')
            except EmailOTP.DoesNotExist:
                messages.error(request, 'OTP not found. Please login again.')
                return redirect('admin_login')
        else:
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(username=username, password=password)
            if user and user.is_staff:
                otp = str(random.randint(100000, 999999))
                EmailOTP.objects.filter(user=user).delete()
                EmailOTP.objects.create(user=user, otp=otp)
                send_mail(
                    subject='Your Login OTP',
                    message=f'Your OTP is {otp}. It is valid for 5 minutes.',
                    from_email=None,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                request.session['otp_user_id'] = user.id
                show_otp = True
                messages.success(request, 'OTP sent to your registered email.')
            else:
                messages.error(request, 'Invalid username or password')

    return render(request, 'accounts/login.html', {'show_otp': show_otp})


def admin_logout(request):
    logout(request)
    request.session.flush()
    return redirect('admin_login')


# ── DASHBOARD ─────────────────────────────────────────────────────

@login_required(login_url='admin_login')
@never_cache
def dashboard(request):
    return render(request, 'accounts/dashboard.html', {
        'student_count':  Student.objects.count(),
        'carousel_count': Carousel.objects.count(),
        'gallery_count':  Gallery.objects.count(),
        'contact_count':  Contact.objects.count(),
    })


# ── OTP API ───────────────────────────────────────────────────────

@csrf_exempt
def send_otp_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if not user:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
        otp = str(random.randint(100000, 999999))
        EmailOTP.objects.filter(user=user).delete()
        EmailOTP.objects.create(user=user, otp=otp)
        send_mail('Your Login OTP', f'Your OTP is {otp}. Valid for 5 minutes.', None, [user.email])
        return JsonResponse({'message': 'OTP sent'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def verify_otp_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=400)
    try:
        data = json.loads(request.body)
        user = User.objects.get(username=data.get('username'))
        otp_obj = EmailOTP.objects.get(user=user)
        if otp_obj.is_expired():
            otp_obj.delete()
            return JsonResponse({'error': 'OTP expired'}, status=400)
        if otp_obj.otp == data.get('otp'):
            otp_obj.delete()
            return JsonResponse({'message': 'OTP verified'})
        return JsonResponse({'error': 'Invalid OTP'}, status=400)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except EmailOTP.DoesNotExist:
        return JsonResponse({'error': 'OTP not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# ── AJAX: COUNTS ──────────────────────────────────────────────────

@csrf_exempt
def dashboard_counts(request):
    return JsonResponse({
        'student_count':  Student.objects.count(),
        'carousel_count': Carousel.objects.count(),
        'gallery_count':  Gallery.objects.count(),
        'contact_count':  Contact.objects.count(),
    })


# ── AJAX: STUDENTS ────────────────────────────────────────────────

@csrf_exempt
def student_list_json(request):
    students = list(Student.objects.order_by('-id').values(
        'id', 'name', 'email', 'phone', 'course', 'date_of_joining'))
    for s in students:
        s['date_of_joining'] = str(s['date_of_joining']) if s['date_of_joining'] else ''
    return JsonResponse({'students': students})


@csrf_exempt
def student_add_ajax(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            Student.objects.create(
                name=data.get('name', '').strip(),
                email=data.get('email', '').strip(),
                phone=data.get('phone', '').strip(),
                course=data.get('course', '').strip(),
                date_of_joining=data.get('date_of_joining'),
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def student_edit_ajax(request, pk):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            s = get_object_or_404(Student, pk=pk)
            s.name = data.get('name', '').strip()
            s.email = data.get('email', '').strip()
            s.phone = data.get('phone', '').strip()
            s.course = data.get('course', '').strip()
            s.date_of_joining = data.get('date_of_joining')
            s.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def student_delete_ajax(request, pk):
    if request.method == 'POST':
        get_object_or_404(Student, pk=pk).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'POST required'}, status=400)


# ── AJAX: CAROUSEL ────────────────────────────────────────────────

@csrf_exempt
def carousel_list_json(request):
    items = [{'id': i.id, 'title': i.title or '', 'image_url': i.image.url}
             for i in Carousel.objects.order_by('-id')]
    return JsonResponse({'items': items})


@csrf_exempt
def carousel_add_ajax(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if not image:
            return JsonResponse({'error': 'Image is required.'}, status=400)
        obj = Carousel.objects.create(
            title=request.POST.get('title', '').strip(),
            image=image
        )
        return JsonResponse({'success': True, 'id': obj.id, 'title': obj.title or '', 'image_url': obj.image.url})
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def carousel_edit_ajax(request, pk):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            obj = get_object_or_404(Carousel, pk=pk)
            obj.title = data.get('title', '').strip()
            obj.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def carousel_delete_ajax(request, pk):
    if request.method == 'POST':
        get_object_or_404(Carousel, pk=pk).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'POST required'}, status=400)


# ── AJAX: GALLERY ─────────────────────────────────────────────────

@csrf_exempt
def gallery_list_json(request):
    items = [{'id': i.id, 'title': i.title or '', 'image_url': i.image.url}
             for i in Gallery.objects.order_by('-id')]
    return JsonResponse({'items': items})


@csrf_exempt
def gallery_add_ajax(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        if not image:
            return JsonResponse({'error': 'Image is required.'}, status=400)
        obj = Gallery.objects.create(
            title=request.POST.get('title', '').strip(),
            image=image
        )
        return JsonResponse({'success': True, 'id': obj.id, 'title': obj.title or '', 'image_url': obj.image.url})
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def gallery_edit_ajax(request, pk):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            obj = get_object_or_404(Gallery, pk=pk)
            obj.title = data.get('title', '').strip()
            obj.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'POST required'}, status=400)


@csrf_exempt
def gallery_delete_ajax(request, pk):
    if request.method == 'POST':
        get_object_or_404(Gallery, pk=pk).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'POST required'}, status=400)


# ── AJAX: CONTACTS ────────────────────────────────────────────────

@csrf_exempt
def contact_list_json(request):
    contacts = list(Contact.objects.order_by('-id').values(
        'id', 'name', 'email', 'subject', 'message', 'created_at'))
    for c in contacts:
        c['created_at'] = c['created_at'].strftime('%d %b %Y, %I:%M %p') if c['created_at'] else ''
    return JsonResponse({'contacts': contacts})


@csrf_exempt
def contact_delete_ajax(request, pk):
    if request.method == 'POST':
        get_object_or_404(Contact, pk=pk).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'POST required'}, status=400)