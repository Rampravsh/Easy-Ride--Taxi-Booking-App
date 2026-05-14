import { Document, Types } from 'mongoose';
import { AuditAction, AuditStatus } from '../../shared/enums';

export interface IAudit {
  admin: Types.ObjectId;
  action: AuditAction;
  resource: string; // e.g., 'user', 'rider', 'payment'
  resourceId?: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: AuditStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IAuditDocument extends IAudit, Document {}
