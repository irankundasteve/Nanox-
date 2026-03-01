import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  return res.json({
    data: {
      headline: 'Privacy Policy',
      sections: [
        {
          title: 'Introduction',
          body: 'We respect your privacy. Any personal information collected on this website is used solely to respond to inquiries and provide services.',
        },
        {
          title: 'Information Collection',
          body: 'We may collect your name, email address, and phone number through contact forms or newsletter sign-ups.',
        },
        {
          title: 'Use of Information',
          body: 'Collected information is only used to contact you regarding your inquiries, bookings, or services.',
        },
        {
          title: 'Data Protection',
          body: 'We take reasonable measures to protect your information from unauthorized access.',
        },
        {
          title: 'Third-Party Services',
          body: 'Links to social media or third-party platforms (e.g., Facebook) may collect data independently. We are not responsible for their privacy practices.',
        },
        {
          title: 'Cookies',
          body: 'This website may use cookies to enhance user experience. No personal data is sold or shared with third parties.',
        },
      ],
    },
  });
});

export default router;
