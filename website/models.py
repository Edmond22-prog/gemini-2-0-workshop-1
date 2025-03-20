from django.db import models


class UploadedFile(models.Model):
    file = models.FileField(upload_to="uploads/")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=10, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def get_url(self):
        return self.file.url
