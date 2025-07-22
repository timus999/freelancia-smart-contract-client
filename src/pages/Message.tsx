
import { MessageCircle } from "lucide-react"

export default function Messages(){

    return (
         <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mb-2" />
        <p>No Messages yet.</p>
      </div>

    )
}