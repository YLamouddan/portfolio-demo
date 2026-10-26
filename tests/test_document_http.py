import importlib.util,io,json,threading,unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError
spec=importlib.util.spec_from_file_location('folio_api',Path(__file__).resolve().parents[1]/'api/extract_document.py');api=importlib.util.module_from_spec(spec);spec.loader.exec_module(api)
class QuietHandler(api.handler):
 def log_message(self,*args):pass
class HttpTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=ThreadingHTTPServer(('127.0.0.1',0),QuietHandler);cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start();cls.url='http://127.0.0.1:'+str(cls.server.server_address[1])+'/api/extract_document'
 @classmethod
 def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.thread.join()
 def post(self,data,origin=None):
  payload=b'--FolioBoundary\r\nContent-Disposition: form-data; name="file"; filename="sample.pdf"\r\nContent-Type: application/pdf\r\n\r\n'+data+b'\r\n--FolioBoundary--\r\n';request=Request(self.url,data=payload,headers={'Content-Type':'multipart/form-data; boundary=FolioBoundary',**({'Origin':origin}if origin else{})})
  try:
   with urlopen(request,timeout=30) as response:return response.status,dict(response.headers),json.load(response)
  except HTTPError as response:return response.code,dict(response.headers),json.load(response)
 def test_actual_pdf_and_scan_through_handler(self):
  for filename,reference,engine in [('delivery-note.pdf','DN-1042','pdf-text'),('dispatch-scan.png','SH-2089','local-ocr')]:
   status,headers,result=self.post((Path(__file__).resolve().parents[1]/'public/samples'/filename).read_bytes());self.assertEqual(status,200,result);self.assertEqual(headers['Cache-Control'],'no-store');self.assertEqual(result['engine'],engine);self.assertEqual(next(f for f in result['fields']if f['id']=='reference')['value'],reference);self.assertLess(len(json.dumps(result)),4_000_000);self.assertTrue(result['pages'][0]['image'].startswith('data:image/jpeg;base64,'))
 def test_rejects_cross_origin_and_invalid_file(self):
  self.assertEqual(self.post(b'bad',origin='https://unrelated.example')[0],403);self.assertEqual(self.post(b'bad')[0],422)
 def test_worker_busy_is_retryable(self):
  api.worker.acquire()
  try:self.assertEqual(self.post(b'bad')[0],429)
  finally:api.worker.release()
 def test_upload_parser_limits_and_missing_file(self):
  with self.assertRaises(ValueError):api.decode_upload(b'not multipart','application/pdf')
  with self.assertRaises(ValueError):api.decode_upload(b'--b--\r\n','multipart/form-data; boundary=b')
if __name__=='__main__':unittest.main()
