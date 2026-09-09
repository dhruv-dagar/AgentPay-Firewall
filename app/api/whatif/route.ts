import {NextResponse} from "next/server";
import {run} from "../simulate/route";
export async function POST(req:Request){try{const b=await req.json();const current=run(String(b.policyText||""));const whatIf=run(String(b.policyText||""),Number(b.globalLimit));return NextResponse.json({current,whatIf})}catch(e:any){return NextResponse.json({success:false,error:e?.message||"What-if calculation failed."},{status:400})}}
