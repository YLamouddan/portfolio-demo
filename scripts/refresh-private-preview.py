#!/usr/bin/env python3
"""Snapshot an already-built portfolio and switch only its private Tailscale preview.

Dry-run by default. --apply creates an independent build snapshot, checks all
homepage assets on loopback, then starts/restarts the dedicated user service.
Source rebuilds never touch a running release. Previous releases are retained.
"""
import argparse,datetime,json,os,re,shutil,socket,subprocess,time,urllib.request,urllib.error,uuid
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT.parent/'portfolio-private-releases'
CURRENT=BASE/'current'
UNIT='portfolio-private-preview.service'
OLD='portfolio-tailscale-preview-20261025.service'
BIND='100.112.32.62'
PORT=3418

def run(*args,check=True):
 return subprocess.run(args,check=check,text=True,capture_output=True)
def request(url):
 with urllib.request.urlopen(url,timeout=5) as response:return response.status,response.headers.get('Content-Type',''),response.read()
def verify(url,wait=False):
 for attempt in range(40 if wait else 1):
  try:
   code,mime,body=request(url+'/');assert code==200 and 'text/html' in mime
   break
  except (OSError,AssertionError):
   if not wait or attempt==39:raise
   time.sleep(.2)
 html=body.decode();assets=sorted(set(re.findall(r'(?:href|src)="([^"?]+(?:\.css|\.js|\.woff2?))(?:\?[^" ]*)?"',html)))
 local=[asset for asset in assets if asset.startswith('/')]
 assert any(asset.endswith('.css') for asset in local),'No stylesheet declared'
 for asset in local:
  status,content_type,data=request(url+asset)
  assert status==200 and len(data)>0,(asset,status)
  assert 'text/html' not in content_type,(asset,'HTML returned instead of asset')
  if asset.endswith('.css'):assert 'text/css' in content_type,(asset,content_type)
 return {'html_status':code,'local_assets_checked':len(local),'css_checked':sum(a.endswith('.css') for a in local),'new_signal_intro':'data-portfolio-version="business-automation"' in html or 'Too much data.' in html}
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--apply',action='store_true');args=parser.parse_args()
 build=ROOT/'.next';assert (build/'BUILD_ID').is_file(),'Run npm run build first'
 plan={'apply':args.apply,'build_id':(build/'BUILD_ID').read_text().strip(),'snapshot_root':str(BASE),'url':f'http://{BIND}:{PORT}','unit':UNIT,'previous_releases_retained':True}
 if not args.apply:print(json.dumps(plan,indent=2));return
 BASE.mkdir(parents=True,exist_ok=True)
 previous=CURRENT.resolve() if CURRENT.is_symlink() else None
 stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')+'-'+uuid.uuid4().hex[:6]
 release=BASE/stamp;release.mkdir()
 shutil.copytree(build,release/'.next',ignore=shutil.ignore_patterns('cache'))
 if previous and (previous/'.next/static').is_dir():
  # Carry forward old content-addressed assets for tabs opened before this switch.
  for source in (previous/'.next/static').rglob('*'):
   if source.is_file():
    target=release/'.next/static'/source.relative_to(previous/'.next/static')
    if not target.exists():target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,target)
 shutil.copytree(ROOT/'public',release/'public')
 for name in ('package.json','package-lock.json','next.config.mjs'):shutil.copy2(ROOT/name,release/name)
 if (ROOT/'scripts/document-extract.py').is_file():
  (release/'scripts').mkdir(exist_ok=True);shutil.copy2(ROOT/'scripts/document-extract.py',release/'scripts/document-extract.py')
 (release/'node_modules').symlink_to((ROOT/'node_modules').resolve(),target_is_directory=True)
 with socket.socket() as sock:sock.bind(('127.0.0.1',0));probe_port=sock.getsockname()[1]
 process=subprocess.Popen(['/usr/bin/node',str(release/'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',str(probe_port)],cwd=release,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 try:candidate=verify(f'http://127.0.0.1:{probe_port}',wait=True)
 finally:
  process.terminate()
  try:process.wait(timeout=5)
  except subprocess.TimeoutExpired:process.kill();process.wait()
 assert candidate['new_signal_intro'],'Candidate does not contain the approved Signal introduction'
 # Install only this task's dedicated user service. No public listener or boot enable.
 config=Path.home()/'.config/systemd/user';config.mkdir(parents=True,exist_ok=True)
 unit=f'''[Unit]\nDescription=Private portfolio preview from an independent build snapshot\n\n[Service]\nType=simple\nWorkingDirectory={CURRENT}\nExecStart=/usr/bin/node {CURRENT}/node_modules/next/dist/bin/next start --hostname {BIND} --port {PORT}\nRestart=on-failure\nRestartSec=2\n\n[Install]\nWantedBy=default.target\n'''
 (config/UNIT).write_text(unit)
 temp=BASE/('current-'+uuid.uuid4().hex);temp.symlink_to(release,target_is_directory=True);os.replace(temp,CURRENT)
 run('systemctl','--user','daemon-reload')
 old_active=run('systemctl','--user','is-active',OLD,check=False).returncode==0
 if old_active:run('systemctl','--user','stop',OLD)
 try:
  run('systemctl','--user','restart',UNIT)
  verified=verify(f'http://{BIND}:{PORT}',wait=True)
 except Exception:
  if previous:
   replacement=BASE/('rollback-'+uuid.uuid4().hex);replacement.symlink_to(previous,target_is_directory=True);os.replace(replacement,CURRENT);run('systemctl','--user','restart',UNIT,check=False)
  elif old_active:run('systemctl','--user','stop',UNIT,check=False);run('systemctl','--user','start',OLD,check=False)
  raise
 receipt={**plan,'release':str(release),'previous_release':str(previous) if previous else None,'candidate':candidate,'live':verified}
 receipts=ROOT/'review/releases';receipts.mkdir(parents=True,exist_ok=True)
 target=receipts/(stamp+'.json');target.write_text(json.dumps(receipt,indent=2)+'\n');os.chmod(target,0o600)
 print(json.dumps(receipt,indent=2))
if __name__=='__main__':main()
