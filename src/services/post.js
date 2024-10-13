const cloudinary = require('cloudinary').v2;
import Post from '../models/Post';

export const createPost = async (body, fileData) => {
    try {
        const createLinkFromTitle = (title) => {
            const cleanedTitle = title.replace(/[^a-zA-Z0-9\s-]+/g, '');
            const lowercaseTitle = cleanedTitle.toLowerCase();
            return lowercaseTitle.replace(/\s+/g, '-');
        }

        const link = createLinkFromTitle(body.title);

        // Tạo đối tượng mới từ mô hình Post
        const newPost = new Post({
            title: body.title,
            description: body.description,
            content: body.content,
            tag: body.tag,
            link: link,
            image: fileData?.path, // Giả sử fileData là tệp đã được tải lên
            title_vietnamese: body.title_vietnamese,
            description_vietnamese: body.description_vietnamese,
            content_vietnamese: body.content_vietnamese,
            tag_vietnamese: body.tag_vietnamese
        });

        // Lưu bài viết vào cơ sở dữ liệu
        const response = await newPost.save();

        // Xóa ảnh nếu không tạo thành công
        if (fileData && !response) {
            await cloudinary.uploader.destroy(fileData.filename);
        }

        return {
            err: response ? 0 : 1,
            mes: response ? 'Created' : 'Cannot create new post',
        };
    } catch (error) {
        // Xóa ảnh đã tải lên nếu có lỗi
        if (fileData && fileData.length > 0) {
            for (const file of fileData) {
                const publicId = file.filename.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    }
};

export const getAllPosts = async (page, limit = 6) => {
    try {
        const skip = (page - 1) * limit;
        const posts = await Post.find()
            .skip(skip) // Bỏ qua số lượng bài viết
            .limit(limit); // Giới hạn số lượng bài viết trả về

        const totalPosts = await Post.countDocuments(); // Tổng số bài viết
        const totalPages = Math.ceil(totalPosts / limit); // Tính số trang tổng cộng

        return {
            posts,
            total: totalPosts, // Tổng số bài viết
            total_pages: totalPages, // Tổng số trang
            current_page: page, // Trang hiện tại
        };
    } catch (error) {
        console.log('Error fetching all posts:', error);
        throw error;
    }
};
export const getPostByLink = async (postLink) => {
    try {
        if (!postLink) {
            throw new Error('Invalid post link');
        }
        const post = await Post.findOne({ link: postLink }); // Tìm bài viết theo link
        return post;
    } catch (error) {
        console.log('Error fetching post by link:', error);
        throw new Error(`Error fetching post by link: ${error.message}`);
    }
};

export const findPostById = async (postId) => {
    try {
        if (!postId) {
            throw new Error('Invalid post ID');
        }
        const post = await Post.findById(postId); // Tìm bài viết theo ID
        return post;
    } catch (error) {
        console.log('Error fetching post by ID:', error);
        throw new Error(`Error fetching post by ID: ${error.message}`);
    }
};

export const updatePost = async (postId, newData) => {
    try {
        const post = await Post.findById(postId); // Tìm bài viết theo ID
        if (!post) {
            throw new Error('Post not found');
        }

        Object.assign(post, newData); // Cập nhật dữ liệu mới
        await post.save(); // Lưu thay đổi

        return post;
    } catch (error) {
        console.log('Error updating post:', error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const post = await Post.findById(postId); // Tìm bài viết theo ID
        if (!post) {
            throw new Error('Post not found');
        }
        await Post.deleteOne({ _id: postId }); // Xóa bài viết
    } catch (error) {
        console.log('Error deleting post:', error);
        throw error;
    }
};



