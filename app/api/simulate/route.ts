import {NextResponse} from "next/server";
import {runSimulation} from "../../../../lib/simulation";

export async function POST(req:Request){try{const b=await req.json();return NextResponse.json(runSimulation(String(b.policyText||""),b.globalLimit))}catch(e:any){return NextResponse.json({success:false,error:e?.message||"Simulation failed."},{status:400})}}
