import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Header({ name }: { name: string }){
    return (
        <>
            {/* <div className="flex flex-1 flex-col"> */}
                <div className="bg-muted/50 aspect-video h-12 w-full rounded-lg">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2 p-2">
                            <h1> {name} </h1>
                        </div>
                        <div className="flex items-center gap-2 p-2">
                            <Button variant="outline" size="sm">
                                 <Link to={`/add-${name}`}> add {name} </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
        </>
    )
}