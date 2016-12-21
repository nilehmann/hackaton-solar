import json, requests
import pandas

url = 'http://www.cdecsic.cl/wp-content/uploads/estadisticas/operdiar/16/OP{}.xls'

date_list = pandas.date_range("2016-02-01", "2016-11-30")

for date in date_list:
    date_url = date.strftime('%y%m%d')
    u = url.format(date_url)
    print(u)
    res = requests.get(u)
    with open('{}.xls'.format(date_url), 'wb') as f:
        f.write(res.content)
