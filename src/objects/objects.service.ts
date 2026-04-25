import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntry } from './schemas/object.schema';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntry.name) private objectModel: Model<ObjectEntry>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(title: string, description: string, file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    const newObject = new this.objectModel({ title, description, imageUrl });
    return newObject.save();
  }

  // --- MÉTHODE MISE À JOUR : Gère maintenant le texte ET l'image ---
  async update(
    id: string, 
    title: string, 
    description: string, 
    file?: Express.Multer.File
  ) {
    const obj = await this.findOne(id);
    let imageUrl = obj.imageUrl;

    // Si un nouveau fichier est fourni, on procède au remplacement
    if (file) {
      try {
        // 1. Extraire le publicId de l'ancienne image pour la supprimer sur Cloudinary
        const parts = obj.imageUrl.split('/');
        const lastPart = parts[parts.length - 1];
        const publicId = lastPart.split('.')[0];
        
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId);
        }

        // 2. Uploader la nouvelle image
        imageUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        console.error("Erreur lors du remplacement de l'image sur Cloudinary:", error);
        // On peut choisir de continuer ou de bloquer ici selon tes préférences
      }
    }

    // 3. Mise à jour des données dans MongoDB
    const updatedObj = await this.objectModel
      .findByIdAndUpdate(
        id,
        { $set: { title, description, imageUrl } },
        { new: true }, // Renvoie l'objet après modification
      )
      .exec();

    if (!updatedObj) {
      throw new NotFoundException('Objet introuvable pour la mise à jour');
    }

    return updatedObj;
  }

  async findAll() {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException('Objet introuvable');
    return obj;
  }

  async delete(id: string) {
    const obj = await this.findOne(id);
    const parts = obj.imageUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0];

    await this.cloudinaryService.deleteImage(publicId);
    return this.objectModel.findByIdAndDelete(id).exec();
  }
}