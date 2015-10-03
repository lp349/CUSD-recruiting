# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainsite', '0003_auto_20151003_1927'),
    ]

    operations = [
        migrations.CreateModel(
            name='Opening',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=500)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image_path', models.FilePathField(max_length=255, verbose_name=b'/home/images')),
            ],
        ),
        migrations.CreateModel(
            name='Posting',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=500)),
                ('tagline', models.CharField(max_length=4096)),
                ('description', models.TextField()),
                ('openings', models.ManyToManyField(to='mainsite.Opening')),
                ('photos', models.ManyToManyField(to='mainsite.Photo')),
            ],
        ),
        migrations.DeleteModel(
            name='Project',
        ),
        migrations.DeleteModel(
            name='Role',
        ),
    ]
