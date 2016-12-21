import xlrd
import glob
import csv
filenames = glob.glob('*.xls')

def csv_from_excel(wb, fname, mov_cent, gen_real):
    if mov_cent:
        sh = wb.sheet_by_name(mov_cent)
        your_csv_file = open('csv/mov_cent/'+fname+'.csv', 'w', encoding='utf-8', newline='')
        wr = csv.writer(your_csv_file, quoting=csv.QUOTE_ALL)
        for rownum in range(sh.nrows):
            wr.writerow(sh.row_values(rownum))
        your_csv_file.close()

     if gen_real:
         sh = wb.sheet_by_name(gen_real)
         your_csv_file = open('csv/gen_real/'+fname+'.csv', 'w', encoding='utf-8', newline='')
         wr = csv.writer(your_csv_file, quoting=csv.QUOTE_ALL)
         for rownum in range(sh.nrows):
            wr.writerow(sh.row_values(rownum))
         your_csv_file.close()

for fname in sorted(filenames):
    print(fname)
    xl_workbook = xlrd.open_workbook(fname)

    sheet_names = xl_workbook.sheet_names()

    mov_cent = None
    if 'Mov_Cent' in sheet_names:
        mov_cent = 'Mov_Cent'
    elif 'Movimiento de Centrales' in sheet_names:
        mov_cent = 'Movimiento de Centrales'
    else:
        print('No movimientos', fname)

    gen_real = None
    if 'gen_real' in sheet_names:
        gen_real = 'gen_real'
    else:
        print('No gen_real', fname)

    csv_from_excel(xl_workbook, fname, mov_cent, gen_real)
    break
