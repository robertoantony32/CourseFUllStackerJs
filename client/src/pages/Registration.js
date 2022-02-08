import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as Yup from 'yup'
import axios from 'axios'

function Registration() {
    const initialValues = {
        userName: "",
        passWord: "",
    }

    const validationSchema = Yup.object().shape({
        userName: Yup.string().min(3).max(15).required(),
        passWord: Yup.string().min(4).max(20).required(), 
    })

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then(() => {
            console.log(data);
        })
    }


  return (
    <div>
      <Formik initialValues={initialValues}
         onSubmit={onSubmit}
         validationSchema={validationSchema}>
            <Form className='formContainer'>
                <label>userName: </label>
                <ErrorMessage name="userName" component="span"/>
                <Field
                    id="inputCreatePost"
                    name="userName"
                    placeholder="your Name"/>
                <label>passWord: </label>
                <ErrorMessage name="passWord" component="span"/>
                <Field
                    id="inputCreatePost"
                    type="password"
                    name="passWord"
                    placeholder="your passWord"/>
                <button type="submit">Register</button>
            </Form>
        </Formik>
    </div>
  )
}

export default Registration
