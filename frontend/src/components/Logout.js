import React from 'react'

export default function Logout(props) {
  return (
    <div>
       <button type="button" className="btn btn-danger" onClick={props.handleLogout}>Logout</button>
    </div>
  )
}
