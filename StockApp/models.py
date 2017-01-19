# coding:utf-8

from __future__ import unicode_literals

from django.db import models

# Create your models here.


class StockBasics(models.Model):
    """
    获取沪深上市公司基本情况
    code,代码
    name,名称
    industry,所属行业
    area,地区
    pe,市盈率
    outstanding,流通股本
    totals,总股本(万)
    totalAssets,总资产(万)
    liquidAssets,流动资产
    fixedAssets,固定资产
    reserved,公积金
    reservedPerShare,每股公积金
    eps,每股收益
    bvps,每股净资
    pb,市净率
    timeToMarket,上市日期
    """
    code = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    industry = models.CharField(max_length=30)
    area = models.CharField(max_length=30)
    pe = models.FloatField()
    outstanding = models.FloatField()
    totals = models.FloatField()
    totalAssets = models.FloatField()
    liquidAssets = models.FloatField()
    fixedAssets = models.FloatField()
    reserved = models.FloatField()
    reservedPerShare = models.FloatField()
    eps = models.FloatField()
    bvps = models.FloatField()
    pb = models.FloatField()
    timeToMarket = models.DateField()
