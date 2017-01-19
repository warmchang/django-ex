# coding:utf-8

import tushare as ts
import json
from django.db import models
from StockApp.models import *
import time
from datetime import *


def getchartjson(request, code_str):
    data = get_hist_data_list(code_str, start='2016-01-01', end='2016-07-01')

    k_data = dict(
        data=data,
        code=code_str
    )

    return HttpResponse(json.dumps(k_data), content_type="application/json")


def get_hist_data_list(code, start=None, end=None):
    orange_data = None
    if start == None and end == None:
        orange_data = ts.get_h_data(code)
    else:
        orange_data = ts.get_h_data(code, start=start, end=end)

    quotes = [[index.strftime('%Y-%m-%d'), row['open'], row['close'], row['low'], row[
        'high'], row['volume'], row['amount']] for index, row in orange_data.iterrows()]
    quotes.reverse()
    return quotes


def splice_stock_data(data):
    stock_date = [i[0] for i in data]
    stock_value = [i[1:len(i)] for i in data]
    return (stock_date, stock_value)


def init_models():
    orange_data = ts.get_stock_basics()
    StockBasicsList = []
    for index, row in orange_data.iterrows():
        entry = StockBasics(code=index, name=row.name, industry=row.industry, area=row.area, pe=row.pe, outstanding=row.outstanding,
                            totals=row.totals, totalAssets=row.totalAssets, liquidAssets=row.liquidAssets, fixedAssets=row.fixedAssets, eps=0,
                            reserved=row.reserved, reservedPerShare=row.reservedPerShare,
                            bvps=row.bvps, pb=row.pb, timeToMarket=date.today() if row.timeToMarket == 0 else datetime.strptime(str(row.timeToMarket), '%Y%m%d').date())
    StockBasicsList.append(entry)
    # entry.save()
    StockBasics.objects.bulk_create(StockBasicsList)
