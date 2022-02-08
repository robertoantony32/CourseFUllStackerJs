import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from  'axios'
import { AuthContext } from '../helpers/AuthContext'

function Posts() {
  let { id } = useParams()
  const [postObject, setPostObject] = useState({})
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const { authState } = useContext(AuthContext) 

  let history = useHistory()


  useEffect (() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data)
    })
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data)
    })
  }, [])


  const addComment = () => {
    axios
    .post("http://localhost:3001/comments", 
    {commentBody: newComment, PostId: id}, 
    {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }
    )
    .then((response) => {
      if (response.data.error) {
        console.log(response.data.error)
      }else {
        const commentToAdd = {commentBody: newComment, userName: response.data.userName}
        setComments([...comments, commentToAdd])
        setNewComment("")
      }
    })
  }

   const deleteComment = (id) => {

    axios.delete(`http://localhost:3001/comments/${id}`, {headers: {
      accessToken: localStorage.getItem("accessToken")
    }}).then(() => {
      setComments(comments.filter((val) => {
        return val.id != id
      }))
    })

   }


  const deletePost = (id) => {
    axios.delete(`http://localhost:3001/posts/${id}`, {headers: {
      accessToken: localStorage.getItem("accessToken")
    }}).then(()=>{
      history.push("/")
    })
  }

  const editPost = (option) => {
    if (option === "title"){
      let newTitle = prompt("Enter New Title:")
      axios.put("http://localhost:3001/posts/title", { newTitle: newTitle, id: id, }, {headers: {
        accessToken: localStorage.getItem("accessToken")
      }})

      setPostObject({...postObject, title: newTitle})
    }else{
      let newText = prompt("Enter New Text:")
      axios.put("http://localhost:3001/posts/text", { newText: newText, id: id, }, {headers: {
        accessToken: localStorage.getItem("accessToken")
      }})

      setPostObject({...postObject, postText: newText})
    }
  }

  return (
    <div className='postPage'>
      <div className='leftSide'>
        <div className='post' id="individual">
        <div className='title' onClick={() => {
          if (authState.userName === postObject.userName){
              editPost("title")
          }}}>{postObject.title}</div>
        <div className='body' onClick={() => {if (authState.userName === postObject.userName){
              editPost("body")
          }}}>{postObject.postText}</div>
        <div className='footer'>{postObject.userName}
        {authState.userName === postObject.userName && (<button onClick={() => {deletePost(postObject.id)}}>Delete Post</button>)}
        </div>
        </div>
      </div>
      <div className='rightSide'>
        <div className='addCommentContainer'>
          <input type="text" 
          placeholder='Insert one comment...' 
          value={newComment} 
          onChange={(event)=> {
            setNewComment(event.target.value)
          }}/>
          <button onClick={addComment}>Add Coment</button>
        </div>
        <div className='listOfComments'>
          {comments.map((comment, key) => {
            return <div key={key} className='comment'>
              {comment.commentBody}
              <label> userName: {comment.userName}</label>
              {authState.userName === comment.userName && 
              <button onClick={() =>  {deleteComment(comment.id)} }> x </button>}
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Posts
