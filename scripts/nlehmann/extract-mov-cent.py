import re
import glob
from difflib import SequenceMatcher

def convert_excel_time(t):
    if t > 1:
        t = t%1
    seconds = round(t*86400)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return hours, minutes

plants = [
    ('luz del norte', 19),
    ('conejo', 18),
    ('carrea pinto', 17),
    ('pampa solar norte', 16),
    ('san andres', 9),
    ('llano de llampos', 10),
    ('diego de almagro', 8),
]

def normalize(name):
    normalized = name.lower()
    normalized = re.sub(r'\bc\.\b', '', normalized)
    normalized = re.sub(r'\bpfv\b', '', normalized)
    normalized = re.sub(r'\bpfv\.\b', '', normalized)
    normalized = re.sub('\bpfb\b', '', normalized)
    normalized = re.sub(r'\s+', ' ', normalized)
    normalized = re.sub(r'\bp.\s+fv\b', '', normalized)
    normalized = normalized.replace('é', 'e')
    return normalized.strip()

false_matches = [
    'Andes', 'Andes_1', 'Andes_2', 'Andes_3', 'Andes_4', 'C. PE Canela I',
    'C. PE Canela I ', 'C. PE San Juan', 'C. PFV Chañares', 'C. PFV Salvador',
    'CON_CON', 'Cardones', 'Espinos', 'Linares', 'Linares Norte', 'PE Canela I',
    'PE San Juan', 'PFV Chañares', 'PFV Salvador', 'San Gregorio', 'San Isidro',
    'San Isidro II', 'Santa_Fe',
]

def is_solar(name):
    id_max = None
    plant_max = None
    max_ratio = 0
    if name in false_matches:
        return id_max, plant_max, max_ratio
    for plant, i in plants:
        ratio = SequenceMatcher(None, normalize(name), plant).ratio()
        if ratio > 0.5 and ratio > max_ratio:
            max_ratio = ratio
            plant_max = plant
            id_max = i
    return id_max, plant_max, max_ratio

files = glob.glob('mov_cent/*.csv')
your_csv_file = open('mov_cent.csv', 'w', encoding='utf-8', newline='')
wr = csv.writer(your_csv_file, quoting=csv.QUOTE_ALL)
wr.writerow(['id', 'name', 'year', 'month', 'day', 'hour', 'minute', 'up', 'down', 'stay', 'descrp'])
for fn in sorted(files):
  base = fn.replace('mov_cent/','').replace('.xls.csv', '')
  year = '20'+base[:2]
  month = base[2:4]
  day = base[4:]
  with open(fn, newline='') as csvfile:
      reader = csv.reader(csvfile)
      for row in reader:
          i, normalized_name, ratio = is_solar(row[3])
          if normalized_name:
              hour, minute = convert_excel_time(float(row[1]))
              wr.writerow([i, normalized_name, year, month, day, hour, minute, row[4], row[5], row[6], row[7]])
