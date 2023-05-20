import React, { useEffect, useRef, useState } from 'react';
import styles from './AddPost.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import { selectorAuthUser } from '../../redux/auth/slice';
import SimpleMDE from 'react-simplemde-editor';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import 'easymde/dist/easymde.min.css';


export const AddPost = () => {

  const navigate = useNavigate();
  const {isAuth} = useSelector(selectorAuthUser);
  const {id} = useParams();
  const inputFileRef = useRef(null);
  const isEditing = Boolean(id);
 
  const [imageUrl , setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  
  //this spacial func for SimpleMDE component:
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // settings SimpleMDE component:
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    navigate("/");
  };
 
  const getOnePost = async() =>{
      try {
        const {data} = await(axios.get(`/posts/${id}`));
        setImageUrl(data.imageUrl.replace("http://localhost:4444",""));
        setText(data.text);
        setTags(data.tags.join(","));
        setTitle(data.title);
      } catch (error) {
        alert('could not get post')
        throw new Error(error);
      }
  };
  useEffect(()=>{
    if (id){
      getOnePost();
    }
  },[]);

  const handleChangeFile = async(event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
        const {data} = await axios.post('/uploads', formData);
        setImageUrl(data.url);
      }
    } catch (error) {
      console.warn(error);
      alert('upload file failed');
    }
  };

  const onClickRemoveImage = () => {setImageUrl('')};

  const handleSubmit = async() => {
    try {
    const postValue = {
      title,
      text,
      imageUrl: imageUrl ?`http://localhost:4444${imageUrl}` : '',
      tags: tags.split(","),
    }
    if (id) {
      axios.patch(`/posts/${id}`, postValue)
      navigate(`/posts/${id}`)
    }else {
      const {data} = await axios.post('/posts', postValue);
      navigate(`/posts/${data._id}`)
    }
    } catch (error) {
      console.warn(error);
      alert('upload post failed');
    }
  }


  return (
    <Paper style={{ padding: 30 }}>
      <Button 
      onClick={()=>inputFileRef.current.click()} 
      variant="outlined" size="large">
        Upoad image
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {
      imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Delete
        </Button>
        <img 
        className={styles.image}
         src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>)
      }
      <br />
      <br />
      <TextField
      classes={{ root: styles.title }}
      variant="standard"
      placeholder="Title of the article..."
      onChange={(e)=>setTitle(e.target.value)}
      value={title}
      fullWidth
      />
      <TextField 
      classes={{ root: styles.tags }} 
      variant="standard" 
      placeholder="Tags" 
      onChange={(e)=>setTags(e.target.value)}
      value={tags}
      fullWidth 
      />
      <SimpleMDE 
      className={styles.editor}
      value={text} 
      onChange={onChange} 
      options={options} 
      />
      <div className={styles.buttons}>
        <Button 
        onClick={handleSubmit}
        type='submit'
         size="large" 
         variant="contained">
         {isEditing ? "Save" : "Publish"} 
        </Button>
        <Link to="/">
          <Button onClick={()=>navigate('/')} size="large">Cancel</Button>
        </Link>
      </div>
    </Paper>
  );
};
