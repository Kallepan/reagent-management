from rest_framework import serializers

from .models import Kind, Analysis, Device, Batch, Reagent, Removal

class KindSerializer(serializers.ModelSerializer):
    """
    Serializer for Kind model.
    """

    class Meta:
        model = Kind
        fields = ['id', 'name']
        read_only_fields = ['id']
    
    def validate_name(self, value):
        # name should be either:
        # - 'Kontrolle'
        # - 'Standard'
        # - 'Mastermix'
        
        if value not in ['Kontrolle', 'Standard', 'Mastermix']:
            raise serializers.ValidationError('Kind name should be either "Kontrolle", "Standard" or "Mastermix".')

        return value

class AnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for Analysis model.
    """

    class Meta:
        model = Analysis
        fields = ['id', 'name']
        read_only_fields = ['id']

class DeviceSerializer(serializers.ModelSerializer):
    """
    Serializer for Device model.
    """

    class Meta:
        model = Device
        fields = ['id', 'name']
        read_only_fields = ['id']

class RemovalSerializer(serializers.ModelSerializer):
    """
    Serializer for Removal model.
    """
    reagent_id = serializers.PrimaryKeyRelatedField(queryset=Reagent.objects.all(), write_only=True)

    class Meta:
        model = Removal
        fields = ['id', 'amount', 'created_at', 'created_by', 'reagent_id']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # we need to get the reagent_id from the request data
        reagent_id = validated_data.pop('reagent_id')
        removal = Removal.objects.create(**validated_data, reagent=reagent_id)
        
        return removal
    
    def validate(self, attrs):
        # check if reagent exists
        reagent_id = self.initial_data.get('reagent_id', None)
        
        if reagent_id is None:
            raise serializers.ValidationError('Reagent ID is required.')
        
        # check if reagent exists and if the currrent amount is greater than the amount to be removed
        reagents = Reagent.objects.filter(id=reagent_id, is_empty=False)
        if not reagents.exists():
            raise serializers.ValidationError('Reagent does not exist.')
        else:
            # Check if the amount to be removed is greater than the current amount
            if reagents.first().current_amount < attrs.get('amount', 0):
                raise serializers.ValidationError('Amount to be removed is greater than the current amount.')

        return super().validate(attrs)

class ReagentSerializer(serializers.ModelSerializer):
    """
    Serializer for Reagent model.
    """
    batch_id = serializers.PrimaryKeyRelatedField(queryset=Batch.objects.all(), write_only=True)
    removals = RemovalSerializer(many=True, read_only=True)

    class Meta:
        model = Reagent
        fields = [
            'id', 
            'batch_id',
            'is_empty',
            'removals',
            'initial_amount', 
            'created_at', 
            'created_by', 
        ]
        read_only_fields = ['id', 'created_at', 'is_empty']
    
    def create(self, validated_data):
        # we need to get the batch_id from the request data
        batch_id = validated_data.pop('batch_id')
        reagent = Reagent.objects.create(**validated_data, batch=batch_id)
        
        return reagent
    
    def validate(self, attrs):
        # check if batch exists
        batch_id = self.initial_data.get('batch_id', None)
        
        if not Batch.objects.filter(id=batch_id).exists():
            raise serializers.ValidationError('Batch does not exist.')
        
        return super().validate(attrs)

class BatchSerializer(serializers.ModelSerializer):
    analysis = AnalysisSerializer(read_only=True)
    analysis_id = serializers.PrimaryKeyRelatedField(queryset=Analysis.objects.all(), write_only=True)
    device = DeviceSerializer(read_only=True)
    device_id = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all(), write_only=True)
    kind = KindSerializer(read_only=True)
    kind_id = serializers.PrimaryKeyRelatedField(queryset=Kind.objects.all(), write_only=True)
    reagents = ReagentSerializer(many=True, read_only=True)

    class Meta:
        model = Batch
        fields = [
            'id', 
            'analysis', 
            'analysis_id', 
            'device', 
            'device_id', 
            'kind', 
            'kind_id', 
            'comment', 
            'created_at', 
            'created_by', 
            'reagents',
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # we need to manually pop the analysis_id, device_id and kind_id from validated_data and create the batch with it
        analysis = validated_data.pop('analysis_id')
        device = validated_data.pop('device_id')
        kind = validated_data.pop('kind_id')
        batch = Batch.objects.create(**validated_data, analysis=analysis, device=device, kind=kind)
        
        return batch
    
    def validate(self, attrs):
        # check if analysis, device and kind exist
        analysis_id = self.initial_data.get('analysis_id', None)
        device_id = self.initial_data.get('device_id', None)
        kind_id = self.initial_data.get('kind_id', None)
        
        if not Analysis.objects.filter(id=analysis_id).exists():
            raise serializers.ValidationError('Analysis does not exist.')
        
        if not Device.objects.filter(id=device_id).exists():
            raise serializers.ValidationError('Device does not exist.')
        
        if not Kind.objects.filter(id=kind_id).exists():
            raise serializers.ValidationError('Kind does not exist.')
        
        return super().validate(attrs)