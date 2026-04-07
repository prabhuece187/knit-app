import { useAppSelector } from "@/store/Store";
import { useGetProfessionalByUserIdQuery } from "./api/ProfessionalApi";
import Profile from "./Profile";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProfileParent() {

    const authUserId = useAppSelector((state) => state.auth.user?.id)
    const navigate = useNavigate()

    const { data, isLoading } = useGetProfessionalByUserIdQuery(
        authUserId,
        { skip: !authUserId },
    )

    return (
        <>{isLoading ?
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div> :
            <>
                <Button className="mx-6" onClick={() => navigate(`/professionals/${data?.id}`)}>
                    Edit Profile
                </Button>
                <Profile />
            </>}
        </>
    )
}