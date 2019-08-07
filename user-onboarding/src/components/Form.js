import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

const OnboardingForm = ({ errors, touched, values, handleSubmit, status }) => {
    const [users, setUsers] = useState([]);
    console.log(users);

    useEffect(() => {
        if (status) {
            setUsers([...users, status]);
        }
    }, [status]);

    return(
        <div className="user-form">
            <h1>User Onboarding Form</h1>
            <Form>
                <Field type="text" name="name" placeholder="Name" /> 
                {touched.name && errors.name && (<p className="error">{errors.name}</p>
                )}

                <Field type="email" name="email" placeholder="Email" />
                {touched.email && errors.email && (<p className="error">{errors.email}</p>
                )}

                <Field type="password" name="password" placeholder="password" />
                {touched.password && errors.password && (<p className="error">{errors.password}</p>
                )}

                <Field component="select" className="role-select" name="role">
                    <option>Please Choose a Role</option>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Aid">Aid</option>
                </Field>

                <label className="checkbox-container">
                    Terms of Service
                    <Field type="checkbox" name="terms" checked={values.terms} />
                    <span className="checkmark" />
                </label>

                <button type="submit">Submit</button>
            </Form>

            {users.map(user => (
                <div className="user-card">
                    <p key={user.id}>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            ))}
        </div>
    );
};

const FormikOnboardingForm = withFormik({
    mapPropsToValues({ name, email, password, role, terms }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            role: role,
            terms: terms || false
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required("Name required"),
        email: Yup.string().required("Email required"),
        password: Yup.string().min(6).required("Password much be at least 6 characters long"),
        // role: Yup.array().required(),
        terms: Yup.bool().oneOf([true], "Must select terms")
    }),

    handleSubmit(values, { setStatus }) {
        axios
            .post("https://reqres.in/api/users", values)
            .then(res => {
                setStatus(res.data);
            })
            .catch(err => console.log(err));
    }
})(OnboardingForm);


export default FormikOnboardingForm;