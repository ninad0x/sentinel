import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "@/lib/utils"
import { validateWebsite } from "@/lib/validateWebsiteAction"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"

type ValidationResult = {
  valid: boolean
  reachable: boolean
  message: string
  status: number | null | undefined
} | null

export function AddWebsite({ isactive } : {isactive: boolean}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [validation, setValidation] = useState<ValidationResult>(null)
  const [validating, setValidating] = useState(false)   // for loading
  const queryClient = useQueryClient()

  const debouncedUrl = useDebounce(url, 700)

  useEffect(() => {
    if (!debouncedUrl.trim()) { 
      setValidation(null)
      return
    }
    setValidating(true)
    validateWebsite(debouncedUrl).then((r) => {
      setValidation(r)
      setValidating(false)
    })
  }, [debouncedUrl])

  const isChecking = url !== debouncedUrl || validating

  const reset = () => {
    setName("")
    setUrl("")
    setValidation(null)
    setValidating(false)
  }

  const handleSubmit = async () => {
    if (!name.trim() || !validation?.reachable) return
    await fetch("/api/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    })
    queryClient.invalidateQueries({ queryKey: ["website"] })
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { 
      setOpen(o)
      if (!o) reset() }}>
      <DialogTrigger asChild>
        <Button disabled={isactive} className="rounded-xl cursor-pointer active:scale-95"><PlusIcon /> Add website</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm rounded-lg space-y-2">
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
          <DialogDescription>Your website will be checked every 3 mins.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Website Name</Label>
            <Input id="name" placeholder="My Website" value={name}
              onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <Label htmlFor="url">URL</Label>
            <Input id="url" placeholder="www.yourwebsite.com" value={url}
              onChange={(e) => { setUrl(e.target.value); setValidation(null) }}
              className={cn(validation && !validation?.reachable && "border-red-500")} />

            {url && (isChecking ? (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Checking...
              </p>
            ) : validation && (
              <p className={cn("text-sm", validation.reachable ? "text-green-500" : "text-red-500")}>
                {validation.message}
              </p>
            ))}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button className="active:scale-95" disabled={!name.trim() || isChecking || !validation?.reachable} onClick={handleSubmit}>
            {!name.trim() ? "Enter a name" : !url.trim() ? "Enter a URL" : isChecking ? "Checking..." : !validation?.reachable ? "Invalid URL" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}