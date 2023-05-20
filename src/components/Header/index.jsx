import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogOut, selectorAuthUser } from '../../redux/auth/slice';

import { Avatar, Skeleton } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styles from './Header.module.scss';

export const Header = () => {

  const {isAuth, user, statusUser} = useSelector(selectorAuthUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickLogout = () => {
    if (window.confirm('are you sure you want to logout?')) {
      dispatch(setLogOut());
    window.localStorage.removeItem('token','');
    navigate("/");
    }
  } 

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.blockLogo}>
            <Link className={styles.logo} to="/">
              <div>
           {
              !isAuth || !window.localStorage.getItem('token') || 
              statusUser==="loading" ?
              " SNAPVERSE BLOG":
              user.fullName 
            }
              </div>
            </Link>
            { !isAuth || !window.localStorage.getItem('token') ||
              statusUser==="loading" ? (
              <Skeleton variant="circular" width={40} height={40} />
              ) : (
              <Avatar alt={user.fullName} src={user.avatarUrl} />
              )
            }
          </div>
          <div className={styles.buttons}>
            {isAuth || window.localStorage.getItem('token') ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Create post</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
