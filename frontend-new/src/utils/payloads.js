export const generatePayload = (integration, eventType) => {
  const timestamp = new Date().toISOString();
  const id = () => Math.random().toString(36).substr(2, 9);

  const payloads = {
    stripe: {
      'payment.succeeded': {
        event_type: 'payment.succeeded',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `pi_${id()}`,
            amount: Math.floor(Math.random() * 90000) + 1000,
            currency: 'usd',
            customer: `cus_${id()}`,
            description: 'Subscription payment',
            status: 'succeeded',
            payment_method: `pm_${id()}`,
          }
        }
      },
      'payment.failed': {
        event_type: 'payment.failed',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `pi_${id()}`,
            amount: Math.floor(Math.random() * 90000) + 1000,
            currency: 'usd',
            customer: `cus_${id()}`,
            status: 'requires_payment_method',
            last_payment_error: {
              code: 'card_declined',
              message: 'Your card was declined.',
              type: 'card_error',
            }
          }
        }
      },
      'charge.refunded': {
        event_type: 'charge.refunded',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `ch_${id()}`,
            amount: Math.floor(Math.random() * 50000) + 500,
            amount_refunded: Math.floor(Math.random() * 10000) + 500,
            currency: 'usd',
            customer: `cus_${id()}`,
            refunded: true,
          }
        }
      },
      'customer.created': {
        event_type: 'customer.created',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `cus_${id()}`,
            email: `user_${id()}@example.com`,
            name: 'John Doe',
            created: Math.floor(Date.now() / 1000),
            currency: 'usd',
          }
        }
      },
      'subscription.updated': {
        event_type: 'subscription.updated',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `sub_${id()}`,
            customer: `cus_${id()}`,
            status: 'active',
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            plan: { id: 'plan_pro', amount: 9900, currency: 'usd', interval: 'month' }
          }
        }
      },
      'subscription.cancelled': {
        event_type: 'subscription.cancelled',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `sub_${id()}`,
            customer: `cus_${id()}`,
            status: 'canceled',
            canceled_at: Math.floor(Date.now() / 1000),
            plan: { id: 'plan_pro', amount: 9900, currency: 'usd', interval: 'month' }
          }
        }
      },
      'invoice.payment_failed': {
        event_type: 'invoice.payment_failed',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `in_${id()}`,
            customer: `cus_${id()}`,
            amount_due: Math.floor(Math.random() * 50000) + 1000,
            currency: 'usd',
            attempt_count: Math.floor(Math.random() * 3) + 1,
            next_payment_attempt: Math.floor(Date.now() / 1000) + 86400,
          }
        }
      },
      'dispute.created': {
        event_type: 'dispute.created',
        id: `evt_${id()}`,
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: `dp_${id()}`,
            amount: Math.floor(Math.random() * 50000) + 1000,
            currency: 'usd',
            reason: 'fraudulent',
            status: 'needs_response',
            charge: `ch_${id()}`,
          }
        }
      },
    },

    shopify: {
      'order.created': {
        event_type: 'order.created',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        email: `customer_${id()}@example.com`,
        created_at: timestamp,
        total_price: (Math.random() * 500 + 20).toFixed(2),
        currency: 'USD',
        financial_status: 'paid',
        fulfillment_status: null,
        line_items: [
          { title: 'Product A', quantity: 1, price: (Math.random() * 100 + 10).toFixed(2) }
        ],
        shipping_address: { city: 'New York', country: 'US', zip: '10001' }
      },
      'order.updated': {
        event_type: 'order.updated',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        email: `customer_${id()}@example.com`,
        updated_at: timestamp,
        total_price: (Math.random() * 500 + 20).toFixed(2),
        financial_status: 'paid',
        fulfillment_status: 'partial',
      },
      'order.cancelled': {
        event_type: 'order.cancelled',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        email: `customer_${id()}@example.com`,
        cancelled_at: timestamp,
        cancel_reason: 'customer',
        total_price: (Math.random() * 500 + 20).toFixed(2),
        financial_status: 'refunded',
      },
      'order.fulfilled': {
        event_type: 'order.fulfilled',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        email: `customer_${id()}@example.com`,
        fulfilled_at: timestamp,
        fulfillment_status: 'fulfilled',
        tracking_number: `TRK${Math.floor(Math.random() * 9000000) + 1000000}`,
        tracking_company: 'UPS',
      },
      'product.created': {
        event_type: 'product.created',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        title: `Product ${id()}`,
        created_at: timestamp,
        vendor: 'My Store',
        product_type: 'Electronics',
        status: 'active',
        variants: [{ price: (Math.random() * 200 + 10).toFixed(2), inventory_quantity: 50 }]
      },
      'product.updated': {
        event_type: 'product.updated',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        title: `Product ${id()}`,
        updated_at: timestamp,
        status: 'active',
        variants: [{ price: (Math.random() * 200 + 10).toFixed(2), inventory_quantity: 30 }]
      },
      'refund.created': {
        event_type: 'refund.created',
        id: Math.floor(Math.random() * 9000000) + 1000000,
        order_id: Math.floor(Math.random() * 9000000) + 1000000,
        created_at: timestamp,
        note: 'Customer requested refund',
        refund_line_items: [
          { quantity: 1, line_item: { title: 'Product A', price: (Math.random() * 100 + 10).toFixed(2) } }
        ]
      },
      'inventory.updated': {
        event_type: 'inventory.updated',
        inventory_item_id: Math.floor(Math.random() * 9000000) + 1000000,
        location_id: Math.floor(Math.random() * 9000000) + 1000000,
        updated_at: timestamp,
        available: Math.floor(Math.random() * 100),
        old_available: Math.floor(Math.random() * 100),
      },
    },

    crm: {
      'contact.created': {
        event_type: 'contact.created',
        id: `contact_${id()}`,
        email: `lead_${id()}@company.com`,
        first_name: 'Jane',
        last_name: 'Smith',
        company: 'Acme Corp',
        phone: '+1-555-0100',
        created_at: timestamp,
        source: 'website',
        lifecycle_stage: 'lead',
      },
      'contact.updated': {
        event_type: 'contact.updated',
        id: `contact_${id()}`,
        email: `lead_${id()}@company.com`,
        updated_at: timestamp,
        changes: { lifecycle_stage: { from: 'lead', to: 'opportunity' } }
      },
      'deal.won': {
        event_type: 'deal.won',
        id: `deal_${id()}`,
        name: `Enterprise Deal - ${id()}`,
        amount: Math.floor(Math.random() * 100000) + 5000,
        currency: 'USD',
        closed_at: timestamp,
        contact_id: `contact_${id()}`,
        pipeline: 'Enterprise Sales',
        stage: 'closed_won',
      },
      'deal.lost': {
        event_type: 'deal.lost',
        id: `deal_${id()}`,
        name: `SMB Deal - ${id()}`,
        amount: Math.floor(Math.random() * 20000) + 1000,
        currency: 'USD',
        closed_at: timestamp,
        lost_reason: 'Chose competitor',
        pipeline: 'SMB Sales',
        stage: 'closed_lost',
      },
      'task.completed': {
        event_type: 'task.completed',
        id: `task_${id()}`,
        title: 'Follow up call',
        completed_at: timestamp,
        contact_id: `contact_${id()}`,
        assigned_to: `user_${id()}`,
        outcome: 'positive',
      },
      'meeting.scheduled': {
        event_type: 'meeting.scheduled',
        id: `meeting_${id()}`,
        title: 'Product Demo',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        duration_minutes: 45,
        contact_id: `contact_${id()}`,
        meeting_type: 'demo',
      },
      'lead.converted': {
        event_type: 'lead.converted',
        id: `lead_${id()}`,
        email: `lead_${id()}@company.com`,
        converted_at: timestamp,
        deal_id: `deal_${id()}`,
        deal_amount: Math.floor(Math.random() * 50000) + 1000,
      },
      'pipeline.updated': {
        event_type: 'pipeline.updated',
        id: `pipeline_${id()}`,
        name: 'Enterprise Sales',
        updated_at: timestamp,
        total_value: Math.floor(Math.random() * 500000) + 10000,
        deals_count: Math.floor(Math.random() * 20) + 1,
      },
    },

    generic: {
      'event.triggered': {
        event_type: 'event.triggered',
        id: `evt_${id()}`,
        source: 'internal_system',
        triggered_at: timestamp,
        payload: { key: 'value', count: Math.floor(Math.random() * 100) }
      },
      'action.completed': {
        event_type: 'action.completed',
        id: `action_${id()}`,
        type: 'data_sync',
        completed_at: timestamp,
        records_processed: Math.floor(Math.random() * 1000) + 1,
        duration_ms: Math.floor(Math.random() * 5000) + 100,
      },
      'webhook.received': {
        event_type: 'webhook.received',
        id: `wh_${id()}`,
        source: 'external_system',
        received_at: timestamp,
        payload_size_bytes: Math.floor(Math.random() * 10000) + 100,
      },
      'data.synced': {
        event_type: 'data.synced',
        id: `sync_${id()}`,
        source: 'database',
        synced_at: timestamp,
        records_synced: Math.floor(Math.random() * 500) + 1,
        errors: 0,
      },
      'notification.sent': {
        event_type: 'notification.sent',
        id: `notif_${id()}`,
        channel: 'email',
        sent_at: timestamp,
        recipient: `user_${id()}@example.com`,
        template: 'welcome_email',
        status: 'delivered',
      },
    },
  };

  return payloads[integration]?.[eventType] || { event_type: eventType, data: {}, timestamp };
};
