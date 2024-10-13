const cloudinary = require('cloudinary').v2;
import Project from '../models/Project';

export const createProject = async (body, fileData) => {
    try {
        const createLinkFromTitle = (title) => {
            const cleanedTitle = title.replace(/[^a-zA-Z0-9\s-]+/g, '');
            const lowercaseTitle = cleanedTitle.toLowerCase();
            return lowercaseTitle.replace(/\s+/g, '-');
        }

        const link = createLinkFromTitle(body.title);

        // Tạo đối tượng mới từ mô hình Post
        const newProject = new Project({
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
        const response = await newProject.save();

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

export const getAllProjects = async (page, limit = 6) => {
    try {
        const skip = (page - 1) * limit;
        const projects = await Project.find()
            .skip(skip) // Bỏ qua số lượng bài viết
            .limit(limit); // Giới hạn số lượng bài viết trả về

        const totalProjects = await Project.countDocuments(); // Tổng số bài viết
        const totalPages = Math.ceil(totalProjects / limit); // Tính số trang tổng cộng

        return {
            projects,
            total: totalProjects, // Tổng số bài viết
            total_pages: totalPages, // Tổng số trang
            current_page: page, // Trang hiện tại
        };
    } catch (error) {
        console.log('Error fetching all posts:', error);
        throw error;
    }
};
export const getProjectByLink = async (projectLink) => {
    try {
        if (!projectLink) {
            throw new Error('Invalid post link');
        }
        const project = await Project.findOne({ link: projectLink }); // Tìm bài viết theo link
        return project;
    } catch (error) {
        console.log('Error fetching post by link:', error);
        throw new Error(`Error fetching post by link: ${error.message}`);
    }
};

export const findProjectById = async (projectId) => {
    try {
        if (!projectId) {
            throw new Error('Invalid post ID');
        }
        const project = await Project.findById(projectId); // Tìm bài viết theo ID
        return project;
    } catch (error) {
        console.log('Error fetching post by ID:', error);
        throw new Error(`Error fetching post by ID: ${error.message}`);
    }
};

export const updateProject = async (projectId, newData) => {
    try {
        const project = await Project.findById(projectId); // Tìm bài viết theo ID
        if (!project) {
            throw new Error('project not found');
        }

        Object.assign(project, newData); // Cập nhật dữ liệu mới
        await project.save(); // Lưu thay đổi

        return project;
    } catch (error) {
        console.log('Error updating post:', error);
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        const project = await Project.findById(projectId); // Tìm bài viết theo ID
        if (!project) {
            throw new Error('project not found');
        }
        await Project.deleteOne({ _id: projectId }); // Xóa bài viết
    } catch (error) {
        console.log('Error deleting post:', error);
        throw error;
    }
};



