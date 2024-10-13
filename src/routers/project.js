import { Router } from 'express';
import express from 'express';
import multer from 'multer';

import uploadCloud from '../middleware/cloudinary.js'

import * as controllers from '../controllers/index.js'


const router = Router();

router.use(express.json());

router.post('/', uploadCloud.array('file'), controllers.createProject);
router.get('/', controllers.allProject);
router.get('/:projectLink', controllers.getProjectByLink);
router.put('/:projectLink', uploadCloud.array('file'), controllers.updateProject);
router.delete('/:projectId', controllers.deleteProject);






export default router;