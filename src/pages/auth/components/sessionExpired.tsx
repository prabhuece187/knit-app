import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { removeTokensAndUser, setSessionExpired } from "@/slice/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/Store";


export default function SessionExpired() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const sessionExpired = useAppSelector((state) => state.auth.sessionExpired);

  const closeModal = () => {
    dispatch(setSessionExpired(false));
    dispatch(removeTokensAndUser());
    navigate("/");
  };

  return (
    <Dialog open={sessionExpired} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Session Expired</DialogTitle>
          <DialogDescription>
            You will be redirected to the Login page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeModal} variant="secondary">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}