#!/usr/bin/env python3
"""Create owned synthetic documents for text extraction and actual image OCR."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]/'public/samples';ROOT.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(ROOT/'delivery-note.pdf'),pagesize=(595,842));c.setFillColor(HexColor('#152536'));c.rect(0,690,595,152,fill=1,stroke=0);c.setFillColor(HexColor('#ffffff'));c.setFont('Helvetica-Bold',28);c.drawString(44,770,'CEDAR SUPPLY');c.setFont('Helvetica',12);c.drawString(44,738,'DELIVERY NOTE / INDEPENDENT SAMPLE');c.setFillColor(HexColor('#26374b'));c.setFont('Helvetica',15)
for i,line in enumerate(['Supplier: Cedar Supply','Reference: DN-1042','Dispatch date: 2026-10-23','Currency: EUR','Quantity: 24','Declared total: 948.00','Product: Adjustable desk lamp']):c.drawString(44,640-i*48,line)
c.setFont('Helvetica',10);c.drawString(44,125,'Synthetic example. No real business transaction or customer data.');c.save()
im=Image.new('RGB',(1240,1654),'#f8f7f2');d=ImageDraw.Draw(im);font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';d.rectangle((0,0,1240,200),fill='#e5e9e0');d.text((70,55),'NORTHLINE COMPONENTS',font=ImageFont.truetype(bold,40),fill='#243c30');d.text((70,125),'GOODS DISPATCH / SAMPLE DOCUMENT',font=ImageFont.truetype(font,23),fill='#485d4e')
lines=['Document ID: SH-2089','Description: Aluminium monitor stand','Sender: Northline Components','Shipped on: 2026-10-25','Units: 12','Total value (EUR): 672.00']
for i,line in enumerate(lines):d.text((70,300+i*112),line,font=ImageFont.truetype(font,31),fill='#263a2d');d.line((70,365+i*112,1170,365+i*112),fill='#d0d9cd',width=2)
d.text((70,1410),'Synthetic document created for this extraction demo.',font=ImageFont.truetype(font,22),fill='#52634f');im.save(ROOT/'dispatch-scan.png')
print('Created original sample PDF and alternate-layout PNG.')
