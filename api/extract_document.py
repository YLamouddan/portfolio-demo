"""Vercel Python handler for Folio; the same extraction core serves local previews."""
from http.server import BaseHTTPRequestHandler
from email.parser import BytesParser
from email.policy import default
from pathlib import Path
from urllib.parse import urlsplit
import importlib.util,json,threading

spec=importlib.util.spec_from_file_location('folio_extractor',Path(__file__).resolve().parents[1]/'scripts/document-extract.py')
extractor=importlib.util.module_from_spec(spec);spec.loader.exec_module(extractor)
worker=threading.BoundedSemaphore(1)
MAX_BODY=4_000_000
MAX_FILE=3_500_000

def decode_upload(body,content_type):
 if not content_type.lower().startswith('multipart/form-data;'):
  raise ValueError('Choose a PDF, PNG or JPEG using the document workspace.')
 message=BytesParser(policy=default).parsebytes(('Content-Type: '+content_type+'\r\nMIME-Version: 1.0\r\n\r\n').encode()+body)
 if not message.is_multipart():raise ValueError('The document upload is incomplete.')
 for part in message.iter_parts():
  if part.get_param('name',header='content-disposition')=='file':
   data=part.get_payload(decode=True)
   if not data or len(data)>MAX_FILE:raise ValueError('Choose a non-empty document under 3.5 MB.')
   return data
 raise ValueError('Choose a document before extracting.')

class handler(BaseHTTPRequestHandler):
 def reply(self,status,payload):
  data=json.dumps(payload).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 def do_GET(self):self.reply(405,{'error':'Choose a document in the Folio workspace.'})
 def do_POST(self):
  origin=self.headers.get('origin')
  if origin and urlsplit(origin).netloc!=self.headers.get('host'):
   self.reply(403,{'error':'Use the document workspace on this website.'});return
  try:length=int(self.headers.get('content-length','0'))
  except ValueError:length=0
  if length<=0 or length>MAX_BODY:
   self.reply(413,{'error':'Choose a non-empty document under 3.5 MB.'});return
  if not worker.acquire(blocking=False):
   self.reply(429,{'error':'The OCR worker is busy. Try again shortly.'});return
  try:
   data=decode_upload(self.rfile.read(length),self.headers.get('content-type',''))
   result=extractor.extract(data)
   if len(json.dumps(result).encode())>4_000_000:raise ValueError('This document produces too much output. Try a smaller or clearer document.')
   self.reply(200,result)
  except ValueError as error:self.reply(422,{'error':str(error)[:250]})
  except Exception:self.reply(422,{'error':'Document extraction failed. Try a smaller, clearly printed PDF or image.'})
  finally:worker.release()
