import { Router } from 'express';
import express from 'express';
import multer from 'multer';

import uploadCloud from '../middleware/cloudinary.js'

import * as controllers from '../controllers'


const router = Router();

router.use(express.json());

router.post('/', uploadCloud.array('file'), controllers.createPost);
router.get('/', controllers.allPost);
router.get('/:postLink', controllers.getPostByLink);
router.put('/:postLink', uploadCloud.array('file'), controllers.updatePost);
router.delete('/:postId', controllers.deletePost);






export default router;