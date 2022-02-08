import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'

function Profile() {
  let { id } = useParams()
  let history = useHistory()
  const [userName, setUserName] = useState("")
  const [listOfPosts, setListOfPosts] = useState([])
  const { authState } = useContext(AuthContext) 

  useEffect(() => {
      axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
        setUserName(response.data.userName)
      })

      axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
        setListOfPosts(response.data)
      })

  })

  return (
    <div className='profilePageContainer'>
        <div className='basicInfo'>
          <h1>Username: {userName}</h1>
          {authState.userName === userName && (<button onClick={() => {history.push("/changePassword")}}> Change the password </button>)}
        </div>
        <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              <div
                className="body"
                onClick={() => {
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.userName}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </div>
  )
}

export default Profile

