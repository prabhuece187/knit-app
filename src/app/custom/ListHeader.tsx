import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function ListHeader({ name }: { name: string }){
    return (
        <>
            <div className="h-12 w-full rounded-lg mb-2">
                <div className="flex w-full items-center justify-between bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 p-2">
                        <h1> {name} </h1>
                    </div>
                    <div className="flex items-center gap-2 p-2">
                        <Button variant="outline" size="sm">
                                <Link to={`/add-${name}`}> Add {name} </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}