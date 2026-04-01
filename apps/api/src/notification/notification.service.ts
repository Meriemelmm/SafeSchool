import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { TypeNotification, UserRole } from '@shared/enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly gateway: NotificationGateway,
  ) { }

  
  async createAndSend(
    destinataireId: string | Types.ObjectId,
    signalementId: string | Types.ObjectId,
    type: TypeNotification,
    message: string,
  ) {
    const destId = new Types.ObjectId(destinataireId);
    const sigId = new Types.ObjectId(signalementId);

   
    const notification = new this.notificationModel({
      destinataireId: destId,
      signalementId: sigId,
      type,
      message,
    });
    const saved = await notification.save();

   
    this.gateway.sendToUser(destId.toString(), 'new_notification', saved);

    return saved;
  }

 
  async markAsRead(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true });
  }

  
  async getForUser(userId: string) {

    return this.notificationModel
      .find({ destinataireId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }
}
