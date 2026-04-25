import { Controller, Get, Post, Patch, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly objectsGateway: ObjectsGateway,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    const newObj = await this.objectsService.create(title, description, file);
    this.objectsGateway.emitObjectCreated(newObj);
    return newObj;
  }

  // --- MÉTHODE MISE À JOUR : Supporte maintenant l'upload d'image ---
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image')) // Permet de récupérer le fichier envoyé via FormData
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File, // Le nouveau fichier (optionnel)
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    // 1. Appel du service avec les nouveaux paramètres
    const updatedObj = await this.objectsService.update(id, title, description, file);

    // 2. Notification en temps réel (si activée)
    this.objectsGateway.emitObjectCreated(updatedObj); // Tu peux créer une méthode spécifique 'emitObjectUpdated' si besoin

    return updatedObj;
  }

  @Get()
  async findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.objectsService.delete(id);
  }
}