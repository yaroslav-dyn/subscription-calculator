import { Link } from '@tanstack/react-router'

const NotFound = () => {
  return (
    <div className="base__page-bg px-4">
      <main className="min-h-screen flex flex-col justify-center items-center gap-y-2">
        <h1 className="text-center text-4xl font-bold text-white mb-2">
          <div>404</div>
          <div> Page Not Found</div>
        </h1>
        <Link className="text-white" to="/">
          Return to Home
        </Link>
      </main>
    </div>
  )
}

export default NotFound
