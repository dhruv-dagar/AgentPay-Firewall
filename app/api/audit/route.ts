import {NextResponse} from "next/server";
const store=globalThis as typeof globalThis & {__agentPayAudit?:any[]};
function events(){if(!store.__agentPayAudit)store.__agentPayAudit=[];return store.__agentPayAudit}
export async function GET(){return NextResponse.json({success:true,events:events()})}
export async function POST(req:Request){try{const b=await req.json();const e={id:crypto.randomUUID(),timestamp:new Date().toISOString(),event:"FINANCIAL_CONTROL_EVENT",transaction:b.transaction||null,firewall:b.firewall||null,humanApproved:Boolean(b.humanApproved),execution:b.execution||null};const list=events();list.unshift(e);if(list.length>100)list.length=100;return NextResponse.json({success:true,event:e})}catch(e:any){return NextResponse.json({success:false,error:e?.message||"Audit write failed."},{status:400})}}
