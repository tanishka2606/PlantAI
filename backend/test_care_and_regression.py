import requests
import json

print('=====================================================')
print('TEST SUITE: PLANT CARE MYSQL + AI FALLBACK & REGRESSION')
print('=====================================================')

BASE_URL = 'http://127.0.0.1:8000'

# 1. Test Plant Care with MySQL Plant
print('\n[TEST 1] Plant Care: Hibiscus (MySQL primary)')
r_hib = requests.get(f'{BASE_URL}/plant-care/Hibiscus')
assert r_hib.status_code == 200, f'Status {r_hib.status_code}'
d_hib = r_hib.json()
assert d_hib['success'] == True
assert d_hib['data']['source'] == 'MySQL'
assert d_hib['data']['id'] == 1
print(' PASS: Hibiscus loaded from MySQL successfully (ID: 1).')

# 2. Test Plant Care with Missing Plant: Tulip (Fallback)
print('\n[TEST 2] Plant Care: Tulip (Fallback)')
r_tulip = requests.get(f'{BASE_URL}/plant-care/Tulip')
assert r_tulip.status_code == 200
d_tulip = r_tulip.json()
assert d_tulip['success'] == True
assert d_tulip['data']['id'] is None
assert 'MySQL' not in d_tulip['data']['source']
assert len(d_tulip['data']['sunlight']) > 10
assert len(d_tulip['data']['water']) > 10
assert len(d_tulip['data']['soil']) > 10
assert len(d_tulip['data']['container']) > 10
assert len(d_tulip['data']['location']) > 10
assert len(d_tulip['data']['fertilizer']) > 10
assert len(d_tulip['data']['care']) > 10
print(f" PASS: Tulip resolved via fallback ({d_tulip['data']['source']}).")

# 3. Test Plant Care with Missing Plant: Lavender (Fallback)
print('\n[TEST 3] Plant Care: Lavender (Fallback)')
r_lav = requests.get(f'{BASE_URL}/plant-care/Lavender')
assert r_lav.status_code == 200
d_lav = r_lav.json()
assert d_lav['success'] == True
assert d_lav['data']['id'] is None
print(f" PASS: Lavender resolved via fallback ({d_lav['data']['source']}).")

# 4. Test Assistant Endpoint
print('\n[TEST 4] AI Assistant: Question about Tulip')
r_ast = requests.post(f'{BASE_URL}/assistant', json={'question': 'How often do I water Tulip?', 'plant_name': 'Tulip'})
assert r_ast.status_code == 200
d_ast = r_ast.json()
assert d_ast['success'] == True
assert len(d_ast['answer']) > 15
print(' PASS: Assistant endpoint returned guidance.')

# 5. Test Health Check Endpoint exists
print('\n[TEST 5] Health Check Endpoint')
r_hlth = requests.post(f'{BASE_URL}/health-check', files={'file': ('leaf.jpg', b'dummy', 'image/jpeg')})
assert r_hlth.status_code == 200
print(' PASS: Health Check endpoint active.')

# 6. Test Seed Identify Endpoint exists
print('\n[TEST 6] Seed Identify Endpoint')
r_seed = requests.post(f'{BASE_URL}/seed-identify', files={'file': ('seed.jpg', b'dummy', 'image/jpeg')})
assert r_seed.status_code == 200
print(' PASS: Seed Identify endpoint active.')

print('\n=====================================================')
print('ALL TESTS PASSED WITH 100% SUCCESS!')
print('=====================================================')
