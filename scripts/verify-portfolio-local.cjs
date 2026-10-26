// Local-only browser verification. Starts and stops its own loopback server.
// PORTFOLIO_PLAYWRIGHT_PATH selects an already-installed Playwright module.
// PORTFOLIO_BROWSER selects an already-installed Chromium executable.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require(process.env.PORTFOLIO_PLAYWRIGHT_PATH || 'playwright');
const origin = 'http://127.0.0.1:3417';
const out = path.resolve('review');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3417'], {stdio:['ignore','pipe','pipe']});
let serverOutput='';
server.stdout.on('data',d=>serverOutput+=d); server.stderr.on('data',d=>serverOutput+=d);
let browser;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={origin,checks:[],consoleErrors:[],externalRequests:[]};
async function check(label,run) { await run(); report.checks.push(label); console.log('PASS '+label); }
(async()=>{
  await fs.mkdir(out,{recursive:true});
  let ready=false;
  for(let i=0;i<40;i++){
    if(server.exitCode!==null)throw new Error('Preview exited: '+serverOutput);
    try{ const r=await fetch(origin); if(r.ok){ready=true;break;} }catch{}
    await pause(250);
  }
  assert.ok(ready,'loopback server ready');
  browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_BROWSER,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>report.consoleErrors.push(e.message));
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(origin))report.externalRequests.push(r.url());});
  await check('homepage renders with one H1, four new projects and keyboard skip link',async()=>{
    assert.equal((await page.goto(origin)).status(),200);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('.work-row').count(),4);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').textContent(),'Skip to content');
    await page.locator(':focus').evaluate(e=>e.blur());
    await page.screenshot({path:path.join(out,'01-opening-desktop.png')});
  });
  await check('scroll changes the assembly and finishes before project details',async()=>{
    const first=await page.locator('.part-engineering').evaluate(e=>getComputedStyle(e).transform);
    const distance=await page.locator('.scroll-intro').evaluate(e=>e.offsetHeight-innerHeight);
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),distance*.46); await pause(180);
    await page.screenshot({path:path.join(out,'02-connections-desktop.png')});
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),distance*.85); await pause(180);
    assert.notEqual(await page.locator('.part-engineering').evaluate(e=>getComputedStyle(e).transform),first);
    assert.ok(Number(await page.locator('.chapter-final').evaluate(e=>getComputedStyle(e).opacity))>.95);
    await page.screenshot({path:path.join(out,'03-assembled-desktop.png')});
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'04-projects-desktop.png')});
  });
  await check('responsive homepage has no horizontal overflow at 375, 768 and 1440 pixels',async()=>{
    for(const width of [375,768,1440]){
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow at '+width);
    }
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await pause(120);
    await page.screenshot({path:path.join(out,'05-opening-mobile.png')});
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'06-projects-mobile.png')});
  });
  await page.setViewportSize({width:1440,height:1000});
  await check('Bench reacts to evidence and keeps unknown causes visible',async()=>{
    assert.equal((await page.goto(origin+'/work/bench')).status(),200);
    assert.equal(await page.locator('.hypothesis').count(),2);
    await page.getByLabel('Mechanical noise',{exact:true}).check();
    assert.match(await page.locator('.hypothesis').first().textContent(),/2\/2 observations matched/);
    await page.locator('#interactive-demo').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'07-bench.png')});
  });
  await check('Loadshift recomputes and reports an infeasible cap',async()=>{
    assert.equal((await page.goto(origin+'/work/loadshift')).status(),200);
    assert.equal(await page.locator('.schedule-list>div').count(),3);
    const slider=page.getByLabel('Hourly demand cap',{exact:false});
    await slider.focus();await slider.press('Home');await slider.press('ArrowRight');
    await page.getByRole('button',{name:'Optimise schedule'}).click();
    assert.match(await page.locator('.infeasible-result').textContent(),/No feasible schedule at 35 kW/);
    await slider.press('End');await page.getByRole('button',{name:'Optimise schedule'}).click();
    assert.equal(await page.locator('.schedule-list>div').count(),3);
    await page.locator('#interactive-demo').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'08-loadshift.png')});
  });
  await check('Relay blocks approval bypass, recovers from outage and deduplicates',async()=>{
    assert.equal((await page.goto(origin+'/work/relay')).status(),200);
    await page.getByRole('button',{name:'Attempt delivery'}).click();
    assert.match(await page.locator('.execution-log').textContent(),/blocked/);
    for(const name of ['Receive sample event','Approve event','Attempt delivery','Restore endpoint','Attempt delivery','Replay same event','Attempt delivery'])await page.getByRole('button',{name,exact:true}).click();
    assert.equal(await page.locator('.state-badge').textContent(),'completed');
    assert.match(await page.locator('.execution-log').textContent(),/Replay ignored/);
    assert.match(await page.locator('.execution-log').textContent(),/Duplicate delivery blocked/);
    await page.locator('#interactive-demo').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'09-relay.png')});
  });
  await check('Fieldnotes shows exact sources and abstains on unrelated questions',async()=>{
    assert.equal((await page.goto(origin+'/work/fieldnotes')).status(),200);
    assert.ok(await page.locator('.passage').count()>0);
    await page.getByRole('button',{name:'quantum banana',exact:true}).click();
    assert.equal(await page.locator('.passage').count(),0);
    assert.match(await page.locator('.empty-result').textContent(),/No supported passage/);
    await page.getByRole('button',{name:'unexpected restart',exact:true}).click();
    assert.ok(await page.locator('.passage').count()>0);
    await page.locator('#interactive-demo').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,'10-fieldnotes.png')});
  });
  await check('all four demos render without mobile horizontal overflow',async()=>{
    await page.setViewportSize({width:375,height:844});
    for(const slug of ['bench','loadshift','relay','fieldnotes']){
      await page.goto(origin+'/work/'+slug);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow in '+slug);
      assert.equal(await page.locator('h1').count(),1);
    }
  });
  await check('unknown project is 404 and no CV download is reintroduced',async()=>{
    assert.equal((await page.goto(origin+'/work/unknown')).status(),404);
    await page.goto(origin);
    assert.equal(await page.locator('a[href$=".pdf"],a[href*="CV.pdf"]').count(),0);
  });
  await check('reduced motion renders a compact final composition',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await page.goto(origin);await pause(150);
    assert.equal(await page.locator('.intro-sticky').evaluate(e=>getComputedStyle(e).position),'relative');
    assert.ok(Number(await page.locator('.chapter-final').evaluate(e=>getComputedStyle(e).opacity))>.95);
    await page.screenshot({path:path.join(out,'11-reduced-motion.png')});
  });
  await check('no-JavaScript visitors retain introduction, projects and contact',async()=>{
    const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
    await nojs.goto(origin);assert.equal(await nojs.locator('.work-row').count(),4);
    assert.ok(await nojs.locator('#contact a[href^="mailto:"]').count()>0);
    await nojs.close();
  });
  assert.deepEqual(report.consoleErrors,[]);
  assert.deepEqual(report.externalRequests,[]);
  report.result='passed';
})().catch(error=>{report.result='failed';report.error=error.stack;console.error(error);process.exitCode=1;}).finally(async()=>{
  if(browser)await browser.close();
  server.kill('SIGTERM');
  await fs.mkdir(out,{recursive:true});
  await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2)+'\n');
});
