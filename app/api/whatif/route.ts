import {NextResponse} from "next/server";
import {runSimulation} from "../../../../lib/simulation";

export async function POST(req:Request){try{const b=await req.json();const current=runSimulation(String(b.policyText||""));const whatIf=runSimulation(String(b.policyText||""),Number(b.globalLimit));return NextResponse.json({current,whatIf})}catch(e:any){return NextResponse.json({success:false,error:e?.message||"What-if calculation failed."},{status:400})}}
