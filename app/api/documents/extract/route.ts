import {NextRequest,NextResponse} from 'next/server';
import {execFile} from 'node:child_process';import path from 'node:path';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=35;
let active=0;
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');if(origin&&origin!==request.nextUrl.origin&&new URL(origin).host!==request.headers.get('host'))return NextResponse.json({error:'Use the document workspace on this server.'},{status:403});
 const length=Number(request.headers.get('content-length')||0);if(length>8_000_000)return NextResponse.json({error:'Choose a document under 6 MB.'},{status:413});
 if(active>=2)return NextResponse.json({error:'The local OCR worker is busy. Try again shortly.'},{status:429});
 active++;
 try{
  const body=await request.formData(),file=body.get('file');if(!(file instanceof File)||file.size>6_000_000||!file.size)return NextResponse.json({error:'Choose a non-empty PDF, PNG or JPEG under 6 MB.'},{status:400});
  const input={data:Buffer.from(await file.arrayBuffer()).toString('base64')};
  const data=await new Promise<Record<string,unknown>>((resolve,reject)=>{
   const child=execFile('/usr/bin/python3',[path.join(process.cwd(),'scripts/document-extract.py')],{timeout:30000,maxBuffer:18_000_000,env:{...process.env,OMP_THREAD_LIMIT:'1'}},(error,stdout)=>{
    try{const parsed=JSON.parse(stdout);if(parsed.error)reject(new Error(parsed.error));else if(error)reject(new Error('The document could not be processed within the preview limits.'));else resolve(parsed);}catch{reject(new Error('Document extraction failed. Try a smaller, clearly printed PDF or image.'));}
   });child.stdin?.end(JSON.stringify(input));
  });
  return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Document extraction failed.'},{status:422,headers:{'Cache-Control':'no-store'}});}finally{active--;}
}
