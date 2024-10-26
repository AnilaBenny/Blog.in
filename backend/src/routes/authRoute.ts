import express from 'express';  
import { loginDetails,logoutUser,registrationDetails,EditProfile,ChangePassword,WriteBlog,
    EditBlog,
    deleteBlog,
    getAllBlogsByUser,
    getAllBlogsByUsers,
} from '../controllers/authController';
import upload from '../utils/Multer';
const authRoute=express.Router();

authRoute.post('/login',loginDetails);
authRoute.post('/register',registrationDetails);
authRoute.get('/logout',logoutUser);
authRoute.put('/editprofile',EditProfile);
authRoute.post('/changepassword',ChangePassword);
authRoute.post('/writeblog',upload.single('image') ,WriteBlog);
authRoute.put('/editblog',upload.single('image') ,EditBlog);
authRoute.delete('/deletearticle/:articleId',deleteBlog);
authRoute.post('/userblogs',getAllBlogsByUser);
authRoute.post('/allblogs',getAllBlogsByUsers);


export default authRoute;