# coding:utf-8

from django.shortcuts import render
from django.http import HttpResponse
from StockApp.functions import *


def stockchart(request, code_str=None):
    str_code = code_str
    if code_str == None:
        str_code = '000063'
    context = {}
    context['code'] = str_code
    return render(request, 'stockchart.html', context)


def getchartjson(request, code_str):

    data = get_hist_data_list(code_str, start='2016-01-01', end='2017-02-01')

    k_data = dict(
        data=data,
        code=code_str
    )

    return HttpResponse(json.dumps(k_data), content_type="application/json")


def initmodelsdata(request):
    init_models()
    k_data = dict(
        result=True,
        str='init_models'
    )
    return HttpResponse(json.dumps(k_data), content_type="application/json")
