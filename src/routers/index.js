import post from './post.js';
import project from './project.js';

const initRouter = (app) => {

    app.use('/api/v1/post', post);
    app.use('/api/v1/project', project);

}

module.exports = initRouter