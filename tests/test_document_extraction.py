import base64,importlib.util,io,unittest
from pathlib import Path
import fitz
from PIL import Image,ImageDraw,ImageFont
spec=importlib.util.spec_from_file_location('extractor',Path(__file__).resolve().parents[1]/'scripts/document-extract.py');extractor=importlib.util.module_from_spec(spec);spec.loader.exec_module(extractor)
class ExtractionTest(unittest.TestCase):
 def test_new_text_pdf_extracts_actual_values_and_source_regions(self):
  doc=fitz.open();p=doc.new_page();p.insert_text((40,80),'Supplier: Fresh Test Supplier\nReference: QA-7781\nDispatch date: 2026-10-26\nCurrency: EUR\nQuantity: 9\nDeclared total: 77.40\nProduct: Test cable',fontsize=15)
  result=extractor.extract(doc.tobytes());fields={f['id']:f for f in result['fields']}
  self.assertEqual(result['engine'],'pdf-text');self.assertEqual(fields['reference']['value'],'QA-7781');self.assertEqual(fields['quantity']['value'],'9');self.assertIsNotNone(fields['reference']['bbox']);self.assertTrue(all(0<=v<=1 for v in fields['reference']['bbox']))
 def test_new_image_is_really_ocr_processed(self):
  image=Image.new('RGB',(1200,1000),'white');draw=ImageDraw.Draw(image);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',34)
  for i,line in enumerate(['Vendor: New Image Company','Document ID: TX-9027','Shipped on: 2026-10-26','Currency: GBP','Units: 7','Total: 126.50','Description: New sample item']):draw.text((45,55+i*100),line,font=font,fill='black')
  buf=io.BytesIO();image.save(buf,format='PNG');result=extractor.extract(buf.getvalue());fields={f['id']:f for f in result['fields']}
  self.assertEqual(result['engine'],'local-ocr');self.assertEqual(fields['reference']['value'],'TX-9027');self.assertEqual(fields['currency']['value'],'GBP');self.assertEqual(fields['quantity']['value'],'7')
 def test_missing_field_stays_unknown(self):
  doc=fitz.open();p=doc.new_page();p.insert_text((40,80),'Supplier: Example\nReference: QA-88\nProduct: A test product\nNote: no quantities given',fontsize=14)
  result=extractor.extract(doc.tobytes());quantity=next(f for f in result['fields'] if f['id']=='quantity');self.assertEqual(quantity['status'],'missing');self.assertEqual(quantity['value'],'')
 def test_type_size_and_page_limits(self):
  for raw in [b'',b'not an image',b'x'*3_500_001]:
   with self.assertRaises(ValueError):extractor.extract(raw)
  doc=fitz.open()
  for _ in range(3):doc.new_page()
  with self.assertRaises(ValueError):extractor.extract(doc.tobytes())
if __name__=='__main__':unittest.main()
