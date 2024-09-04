import { clerkMiddleware ,createRouteMatcher} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


 const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
 ])

 const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
 ])

export default clerkMiddleware((auth,req)=>{
    const {userId} = auth()
    const currentUrl = new URL(req.url)


    const isAccessingDashboard = currentUrl.pathname === "home"
    const isApiRequest = currentUrl.pathname.startsWith("/api") 
     
    // logged in case 
    if(userId && isPublicRoute(req)){
         return NextResponse.redirect(new URL("/home",req.url))
    }


    // not logged in and request for protected route

    if(!userId){
        if(!isPublicRoute(req) && isPublicApiRoute(req)){
             return NextResponse.redirect(new URL("/signin",(req.url)))
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/signin",(req.url)))
        }
    }

     NextResponse.next()
})

// matcher basically matches all the routes in it 

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};