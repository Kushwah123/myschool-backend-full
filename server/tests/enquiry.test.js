const Enquiry = require('../models/Enquiry');
const enquiryController = require('../controllers/enquiryController');
const whatsappService = require('../utils/whatsappService');

jest.mock('../utils/whatsappService', () => ({
  isClientReady: jest.fn(() => true),
  formatPhoneNumber: jest.fn((value) => value),
  sendMessage: jest.fn(async () => ({ success: true })),
}));

describe('Enquiry Controller', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends a welcome WhatsApp message when an enquiry is created', async () => {
    const enquiry = {
      _id: 'eq_123',
      parentName: 'Rahul Sharma',
      mobile: '9876543210',
      email: 'rahul@example.com',
      address: 'Delhi',
      children: [],
    };

    const createSpy = jest.spyOn(Enquiry, 'create').mockResolvedValue(enquiry);

    const req = {
      body: {
        parentName: 'Rahul Sharma',
        mobile: '9876543210',
        email: 'rahul@example.com',
        address: 'Delhi',
        children: [],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await enquiryController.createEnquiry(req, res);

    expect(createSpy).toHaveBeenCalledWith(req.body);
    expect(whatsappService.isClientReady).toHaveBeenCalled();
    expect(whatsappService.sendMessage).toHaveBeenCalledWith(
      '9876543210',
      expect.stringContaining('Thank you for visiting')
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        enquiry,
        whatsapp: expect.objectContaining({ success: true }),
      })
    );
  });
});
