import React from 'react'

export default function QuestionHead(props) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
            {props.heading}
            <button className="btn btn-danger btn-sm" aria-label="Remove">X</button>
    </li>
  )
}
