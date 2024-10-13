
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    tag: {
        type: [String],
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    title_vietnamese: {
        type: String,
        required: true,
    },
    description_vietnamese: {
        type: String,
        required: true,
    },
    content_vietnamese: {
        type: String,
        required: true,
    },
    tag_vietnamese: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Tạo mô hình Post
const Post = mongoose.model('Project', projectSchema);
//const User = mongoose.model('User', userSchema);

// Xuất các mô hình và hàm kết nối
module.exports = Post;