import httpx
url='https://api.aladhan.com/v1/timingsByCity'
params={'city':'London','country':'','method':2}
with httpx.Client(timeout=10) as c:
    r=c.get(url, params=params)
    print(r.status_code)
    print(r.text[:800])
