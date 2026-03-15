import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"

export function AddWebsite() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default" className="rounded-lg cursor-pointer"><PlusIcon />Add website</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm rounded-lg space-y-2">
          <DialogHeader>
            <DialogTitle className="">Add Website</DialogTitle>
            <DialogDescription>
              Added website will be checked every 3 mins.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="website-1">Website Name</Label>
              <Input id="website-1" name="website" placeholder="Website"/>
            </Field>
            <Field>
              <Label htmlFor="url-1">Url</Label>
              <Input id="url-1" name="url" placeholder="www.yourwebsite.com"/>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
