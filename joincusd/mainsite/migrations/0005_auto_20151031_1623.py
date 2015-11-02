# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainsite', '0004_auto_20151003_2038'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='posting',
            name='type',
        ),
        migrations.AddField(
            model_name='posting',
            name='detail_icon_path',
            field=models.FilePathField(default=b'/home/images', max_length=255, verbose_name=b'/home/images'),
        ),
        migrations.AddField(
            model_name='posting',
            name='list_thumbnail_path',
            field=models.FilePathField(default=b'/home/images', max_length=255, verbose_name=b'/home/images'),
        ),
        migrations.AddField(
            model_name='posting',
            name='posting_type',
            field=models.CharField(default=b'project', max_length=255),
        ),
        migrations.AddField(
            model_name='posting',
            name='rank',
            field=models.IntegerField(default=0),
        ),
    ]
