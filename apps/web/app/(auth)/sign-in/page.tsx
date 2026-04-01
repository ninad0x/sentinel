"use client"

import { authClient } from "@repo/auth/client"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function Page() {

  const [isloading, setIsLoading] = useState(false)

  const signInWithGoogle = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    })
  }
   
  return (
    <div className="flex w-full h-screen">

      <Button onClick={signInWithGoogle} disabled={isloading} className="mt-5 mx-auto my-auto">
        {
          isloading ? "Logging in...." : "Google"
        }
        </Button>

    </div>
  )
}