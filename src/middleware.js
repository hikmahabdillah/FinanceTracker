import {NextResponse} from "next/server";

export default function mainMiddleware(request){
  const res = NextResponse.next();
  return res;
}