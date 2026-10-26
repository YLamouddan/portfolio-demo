#!/usr/bin/env python3
"""Prepare the private local English OCR dataset, verifying its pinned SHA256."""
import argparse,hashlib,json,os,tempfile,urllib.request
from pathlib import Path
URL='https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata'
SHA='7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2'
TARGET=Path('/opt/worktrees/portfolio-ocr-runtime/tessdata/eng.traineddata')
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--apply',action='store_true');args=parser.parse_args()
 import fitz,PIL
 if TARGET.exists() and hashlib.sha256(TARGET.read_bytes()).hexdigest()==SHA:print(json.dumps({'ready':True,'engine':'PyMuPDF/Tesseract','dataset':str(TARGET),'sha256':SHA}));return
 if not args.apply:print(json.dumps({'ready':False,'action':'Download and verify English dataset','apply':False}));return
 data=urllib.request.urlopen(URL,timeout=30).read(6_000_000)
 if hashlib.sha256(data).hexdigest()!=SHA:raise SystemExit('OCR dataset checksum changed; inspect upstream before accepting a new dataset.')
 TARGET.parent.mkdir(parents=True,exist_ok=True)
 with tempfile.NamedTemporaryFile(dir=TARGET.parent,delete=False) as f:f.write(data);temp=Path(f.name)
 os.replace(temp,TARGET);print(json.dumps({'ready':True,'dataset':str(TARGET),'sha256':SHA}))
if __name__=='__main__':main()
