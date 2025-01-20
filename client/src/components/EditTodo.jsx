import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditIcon from "@/icons/EditIcon";
import { useState } from "react";

export default function EditTodo({ title, id, handleUpdate }) {
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [open, setOpen] = useState(false); // State to control dialog visibility

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target);
    handleUpdate(formData); // Call the update function
    setOpen(false); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EditIcon className="iconHover" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={onSubmit} // Handle form submission
        >
          <input type="hidden" value={id} name="id" />
          <Label htmlFor="title">Previous Todo</Label>
          <Input
            id="title"
            name="title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="col-span-3"
          />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
