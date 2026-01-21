
 
import { Button } from "../Components/ui/button"
import { LuPackage } from "react-icons/lu"
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Components/ui/card"
import { Input } from "../Components/ui/input"
import { Label } from "../Components/ui/label"
 
const Login=()=> {
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    const handleLogin=(e: React.FormEvent)=>{
        e.preventDefault();
        navigate('/dashboard')
    }
 
  return (
     <div className="fixed inset-0 bg-[#020617] overflow-hidden flex items-center justify-center max-sm:px-4">
 
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
 
      <div className="absolute left-0 top-1/5 w-[330px] h-[400px] bg-cyan-300/20 rounded-full blur-3xl max-sm:hidden" />
      <div className="absolute right-0 bottom-1/4 w-[330px] h-[350px] bg-purple-400/16 rounded-full blur-3xl max-sm:hidden" />
   
    <Card className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#061220]/80 backdrop-blur-xl shadow-[0_0_15px_rgba(37,181,204,0.35),0_0_60px_rgba(37,181,204,0.25)] text-white p-16 max-sm:p-6">
   <div className="absolute -top-7 -right-7
    w-23 h-23
    rounded-xl
    border border-cyan-400/30  
    backdrop-blur-xl
    shadow-[0_0_20px_rgba(56,189,248,0.25),inset_0_0_16px_rgba(56,189,248,0.15)]
  "/>
     
      <CardHeader className="flex flex-col items-center text-center space-y-1 relative transform -translate-y-6">
        <div
          className="
            w-16 h-16
            rounded-xl
            bg-gradient-to-br from-cyan-400 to-purple-500
            flex items-center justify-center
            shadow-lg
            transform transition-transform duration-300
            hover:rotate-12 hover:scale-110
          "
        >
          <LuPackage className="w-8 h-8 text-black" />
        </div>
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent relative transform translate-y-1">DMS Portal</CardTitle>
        <CardDescription className=" -mt-3 text-gray-400 relative transform translate-y-1">
          Distributor Management System
        </CardDescription>
      </CardHeader>
      <CardContent>
         
        <form className="space-y-5"  onSubmit={handleLogin}>
 
          {/* Email */}
          <div className="space-y-2 -ml-10 max-sm:ml-0">
            <Label className="text-gray-300 text-left -ml-2  text-base">Email Address</Label>
            <Input
              type="email"
              placeholder="distributor@example.com"
              required
              className="
                w-93 h-12
                -ml-3
                bg-[#020616]
                border border-cyan-400/30
                text-gray-300
                placeholder:text-gray-500
                focus:border-cyan-400
                focus-visible:ring-cyan-500/40
                 max-sm:w-full
                 max-sm:ml-0
              "
            />
          </div>
            {/* Password */}
          <div className="space-y-2 relative -ml-10 max-sm:ml-0">
            <Label className="text-gray-300 text-left -ml-2 text-base max-sm:ml-0">
              Password
            </Label>
 
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="
              w-93 h-12
              rounded-sm
                bg-[#020616]
                border border-cyan-400/30
                pr-12
                -ml-3
                text-gray-200
                placeholder:text-gray-500
                focus:border-cyan-400
                focus-visible:ring-cyan-400/40
                 max-sm:w-full
                 max-sm:ml-0
              "
            />
            {showPassword ? (
              <FaRegEyeSlash
                onClick={() => setShowPassword(false)}
                className="
                  absolute right-1 top-[53px]
                  w-5 h-5
                  cursor-pointer
                  text-gray-400
                  -mr-8
                  -mt-2
                "
              />
            ) : (
              <FaRegEye
                onClick={() => setShowPassword(true)}
                className="
                  absolute right-3 top-[53px]
                  w-5 h-5
                  cursor-pointer
                  -mr-10
                  -mt-2
                  max-sm:mr-0
                "
              />
            )}
          </div>
           
        <Button
          type="submit"
          className="    
            w-93 h-11
            bg-gradient-to-r from-cyan-400 to-purple-500
            text-black
            font-semibold
           transition-all duration-200 ease-out
    hover:-translate-y-[1px]
    hover:shadow-[0_0_18px_2px_rgba(34,211,238,0.35)]
            hover:opacity-90
            -ml-13 max-sm:w-full
    max-sm:ml-0
          "
        >
          Sign In →
        </Button>
        </form>
      </CardContent>
       <CardFooter className="flex-col gap-2">
 <p className="text-xs text-gray-400 text-center">
          Protected by enterprise-grade security
        </p>
      </CardFooter>
      <div className="absolute -bottom-5 -left-5
    w-17 h-17
    rounded-xl
    border border-purple-100/13  
    backdrop-blur-xl
    shadow-[0_0_20px_rgba(168,85,247,0.25),inset_0_0_16px_rgba(168,85,247,0.15)]
  "/>
    </Card>
    </div>
  )
}
export default Login
 
 
