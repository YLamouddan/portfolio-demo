// Starts a temporary loopback-only server; leaves the user's Tailscale preview alone.
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{spawn}=require('node:child_process');
const {chromium}=require(process.env.PORTFOLIO_PLAYWRIGHT_PATH||'playwright');
const origin='http://127.0.0.1:3417',out=path.resolve('review/client-revision');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3417'],{stdio:['ignore','pipe','pipe']});
let logs='',browser;server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const report={checks:[],errors:[],externalRequests:[]};
async function check(label,run){await run();report.checks.push(label);console.log('PASS '+label);}
(async()=>{
 await fs.mkdir(out,{recursive:true});let ready=false;
 for(let i=0;i<50;i++){if(server.exitCode!==null)throw Error(logs);try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await pause(200);}assert.ok(ready);
 browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_BROWSER,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900},colorScheme:'dark'}),page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(origin))report.externalRequests.push(r.url());});
 await check('new visitor follows browser dark preference, with accessible controls',async()=>{
  assert.equal((await page.goto(origin)).status(),200);await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.documentElement.classList.contains('dark'));
  assert.equal(await page.getByRole('combobox',{name:'Appearance',exact:true}).inputValue(),'system');
  assert.equal(await page.locator('.work-row').count(),4);assert.equal(await page.locator('h1').count(),1);
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');await page.locator(':focus').evaluate(e=>e.blur());
  assert.equal(await page.locator('.portfolio').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(16, 19, 27)');
  await page.screenshot({path:path.join(out,'01-dark-opening.png')});
 });
 await check('real mouse-wheel scrolling moves cards and changes the headline',async()=>{
  const initial=await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform);
  await page.mouse.move(900,400);await page.mouse.wheel(0,1000);await pause(250);
  assert.notEqual(await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform),initial);
  assert.ok(await page.evaluate(()=>scrollY>300));
  const distance=await page.locator('.scroll-intro').evaluate(e=>e.offsetHeight-innerHeight);
  await page.evaluate(y=>scrollTo({top:y*.85,behavior:'instant'}),distance);await pause(150);
  assert.ok(Number(await page.locator('.chapter-final').evaluate(e=>getComputedStyle(e).opacity))>.95);
  await page.screenshot({path:path.join(out,'02-connected-dark.png')});
 });
 await check('manual light/dark settings persist; System resumes live browser detection',async()=>{
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.getByRole('combobox',{name:'Appearance',exact:true}).selectOption('light');
  assert.equal(await page.locator('.portfolio').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(245, 247, 250)');
  await page.reload();await page.waitForFunction(()=>document.querySelector('select[aria-label="Appearance"]').value==='light');
  assert.equal(await page.getByRole('combobox',{name:'Appearance',exact:true}).inputValue(),'light');
  await page.screenshot({path:path.join(out,'03-light-opening.png')});
  await page.getByRole('combobox',{name:'Appearance',exact:true}).selectOption('system');await page.emulateMedia({colorScheme:'light'});
  await page.waitForFunction(()=>document.documentElement.classList.contains('light'));
  await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.documentElement.classList.contains('dark'));
 });
 await check('short mobile view keeps genuine scroll animation and no horizontal overflow',async()=>{
  await page.setViewportSize({width:390,height:600});await page.goto(origin);await pause(100);
  assert.equal(await page.locator('.intro-sticky').evaluate(e=>getComputedStyle(e).position),'sticky');
  assert.ok(await page.locator('.scroll-intro').evaluate(e=>e.offsetHeight>innerHeight*2));
  const initial=await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform);
  await page.mouse.wheel(0,600);await pause(200);
  assert.notEqual(await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform),initial);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:path.join(out,'04-short-mobile-scroll.png')});
 });
 await check('reduced motion is honoured and explicit On/Off choices work and persist',async()=>{
  await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto(origin);
  await page.waitForFunction(()=>document.querySelector('.scroll-intro').dataset.preferencesReady==='true');
  assert.equal(await page.locator('.scroll-intro').getAttribute('data-motion'),'off');
  assert.equal(await page.locator('.intro-sticky').evaluate(e=>getComputedStyle(e).position),'relative');
  await page.getByRole('combobox',{name:'Scroll animation',exact:true}).selectOption('on');
  assert.equal(await page.locator('.intro-sticky').evaluate(e=>getComputedStyle(e).position),'sticky');
  const before=await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform);
  await page.mouse.wheel(0,1000);await pause(200);
  assert.notEqual(await page.locator('.card-enquiry').evaluate(e=>getComputedStyle(e).transform),before);
  await page.reload();await page.waitForFunction(()=>document.querySelector('select[aria-label="Scroll animation"]').value==='on');
  assert.equal(await page.getByRole('combobox',{name:'Scroll animation',exact:true}).inputValue(),'on');
  await page.getByRole('combobox',{name:'Scroll animation',exact:true}).selectOption('off');
  assert.equal(await page.locator('.scroll-intro').getAttribute('data-motion'),'off');
  await page.getByRole('combobox',{name:'Scroll animation',exact:true}).selectOption('system');await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>document.querySelector('.scroll-intro').dataset.motion==='on');
 });
 await check('quote recalculates and invalidates an old prepared proposal',async()=>{
  assert.equal((await page.goto(origin+'/work/quotes')).status(),200);
  await page.getByRole('checkbox',{name:/Appointment booking/}).check();
  assert.match(await page.locator('.quote-total').textContent(),/1,650/);
  await page.getByRole('button',{name:'Prepare proposal',exact:true}).click();assert.ok(await page.getByRole('status').count());
  await page.getByRole('checkbox',{name:/Website copy/}).check();assert.equal(await page.getByRole('status').count(),0);
  await page.locator('#interactive-demo').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'05-quotes-dark.png')});
 });
 await check('booking confirms a sample appointment then disables the occupied time',async()=>{
  assert.equal((await page.goto(origin+'/work/booking')).status(),200);
  await page.getByRole('button',{name:'09:00',exact:true}).click();await page.getByRole('button',{name:'Confirm sample booking',exact:true}).click();
  assert.match(await page.locator('.booking-message').textContent(),/Booked for Alex/);
  assert.equal(await page.getByRole('button',{name:'09:00 unavailable',exact:true}).isDisabled(),true);
  await page.getByLabel('Choose a service').selectOption('planning');
  assert.equal(await page.getByRole('button',{name:'09:30 unavailable',exact:true}).isDisabled(),true);
 });
 await check('portal approval belongs to the reviewed version',async()=>{
  assert.equal((await page.goto(origin+'/work/portal')).status(),200);
  await page.getByRole('button',{name:'Approve version 2',exact:true}).click();assert.match(await page.locator('.portal-progress').textContent(),/2 of 3/);
  await page.getByRole('button',{name:'Add a new sample version',exact:false}).click();
  assert.match(await page.locator('.portal-progress').textContent(),/1 of 3/);
  assert.ok(await page.getByRole('button',{name:'Approve version 3',exact:true}).isEnabled());
 });
 await check('support gives a sourced suggestion and hands unknown policies to a person',async()=>{
  assert.equal((await page.goto(origin+'/work/support')).status(),200);
  assert.match(await page.locator('.support-source').textContent(),/Delivery policy/);
  await page.getByRole('button',{name:'What is your warranty?',exact:true}).click();
  assert.match(await page.locator('.support-result h3').textContent(),/Hand over to a person/);
  assert.equal(await page.locator('.support-source').count(),0);
 });
 await check('all client demos fit mobile and no CV download or public requests appear',async()=>{
  await page.setViewportSize({width:375,height:844});
  for(const slug of ['quotes','booking','portal','support']){await page.goto(origin+'/work/'+slug);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),slug+' overflow');}
  await page.goto(origin);assert.equal(await page.locator('a[href$=".pdf"]').count(),0);
  await page.screenshot({path:path.join(out,'06-mobile-dark.png')});
 });
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalRequests,[]);report.result='passed';
})().catch(e=>{report.result='failed';report.error=e.stack;console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill('SIGTERM');await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2)+'\n');});
