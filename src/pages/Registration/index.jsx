import React, {useRef, useState} from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Navigate } from "react-router-dom";
import { fetchRegisterUser, selectorAuthUser } from '../../redux/auth/slice';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Login.module.scss';
import { Skeleton } from '@mui/material';



const schema = yup.object({
  fullName: yup.string().min(3, 'Minimum 3 symbols!').required('Name required'),
  email: yup.string().email('Invalid email').required('E-mail is required'),
  password: yup.string().min(5, 'Minimum 5 symbols!').required('password is Required'),
});

export const Registration = () => {
  
  const inputFileRef = useRef(null);
  const [imageAvatar, setImageAvatar] = useState("");
  const [loadingImg, setLoadingImg] = useState("");
  const {isAuth} = useSelector(selectorAuthUser);
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState:{ errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues : {
      avatarUrl:'',
      fullName:'',
      email:'',
      password:'',
    },
    mode: "all",
  });

  const handleImageUpload = (event) => {
    
      const file = event.target.files[0];
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
        setLoadingImg('loading');
        axios.post('/uploads', formData)
        .then(({data}) => {
          setImageAvatar(data.url);
          setValue("avatarUrl", `http://localhost:4444${data.url}`);
          setLoadingImg('idle');
        }).catch((error) => {
          alert('can not uploud image');
          setLoadingImg('error')
          throw new Error(error);
        })
      }
  };


  const onSubmit = (value) => {
    dispatch(fetchRegisterUser(value))
    .then((res)=> window.localStorage.setItem("token", res.payload.token))
    .catch((error) => {
      alert('Faild to register');
      throw new Error(error);
    })
  } 

  if (isAuth) {
    return <Navigate to={"/"}/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
      Creating an account
      </Typography>
      <div className={styles.avatar}>
        {
          loadingImg === "loading" ?
          <Skeleton variant="circular" width={100} height={100} /> :
          <Avatar 
           onClick={()=>inputFileRef.current.click()}
           sx={{ width: 100, height: 100 }} 
           src={imageAvatar ? `http://localhost:4444${imageAvatar}` : ''} 
           alt="Avatar Preview"
          />
        }
          <input 
          ref={inputFileRef} hidden
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          />
      </div>
     
      <form onSubmit={handleSubmit(onSubmit)}> 
        <TextField 
        {...register("fullName")}
         className={styles.field} 
         label="Full name" fullWidth
         error={Boolean(errors.fullName?.message)}
         helperText={errors.fullName?.message}
         />
        <TextField
         {...register("email")}
          className={styles.field} 
          label="E-Mail" fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
         />
        <TextField
         {...register("password")} 
          className={styles.field}
          label="Passwprd" fullWidth 
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          />
        <Button type='submit' size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
