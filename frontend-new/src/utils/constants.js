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
  queued: 'bg-blue-100 text-blue-800',
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
  stripe: ['payment.succeeded', 'payment.failed', 'customer.created', 'subscription.updated'],
  shopify: ['order.created', 'order.updated', 'product.created', 'refund.created'],
  crm: ['contact.created', 'deal.won', 'deal.lost', 'task.completed'],
  generic: ['event.triggered', 'webhook.received'],
};
