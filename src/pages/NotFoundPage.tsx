import { Link } from "react-router-dom"

export default function NotFoundPage() {

  return (
    <div className="flex flex-col p-40 items-center text-center gap-8">
      <h1 className="text-5xl">This Page doesn't exist ❌</h1>
      <Link to={"/"}><button className="text-3xl bg-secondary px-4 py-3 text-black font-bold rounded-xl hover:bg-primary transition-all duration-300">Go to the home page</button></Link>
    </div>
  )
}