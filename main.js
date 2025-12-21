import axios from 'axios'
import checkStatus from '../axiosMethod.js'
let url = ['https://gemini.google.com/app?hl=en-IN','https://www.youtube.com/','https://music.youtube.com/','www.listia.com'];


setInterval(()=>{
  for(let check of url)
  {
     checkStatus(check)
  }
},50000)