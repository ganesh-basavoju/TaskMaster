import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { CircleUserRound } from "lucide-react";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const Profile = () => {
    const navigate = useNavigate();
  
    async function handleLogout() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
          method: "POST",
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Logout failed. Please try again.");
        }
  
        // After logging out and clearing the cookie, redirect to /login
        navigate("/login");
      } catch (error) {
        toast.error(error.message);
      }
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
        <CircleUserRound className="transition ease-in hover:cursor-pointer hover:stroke-green-500 stroke-green-500 w-10 h-10" />

        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default Profile;
  