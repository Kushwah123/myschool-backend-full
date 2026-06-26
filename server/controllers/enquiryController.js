const Enquiry = require('../models/Enquiry');
const whatsappService = require('../utils/whatsappService');

const buildEnquiryWelcomeMessage = ({ parentName, schoolName, schoolContact, schoolAddress }) => {
  const safeName = schoolName || 'Shri S. R. Inter College';
  const safeContact = schoolContact || '+91-8909861356';
  const safeAddress = schoolAddress || 'Theepuri Near Sati Mandir, Shamshabad To Fatehabad Road, Agra';
  const websiteUrl = 'https://srconvent.netlify.app';

  return [
    `Thank you for visiting ${safeName}, ${parentName || 'Parent'}! 🙏`,
    '',
    'We have received your enquiry and our team will contact you shortly.',
    '',
    `School: ${safeName}`,
    `Contact: ${safeContact}`,
    `Address: ${safeAddress}`,
    `Website: ${websiteUrl}`,
    '',
    'Welcome to our school family. We look forward to helping your child grow with confidence.',
  ].join('\n');
};

exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    let whatsappResult = {
      success: false,
      reason: 'WhatsApp client not ready or no valid phone available',
    };

    const phoneNumber = req.body.mobile?.trim();

    if (phoneNumber && whatsappService.isClientReady()) {
      const formattedPhone = whatsappService.formatPhoneNumber(phoneNumber);

      if (formattedPhone) {
        whatsappResult = await whatsappService.sendMessage(
          phoneNumber,
          buildEnquiryWelcomeMessage({
            parentName: req.body.parentName,
            schoolName: process.env.SCHOOL_NAME || 'Myschool',
            schoolContact:
              process.env.SCHOOL_CONTACT || process.env.SCHOOL_PHONE || '+91-XXXXXXXXXX',
            schoolAddress:
              process.env.SCHOOL_ADDRESS || 'Visit our school campus for admission details',
          })
        );

        whatsappResult.phoneNumber = phoneNumber;
      } else {
        whatsappResult = {
          success: false,
          reason: 'Invalid phone number format',
        };
      }
    } else if (phoneNumber) {
      whatsappResult.reason = 'WhatsApp client not ready';
    }

    res.status(201).json({ enquiry, whatsapp: whatsappResult });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ date: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

