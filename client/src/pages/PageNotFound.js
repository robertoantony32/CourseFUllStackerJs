import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div>
      <h1>
          Page not found :(
      </h1>
      <h3>
          Go to the Home page: <Link to="/">Home Page</Link>
      </h3>
    </div>
  )
}

export default PageNotFound
