import Project from '../models/project.model.js';
import Category from '../models/category.model.js';
import ApiResponse from '../utils/apiResponse.js';
import CloudinaryService from '../services/cloudinary.service.js';
import logger from '../config/logger.js';

class ProjectController {
  static async getAllProjects(req, res, next) {
    try {
      const { category } = req.query;
      const filter = {};
      if (category) {
        filter.categoryId = category;
      }

      const projects = await Project.findAll({
        where: filter,
        include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
        order: [['year', 'DESC'], ['createdAt', 'DESC']]
      });

      return ApiResponse.success(res, 'Projects fetched successfully', projects);
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req, res, next) {
    try {
      const { name, description, location, year, client, categoryId } = req.body;

      if (!req.file) {
        return ApiResponse.error(res, 'Project feature image is required', null, 400);
      }

      const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'projects');

      const project = await Project.create({
        name,
        description,
        location,
        year: year ? parseInt(year) : null,
        client,
        categoryId: categoryId || null,
        image: uploadResult.url,
        images: []
      });

      logger.info(`Portfolio project created: ${project.name}`);
      return ApiResponse.success(res, 'Project created successfully', project, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) {
        return ApiResponse.error(res, 'Project not found', null, 404);
      }

      let imageUrl = project.image;
      if (req.file) {
        if (project.image) {
          const publicId = project.image.split('/').pop().split('.')[0];
          await CloudinaryService.deleteFile(publicId);
        }
        const uploadResult = await CloudinaryService.uploadFile(req.file.path, 'projects');
        imageUrl = uploadResult.url;
      }

      await project.update({
        name: req.body.name || project.name,
        description: req.body.description || project.description,
        location: req.body.location || project.location,
        year: req.body.year ? parseInt(req.body.year) : project.year,
        client: req.body.client || project.client,
        categoryId: req.body.categoryId || project.categoryId,
        image: imageUrl
      });

      logger.info(`Portfolio project updated: ${project.name}`);
      return ApiResponse.success(res, 'Project updated successfully', project);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) {
        return ApiResponse.error(res, 'Project not found', null, 404);
      }

      if (project.image) {
        const publicId = project.image.split('/').pop().split('.')[0];
        await CloudinaryService.deleteFile(publicId);
      }

      await project.destroy();
      logger.info(`Portfolio project deleted: ${id}`);
      return ApiResponse.success(res, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default ProjectController;
export { ProjectController };
