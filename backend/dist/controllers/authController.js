"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.EditBlog = exports.getAllBlogsByUsers = exports.getAllBlogsByUser = exports.WriteBlog = exports.ChangePassword = exports.EditProfile = exports.logoutUser = exports.registrationDetails = exports.loginDetails = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const Blog_1 = require("../models/Blog");
const loginDetails = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User_1.User.findOne({ email });
    if (!existingUser || typeof existingUser.password !== 'string') {
        return res.status(500).json({ message: 'Invalid user data' });
    }
    const verify = await bcryptjs_1.default.compare(password, existingUser.password);
    if (verify) {
        const token = await (0, generateToken_1.default)({ userId: existingUser._id });
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
    }
    else {
        return res.status(404).json({ message: 'Password is not match' });
    }
};
exports.loginDetails = loginDetails;
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message);
    }
};
function sanitizeUser(user) {
    const { password, firstName, lastName, email, phone, _id, dob, } = user;
    return { firstName, lastName, email, phone, _id, dob };
}
const registrationDetails = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob, password, confirmPassword } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User is already registered' });
        }
        const passwordHash = await securePassword(password);
        const user = new User_1.User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: passwordHash,
            dob: dob,
        });
        const createdUser = await user.save();
        const token = await (0, generateToken_1.default)({ userId: createdUser._id });
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
        const sanitizedUser = await sanitizeUser(user);
        console.log(sanitizedUser, 'sanitizedUser');
        res.status(200).json({ message: 'User successfully registered', user: sanitizedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.registrationDetails = registrationDetails;
const logoutUser = (req, res) => {
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
exports.logoutUser = logoutUser;
const EditProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dob } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        existingUser.firstName = firstName || existingUser.firstName;
        existingUser.lastName = lastName || existingUser.lastName;
        existingUser.email = email || existingUser.email;
        existingUser.phone = phone || existingUser.phone;
        existingUser.dob = dob || existingUser.dob;
        existingUser.password = existingUser.password;
        const updatedUser = await existingUser.save();
        const sanitizedUser = await sanitizeUser(updatedUser);
        res.status(200).json({
            message: 'Profile successfully updated',
            user: sanitizedUser,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
exports.EditProfile = EditProfile;
const ChangePassword = async (req, res) => {
    try {
        console.log(req.body);
        const { values, email } = req.body;
        let { currentPassword, newPassword } = values;
        if (!currentPassword || !newPassword || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user || typeof user.password !== 'string') {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'An error occurred while changing the password' });
    }
};
exports.ChangePassword = ChangePassword;
const WriteBlog = async (req, res) => {
    var _a;
    try {
        console.log(req.file, req.body);
        const { name, description, tags, category, author } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        if (!name || !description || !category || !author) {
            res.status(400).json({ message: "All required fields must be provided" });
        }
        const newBlog = new Blog_1.Blog({
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
    }
    catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
exports.WriteBlog = WriteBlog;
const getAllBlogsByUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }
        const blogs = await Blog_1.Blog.find({ author: userId });
        if (blogs.length === 0) {
            res.status(404).json({ message: 'No blogs found for this user' });
        }
        res.status(200).json({ message: 'blogs retrieved successfully', blogs });
    }
    catch (error) {
        console.error('Error retrieving blogs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllBlogsByUser = getAllBlogsByUser;
const getAllBlogsByUsers = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const blogs = await Blog_1.Blog.find().populate('author');
        return res.status(200).json(blogs);
    }
    catch (error) {
        console.error('Error fetching blogs by user:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.getAllBlogsByUsers = getAllBlogsByUsers;
const EditBlog = async (req, res) => {
    try {
        const { name, description, tags, category, author, blogId } = req.body;
        const image = req.file ? req.file.filename : null;
        const existingBlog = await Blog_1.Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        existingBlog.name = name || existingBlog.name;
        existingBlog.description = description || existingBlog.description;
        existingBlog.tags = tags || existingBlog.tags;
        existingBlog.category = category || existingBlog.category;
        if (author) {
            const authorExists = await User_1.User.findById(author);
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
exports.EditBlog = EditBlog;
const deleteBlog = async (req, res) => {
    const { blogId } = req.params;
    try {
        const deletedBlog = await Blog_1.Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            res.status(404).json({ message: 'Blog not found' });
        }
        await User_1.User.updateMany({ blockedBlogs: blogId }, { $pull: { blockedBlogs: blogId } });
        res.status(200).json({ message: 'Blog deleted and users updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBlog = deleteBlog;
