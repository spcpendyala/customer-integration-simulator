export const EVENT_STATUS = {
  RECEIVED: 'received',
  VALIDATED: 'validated',
  QUEUED: 'queued',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  RETRYING: 'retrying',
  PERMANENT_FAILURE: 'permanent_failure',
  REJECTED: 'rejected',
  TIMED_OUT: 'timed_out',
};

export const STATUS_COLORS = {
  received: 'bg-blue-100 text-blue-800',
  validated: 'bg-blue-100 text-blue-800',
  queued: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  retrying: 'bg-orange-100 text-orange-800',
  permanent_failure: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800',
  timed_out: 'bg-red-100 text-red-800',
};

export const INTEGRATION_TYPES = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'crm', label: 'CRM' },
  { value: 'generic', label: 'Generic' },
];

export const EVENT_TYPES = {
  stripe: [
    'payment.succeeded',
    'payment.failed',
    'charge.refunded',
    'customer.created',
    'subscription.updated',
    'subscription.cancelled',
    'invoice.payment_failed',
    'dispute.created',
  ],
  shopify: [
    'order.created',
    'order.updated',
    'order.cancelled',
    'order.fulfilled',
    'product.created',
    'product.updated',
    'refund.created',
    'inventory.updated',
  ],
  crm: [
    'contact.created',
    'contact.updated',
    'deal.won',
    'deal.lost',
    'task.completed',
    'meeting.scheduled',
    'lead.converted',
    'pipeline.updated',
  ],
  generic: [
    'event.triggered',
    'action.completed',
    'webhook.received',
    'data.synced',
    'notification.sent',
  ],
};
