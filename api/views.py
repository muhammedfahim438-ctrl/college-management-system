from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from students.models import Student
from .serializers import StudentSerializer

from carousel.models import Carousel
from gallery.models import Gallery
from website.models import Contact

from .serializers import CarouselSerializer, GallerySerializer, ContactSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

import random
from django.core.mail import send_mail
from accounts.models import EmailOTP


# ─── STUDENTS ───────────────────────────────────────────────
class StudentListCreateAPI(APIView):

    def get(self, request):
        students = Student.objects.all().order_by('-id')
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentDetailAPI(APIView):

    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def put(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        student.delete()
        return Response({'message': 'Student deleted successfully'})


# ─── CAROUSEL ───────────────────────────────────────────────
class CarouselListAPI(APIView):

    def get(self, request):
        items = Carousel.objects.all().order_by('-id')
        # pass request so image_url builds full absolute URL
        serializer = CarouselSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


# ─── GALLERY ────────────────────────────────────────────────
class GalleryListAPI(APIView):

    def get(self, request):
        items = Gallery.objects.all().order_by('-id')
        # pass request so image_url builds full absolute URL
        serializer = GallerySerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


# ─── CONTACT ────────────────────────────────────────────────
class ContactListAPI(APIView):

    def get(self, request):
        items = Contact.objects.all().order_by('-id')
        serializer = ContactSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Message sent successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── AUTH / LOGIN ────────────────────────────────────────────
class LoginAPI(APIView):

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ─── OTP ─────────────────────────────────────────────────────
class SendOTPAPI(APIView):

    def post(self, request):
        email = request.data.get('email')

        otp = str(random.randint(100000, 999999))

        EmailOTP.objects.filter(email=email).delete()
        EmailOTP.objects.create(email=email, otp=otp)

        send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            None,
            [email],
            fail_silently=False
        )

        return Response({'message': 'OTP sent successfully'})


class VerifyOTPAPI(APIView):

    def post(self, request):
        email = request.data.get('email')
        otp   = request.data.get('otp')

        otp_obj = EmailOTP.objects.filter(email=email, otp=otp).first()

        if otp_obj:
            otp_obj.delete()
            return Response({'message': 'OTP verified successfully'})

        return Response(
            {'error': 'Invalid OTP'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ContactDetailAPI(APIView):
    def delete(self, request, pk):
        contact = get_object_or_404(Contact, pk=pk)
        contact.delete()
        return Response({'message': 'Deleted successfully'})       

class CarouselDetailAPI(APIView):
    def put(self, request, pk):
        item = get_object_or_404(Carousel, pk=pk)
        # update title
        item.title = request.data.get('title', item.title)
        if 'image' in request.FILES:
            item.image = request.FILES['image']
        item.save()
        return Response({'success': True})

    def delete(self, request, pk):
        get_object_or_404(Carousel, pk=pk).delete()
        return Response({'success': True})    