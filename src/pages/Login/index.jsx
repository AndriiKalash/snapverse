import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchLoginUser, selectorAuthUser } from "../../redux/auth/slice";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import styles from "./Login.module.scss";

const schema = yup.object({
  email: yup.string().email('Invalid email').required('E-mail is required'),
  password: yup.string().min(5, 'Minimum 5 symbols!').required('password is Required'),
});


export const Login = () => {
 
  const {isAuth} = useSelector(selectorAuthUser);
  const dispatch = useDispatch();

  const {register, handleSubmit,formState:{ errors }} = useForm({
    resolver: yupResolver(schema),
    mode: "all",//onBlur
  });

  const onSubmit = (value) => {
    dispatch(fetchLoginUser(value))
    .then((res)=>window.localStorage.setItem("token", res.payload.token))
    .catch((error)=> {
      alert('Faild to login');
      throw new Error(error);
    })
  } ;

  if (isAuth) {
    return <Navigate to={"/"}/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
      Login to account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("email")}
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField 
        {...register("password")}
        className={styles.field} 
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        label="Password" 
        fullWidth 
      />
      <Button type="submit" size="large" variant="contained" fullWidth>
        Enter
      </Button>
      </form>
      
    </Paper>
  );
};
