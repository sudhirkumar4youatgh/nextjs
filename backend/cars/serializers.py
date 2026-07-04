from rest_framework import serializers
from .models import Car, Make

class MakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Make
        fields = ['id', 'name']

class CarSerializer(serializers.ModelSerializer):
    make = MakeSerializer(read_only=True)
    make_name = serializers.CharField(write_only=True)

    class Meta:
        model = Car
        fields = [
            'id',
            'make',
            'make_name',
            'model',
            'year',
            'price',
            'location',
            'mileage',
            'fuel_type',
            'transmission',
            'description',
        ]

    def create(self, validated_data):
        make_name = validated_data.pop('make_name')
        make, _ = Make.objects.get_or_create(name=make_name)
        return Car.objects.create(make=make, **validated_data)
