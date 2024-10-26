import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import generateToken,{verifyToken} from '../utils/generateToken';
import { Blog } from '../models/Blog';
export const loginDetails = async (req: Request, res: Response): Promise<any>=> {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (!existingUser || typeof existingUser.password !== 'string') {
        return res.status(500).json({ message: 'Invalid user data' });
    }
    const verify = await bcrypt.compare(password, existingUser.password);
    
    if (verify) {
        const token = await generateToken({ userId: existingUser._id });
        
        res.cookie('accessToken', token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000
        });

        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const sanitizedUser = await sanitizeUser(existingUser);
        console.log(sanitizedUser, 'sanitizedUser');

        res.status(200).json({ message: 'User successfully registered', user: sanitizedUser });
    } else {
        return res.status(404).json({ message: 'Password is not match' });
    }
};

const securePassword = async (password:string) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error:any) {
        console.log(error.message);
    }
};

function sanitizeUser(user:any) {
    const {password,firstName,lastName,email,phone,_id,dob,}=user    
    return {firstName,lastName,email,phone,_id,dob}
  }

export const registrationDetails = async (req: Request, res: Response) => {
  try {    
    const { firstName,
        lastName,
        email,       
        phone,
        dob,
        password,
        confirmPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(409).json({ message: 'User is already registered' });
    }
    const passwordHash = await securePassword(password);
    const user=new User({
        firstName:firstName,
        lastName:lastName,
        email:email,
        phone:phone,
        password:passwordHash,
        dob:dob,
    })
    const createdUser=await user.save()
    const token=await generateToken({userId:createdUser._id});
    res.cookie('accessToken',token.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000 
      });
  
      res.cookie('refreshToken',token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });
      
      const sanitizedUser = await sanitizeUser(user);
      console.log(sanitizedUser,'sanitizedUser');
      
     res.status(200).json({ message: 'User successfully registered',user:sanitizedUser});
     
    
  } catch (error:any) {
    
     res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
      });
  
    res.status(200).json({ message: 'Logout successful' });
  };

  export const EditProfile = async (req: Request, res: Response): Promise<any> => {
    try { 
      const { firstName, lastName, email, phone, dob } = req.body;
  
      const existingUser = await User.findOne({email});
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    
      existingUser.firstName = firstName || existingUser.firstName;
      existingUser.lastName = lastName || existingUser.lastName;
      existingUser.email = email || existingUser.email;
      existingUser.phone = phone || existingUser.phone;
      existingUser.dob = dob || existingUser.dob;
      existingUser.password = existingUser.password ;
      
  
      const updatedUser = await existingUser.save();
  

      const sanitizedUser = await sanitizeUser(updatedUser);

      res.status(200).json({
        message: 'Profile successfully updated',
        user: sanitizedUser,
      });
  
    } catch (err: any) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };

  export const ChangePassword = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
      const { values, email } = req.body;
      let {currentPassword,newPassword}=values


  
      if (!currentPassword || !newPassword || !email) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  

      const user = await User.findOne({ email });
      if (!user || typeof user.password !== 'string') {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
  

      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password must be different from the current password' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
 
      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'An error occurred while changing the password' });
    }
  };

  export const WriteBlog = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.file,req.body);
      const { name, description, tags, category, author } = req.body;
      const image=req.file?.filename;
      
      
  
      if (!name || !description || !category || !author) {
         res.status(400).json({ message: "All required fields must be provided" });
      }
  
     
      const newBlog = new Blog({
        name,
        description,
        tags: tags || [], 
        category,
        image: image || '', 
        author, 
      });
  
      const savedBlog = await newBlog.save();
  
       res.status(200).json({
        message: 'Blog successfully created',
        blog: savedBlog,
      });
    } catch (error:any) {
      console.error("Error creating blog:", error);
      
       res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

  export const getAllBlogsByUser=async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;
  
      if (!userId) {
         res.status(400).json({ message: 'User ID is required' });
      }
      const blogs = await Blog.find({ author: userId });
  
      if (blogs.length === 0) {
         res.status(404).json({ message: 'No blogs found for this user' });
      }
  
       res.status(200).json({ message: 'blogs retrieved successfully', blogs });
    } catch (error) {
      console.error('Error retrieving blogs:', error);
       res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const getAllBlogsByUsers = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const blogs = await Blog.find().populate('author');
 
      return res.status(200).json(blogs);
      
    } catch (error) {
      console.error('Error fetching blogs by user:', error);
 
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };


  export const EditBlog = async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, description, tags, category, author, blogId } = req.body;
      const image = req.file ? req.file.filename : null; 
  
     
      const existingBlog = await Blog.findById(blogId);
      
      if (!existingBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
  
      
      existingBlog.name = name || existingBlog.name;
      existingBlog.description = description || existingBlog.description;
      existingBlog.tags = tags || existingBlog.tags;
      existingBlog.category = category || existingBlog.category;
      
    
      if (author) {
        const authorExists = await User.findById(author);
        if (!authorExists) {
          return res.status(404).json({ message: 'Author not found' });
        }
        existingBlog.author = author;
      }

      if (image) {
        existingBlog.image = image; 
      }
  
     
      const updatedBlog = await existingBlog.save();
  
 
      res.status(200).json({
        message: 'Blog successfully updated',
        blog: updatedBlog,
      });
  
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  };
  export const deleteBlog = async(req: Request, res: Response): Promise<any> => {
    const { blogId } = req.params; 
  
    try {
      const deletedBlog = await Blog.findByIdAndDelete(blogId);
  
      if (!deletedBlog) {
         res.status(404).json({ message: 'Blog not found' });
      }
      await User.updateMany(
        { blockedBlogs: blogId }, 
        { $pull: { blockedBlogs: blogId } } 
      );

  
      res.status(200).json({ message: 'Blog deleted and users updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  