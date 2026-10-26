#!/usr/bin/env python3
"""Bounded local PDF/image extraction. JSON stdin -> JSON stdout; no files retained."""
import base64,io,json,os,re,sys,resource
from pathlib import Path
resource.setrlimit(resource.RLIMIT_AS,(1_600_000_000,1_600_000_000))
resource.setrlimit(resource.RLIMIT_CPU,(25,25))
import fitz
from PIL import Image
Image.MAX_IMAGE_PIXELS=12_000_000
TESSDATA=os.environ.get('PORTFOLIO_OCR_DATA','/opt/worktrees/portfolio-ocr-runtime/tessdata')
SCHEMA=[('supplier','Supplier',['Supplier','Sender','Vendor']),('reference','Document reference',['Reference','Document ID','Delivery reference','Delivery note number']),('date','Dispatch date',['Dispatch date','Shipped on','Date']),('currency','Currency',['Currency']),('quantity','Quantity',['Quantity','Units']),('total','Declared total',['Declared total','Total value','Total']),('product','Product',['Product','Description','Item'])]
def extract(data):
 if not data or len(data)>6_000_000:raise ValueError('Choose a PDF, PNG or JPEG under 6 MB.')
 is_pdf=data.startswith(b'%PDF-');mode='pdf-text';pages=[];source=None
 if is_pdf:
  source=fitz.open(stream=data,filetype='pdf')
  if source.is_encrypted:raise ValueError('Password-protected PDFs are not supported.')
  if source.page_count>2:raise ValueError('This preview accepts documents with at most 2 pages.')
  if source.page_count<1:raise ValueError('The PDF contains no pages.')
  for page in source:
   if page.rect.width*page.rect.height>4_000_000:raise ValueError('The page dimensions exceed the preview limit.')
   pix=page.get_pixmap(matrix=fitz.Matrix(1.6,1.6),alpha=False)
   if len(page.get_text('words'))>=5:textpage=page
   else:
    mode='local-ocr'
    if not (Path(TESSDATA)/'eng.traineddata').is_file():raise ValueError('Local OCR language data is unavailable.')
    ocr=fitz.open(stream=pix.pdfocr_tobytes(language='eng',tessdata=TESSDATA),filetype='pdf');textpage=ocr[0]
   pages.append(page_result(textpage,pix))
 else:
  if not(data.startswith(b'\x89PNG\r\n\x1a\n')or data.startswith(b'\xff\xd8\xff')):raise ValueError('Only PDF, PNG and JPEG documents are supported.')
  image=Image.open(io.BytesIO(data));image.load()
  if image.width*image.height>12_000_000:raise ValueError('Image dimensions exceed the preview limit.')
  image=image.convert('RGB');buf=io.BytesIO();image.save(buf,format='PNG');pix=fitz.Pixmap(buf.getvalue());mode='local-ocr'
  if not(Path(TESSDATA)/'eng.traineddata').is_file():raise ValueError('Local OCR language data is unavailable.')
  ocr=fitz.open(stream=pix.pdfocr_tobytes(language='eng',tessdata=TESSDATA),filetype='pdf');pages.append(page_result(ocr[0],pix))
 fields=[]
 for key,label,aliases in SCHEMA:
  result={'id':key,'label':label,'value':'','status':'missing','page':None,'bbox':None,'evidence':''}
  for page_index,page in enumerate(pages):
   for line in page['lines']:
    for alias in aliases:
     match=re.match(r'^\s*'+re.escape(alias)+r'(?:\s*\(([A-Z]{3})\))?\s*[:#]\s*(.+?)\s*$',line['text'],re.I)
     if match:
      value=match.group(2)
      if key=='total':value=value.replace('EUR','').replace('€','').strip()
      result.update(value=value,status='found',page=page_index,bbox=line['bbox'],evidence=line['text']);break
    if result['status']=='found':break
   if result['status']=='found':break
  fields.append(result)
 if next(f for f in fields if f['id']=='currency')['status']=='missing':
  total=next(f for f in fields if f['id']=='total');match=re.search(r'\b(EUR|USD|GBP)\b',total['evidence'])
  if match:next(f for f in fields if f['id']=='currency').update(value=match.group(1),status='found',page=total['page'],bbox=total['bbox'],evidence=total['evidence'])
 return {'engine':mode,'fields':fields,'pages':pages,'scope':'Local text/OCR extraction with explicit label rules; every field requires source review. No upload is retained.'}
def page_result(page,pix):
 grouped={}
 for w in page.get_text('words'):
  key=(w[5],w[6]);grouped.setdefault(key,[]).append(w)
 lines=[]
 for words in grouped.values():
  words.sort(key=lambda w:w[7]);box=[min(w[0] for w in words)/page.rect.width,min(w[1] for w in words)/page.rect.height,max(w[2] for w in words)/page.rect.width,max(w[3] for w in words)/page.rect.height]
  lines.append({'text':' '.join(w[4] for w in words),'bbox':box})
 return {'width':pix.width,'height':pix.height,'image':'data:image/png;base64,'+base64.b64encode(pix.tobytes('png')).decode(),'lines':lines,'text':'\n'.join(line['text']for line in lines)}
if __name__=='__main__':
 try:
  payload=sys.stdin.buffer.read(8_100_000);item=json.loads(payload);raw=base64.b64decode(item['data'],validate=True);result=extract(raw);print(json.dumps(result))
 except Exception as error:
  print(json.dumps({'error':str(error)[:250]}));sys.exit(1)
