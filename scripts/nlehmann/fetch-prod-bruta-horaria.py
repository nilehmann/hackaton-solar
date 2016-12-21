import json, requests

sing = '223687'
sic = '223689'

url = 'http://datos.energiaabierta.cl/rest/datastreams/{}/data.csv?pArgument0={}&pArgument1={}'

for year in range(2014, 2017):
    for month in range(1, 13):
        if month < 10:
            month = '0' + str(month)
        else:
            month = str(month)
        year = str(year)
        u = url.format(sing, year, month)
        print(u)
        res = requests.get(u)
        print(res)
        while(res.status_code != 200):
            res = requests.get(u)
            print(res)
        with open(year+'-'+month+'.csv', 'w') as f:
            f.write(str(res.content.decode('utf-8')))
