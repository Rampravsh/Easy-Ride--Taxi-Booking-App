import { Schema, model } from 'mongoose';
import { IAuditDocument } from './audit.interface';
import { AuditAction, AuditStatus } from '../../shared/enums';

const auditSchema = new Schema<IAuditDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',  // Admins are stored in the User collection — no separate Admin model
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      index: true,
    },
    previousState: {
      type: Schema.Types.Mixed,
    },
    newState: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(AuditStatus),
      default: AuditStatus.SUCCESS,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Audit = model<IAuditDocument>('Audit', auditSchema);
