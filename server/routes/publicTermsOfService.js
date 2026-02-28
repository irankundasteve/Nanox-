import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  return res.json({
    data: {
      headline: 'Terms of Service',
      sections: [
        {
          title: 'Scope of Services',
          body: 'Nanox provides artistic photography services as described on this website. All services are subject to availability and confirmation.',
        },
        {
          title: 'Booking & Payment',
          body: 'Clients are responsible for confirming bookings and fulfilling any agreed payments.',
        },
        {
          title: 'Intellectual Property',
          body: 'All photographs displayed on this website are the property of Nanox. Unauthorized use, reproduction, or distribution is prohibited.',
        },
        {
          title: 'Liability',
          body: 'Nanox is not liable for any damages arising from the use of this website or its content.',
        },
        {
          title: 'Governing Law',
          body: 'These terms are governed by the laws of your country of residence.',
        },
      ],
    },
  });
});

export default router;
