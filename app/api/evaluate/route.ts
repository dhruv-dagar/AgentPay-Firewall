import {NextResponse} from "next/server";
import {compilePolicy,evaluate} from "../../../lib/policy";
export async function POST(req:Request){try{const b=await req.json();const policy=compilePolicy(String(b.policyText||""));if(!b.transaction)return NextResponse.json({success:false,error:"Transaction is required."},{status:400});return NextResponse.json({...evaluate(b.transaction,policy,Number(b.monthlySpend||0)),policy,timestamp:new Date().toISOString()})}catch(e:any){return NextResponse.json({success:false,error:e?.message||"Evaluation failed."},{status:400})}}
