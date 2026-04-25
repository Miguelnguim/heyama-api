import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectEntry, ObjectSchema } from './schemas/object.schema';
import { CloudinaryService } from './cloudinary.service';
import { ObjectsGateway } from './objects.gateway';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectEntry.name, schema: ObjectSchema }]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, CloudinaryService, ObjectsGateway],
})
export class ObjectsModule {}