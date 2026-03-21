"use client"

import { authClient } from "@repo/auth/client"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function Page() {

  // const router = useRouter()
  const [isloading, setIsLoading] = useState(false)

  // const form = useForm<signInValues>({
  //   resolver: zodResolver(signInSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   }
  // })
  
  // const onSubmit = async (data: signInValues) => {
  //   const { error } = await authClient.signIn.email({
  //     email: data.email,
  //     password: data.password,
  //   })

  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("sign In success");
  //     router.push("/dashboard")
  //   }
  // }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    })
    // setIsLoading(false)
  }
   
  return (
    <div className="flex w-full h-screen">

      <Button onClick={signInWithGoogle} disabled={isloading} className="mt-5 mx-auto my-auto">
        {
          isloading ? "Logging in...." : "Google"
        }
        </Button>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign in
          </Button>

        </form>
      </Form> */}

      
    </div>
  )
}