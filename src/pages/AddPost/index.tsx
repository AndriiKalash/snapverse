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
import { IPostsData } from '../../redux/posts/type';



export const AddPost:React.FC = () => {

  const navigate = useNavigate();
  const {isAuth} = useSelector(selectorAuthUser);
  const {id} = useParams();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(id);
 
  const [imageUrl , setImageUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  
  //this spacial func for SimpleMDE component:
  const onChange = React.useCallback((value:string) => {
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
        const dataObject: IPostsData = data;
        if (dataObject) {
          setImageUrl(
          dataObject.imageUrl?
          dataObject.imageUrl.replace("http://localhost:4444","") :
          ''
          );
          setText(dataObject.text);
          setTags(dataObject.tags.join(","));
          setTitle(dataObject.title);
        }
        
      } catch (error) {
        alert('could not get post');
        throw new Error(error as string);
      }
  };
  useEffect(()=>{
    if (id){
      getOnePost();
    }
  },[]);

  const handleChangeFile = async(event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files) {
        const file = event.target.files[0];
        const formData = new FormData();
        if (file) {
        formData.append('image', file);
        const {data} = await axios.post('/uploads', formData);
        setImageUrl(data.url);
      }
      }
      
    } catch (error) {
      alert('upload file failed');
      throw new Error (error as string);
    }
  };

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
      alert('upload post failed');
      throw new Error(error as string);
    }
  }


  return (
    <Paper style={{ padding: 30 }}>
      <Button 
      onClick={()=>{
        if (inputFileRef.current) {
          inputFileRef.current.click()
        } 
      }} 
      variant="outlined" size="large">
        Upload image
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {
      imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={()=> setImageUrl('')}>
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
