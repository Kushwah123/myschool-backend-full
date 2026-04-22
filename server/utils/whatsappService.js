const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

class WhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.enabled = process.env.WHATSAPP_ENABLED !== 'false';
    this.sessionPath = path.join(__dirname, '../.wapp_auth');
    this.currentQR = null;
    this.scanStatus = 'disabled'; // disabled, initializing, waiting_scan, scanned, ready, error
    this.statusMessage = 'WhatsApp service is disabled';
    this.history = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.isReconnecting = false;

    // Ensure session directory exists
    this.ensureSessionDirectory();

    if (this.enabled && process.env.NODE_ENV !== 'test') {
      this.scanStatus = 'initializing';
      this.statusMessage = 'Starting WhatsApp service...';
      this.initializeClient();
    } else if (!this.enabled) {
      console.log('📱 WhatsApp service is disabled via WHATSAPP_ENABLED=false');
    } else {
      this.statusMessage = 'WhatsApp service initialization skipped in test environment';
      console.log('📱 WhatsApp service initialization skipped in test environment');
    }
  }

  ensureSessionDirectory() {
    try {
      if (!fs.existsSync(this.sessionPath)) {
        fs.mkdirSync(this.sessionPath, { recursive: true });
        console.log('📁 Created WhatsApp session directory:', this.sessionPath);
      }

      // Clean up old timestamped directories
      const parentDir = path.dirname(this.sessionPath);
      const items = fs.readdirSync(parentDir).filter(item =>
        item.startsWith('.wapp_auth_') && item !== path.basename(this.sessionPath)
      );

      if (items.length > 0) {
        console.log('🧹 Cleaning up old WhatsApp auth directories:', items);
        items.forEach(dir => {
          const fullPath = path.join(parentDir, dir);
          try {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } catch (error) {
            console.warn('Failed to remove old auth dir:', fullPath, error.message);
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring session directory:', error);
    }
  }

  initializeClient() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'myschool-app',
          dataPath: this.sessionPath,
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      });

      // QR Code for initial authentication
      this.client.on('qr', (qr) => {
        this.currentQR = qr;
        this.scanStatus = 'waiting_scan';
        this.statusMessage = 'Scan the QR code with WhatsApp';
        console.log('📱 WhatsApp QR Code - Scan with your phone:');
        qrcode.generate(qr, { small: true });
      });

      // Client ready
      this.client.on('ready', () => {
        this.isReady = true;
        this.scanStatus = 'ready';
        this.statusMessage = 'WhatsApp connected successfully! 🎉';
        this.currentQR = null;
        console.log('✅ WhatsApp Client is ready!');
      });

      // Authentication failed
      this.client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failed:', msg);
        this.isReady = false;
        this.scanStatus = 'error';
        this.statusMessage = 'Authentication failed. Please rescan QR code.';
        this.currentQR = null;
        setTimeout(() => this.reconnectClient(), 3000);
      });

      // Disconnected
      this.client.on('disconnected', (reason) => {
        console.log('⚠️ WhatsApp Client disconnected:', reason);
        this.isReady = false;
        this.scanStatus = 'initializing';
        this.statusMessage = 'WhatsApp disconnected. Reconnecting...';
        this.currentQR = null;
        setTimeout(() => this.reconnectClient(), 3000);
      });

      // Initialize the client
      this.client.initialize().catch((error) => {
        console.error('❌ Failed to initialize WhatsApp client:', error.message);
        this.scanStatus = 'error';
        this.statusMessage = 'WhatsApp service failed to start. Will retry in 30 seconds.';
        this.isReady = false;
        // Retry after 30 seconds
        setTimeout(() => {
          console.log('🔄 Retrying WhatsApp client initialization...');
          this.initializeClient();
        }, 30000);
      });
    } catch (error) {
      console.error('❌ Error in WhatsApp client setup:', error);
      this.scanStatus = 'error';
      this.statusMessage = 'WhatsApp service setup failed.';
      this.isReady = false;
    }
  }

  async reconnectClient() {
    try {
      if (this.client) {
        await this.client.destroy();
      }
    } catch (error) {
      console.error('Error destroying WhatsApp client before reconnect:', error);
    }

    this.client = null;
    this.isReady = false;
    this.scanStatus = 'initializing';
    this.statusMessage = 'Reconnecting WhatsApp client...';
    this.currentQR = null;

    setTimeout(() => this.initializeClient(), 2000);
  }

  /**
   * Send a message to a WhatsApp number
   * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
   * @param {string} message - Message to send
   * @returns {Promise<boolean>} - Success status
   */
  async sendMessage(phoneNumber, message) {
    if (!this.isReady) {
      console.warn('WhatsApp client not ready. Message not sent:', phoneNumber);
      return { success: false, reason: 'WhatsApp client not ready' };
    }

    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    if (!formattedNumber) {
      console.error('Invalid phone number:', phoneNumber);
      return { success: false, reason: 'Invalid phone number format' };
    }

    const chatId = `${formattedNumber}@c.us`;

    try {
      await this.client.sendMessage(chatId, message);
      console.log(`✅ Message sent to ${phoneNumber} (${chatId})`);
      return { success: true };
    } catch (error) {
      const reason = error.message || 'WhatsApp send failed';
      console.error(`Error sending message to ${phoneNumber} (${chatId}):`, reason);
      return { success: false, reason };
    }
  }

  /**
   * Send bulk messages to multiple numbers
   * @param {Array} recipients - Array of objects {phoneNumber, message}
   * @returns {Promise<Object>} - {success: number, failed: number, results: array}
   */
  async sendBulkMessages(recipients) {
    if (!this.isReady) {
      console.warn('WhatsApp client not ready. Bulk messages not sent');
      const failedResults = recipients.map((recipient) => ({
        phoneNumber: recipient.phoneNumber,
        status: 'failed',
        studentName: recipient.studentName,
        parentName: recipient.parentName,
        reason: 'WhatsApp client not ready',
      }));
      const historyEntry = {
        timestamp: new Date().toISOString(),
        total: recipients.length,
        success: 0,
        failed: recipients.length,
        reason: 'WhatsApp client not ready',
        results: failedResults,
      };
      this.addHistoryEntry(historyEntry);
      return {
        success: 0,
        failed: recipients.length,
        results: failedResults,
        error: 'WhatsApp client not ready',
      };
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    console.log(`📤 Sending WhatsApp to ${recipients.length} recipients...`);

    for (const recipient of recipients) {
      try {
        const result = await this.sendMessage(recipient.phoneNumber, recipient.message);
        if (result.success) {
          successCount++;
          results.push({
            phoneNumber: recipient.phoneNumber,
            status: 'sent',
            studentName: recipient.studentName,
            parentName: recipient.parentName,
          });
        } else {
          failCount++;
          results.push({
            phoneNumber: recipient.phoneNumber,
            status: 'failed',
            studentName: recipient.studentName,
            parentName: recipient.parentName,
            reason: result.reason || 'Send operation failed',
          });
        }
        // Add delay between messages to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        failCount++;
        results.push({
          phoneNumber: recipient.phoneNumber,
          status: 'failed',
          studentName: recipient.studentName,
          parentName: recipient.parentName,
          reason: error.message || 'Unexpected error',
        });
      }
    }

    const historyEntry = {
      timestamp: new Date().toISOString(),
      total: recipients.length,
      success: successCount,
      failed: failCount,
      results,
    };
    this.addHistoryEntry(historyEntry);

    return {
      success: successCount,
      failed: failCount,
      results,
    };
  }

  addHistoryEntry(entry) {
    this.history.push(entry);
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }
  }

  getHistory(limit = 50) {
    return this.history.slice(-limit).reverse();
  }

  /**
   * Format phone number to standard format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string|null} - Formatted phone number or null if invalid
   */
  formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return null;

    let formatted = phoneNumber.toString().trim();

    // Remove all non-digit characters
    formatted = formatted.replace(/\D/g, '');

    // Remove leading international prefix 00 if present
    if (formatted.startsWith('00')) {
      formatted = formatted.replace(/^0+/, '');
    }

    // If number starts with 0 and is not international, remove leading 0
    if (formatted.startsWith('0') && formatted.length > 1) {
      formatted = formatted.substring(1);
    }

    // If number is 10 digits and starts with 9, it may already be country code removed incorrectly
    if (formatted.length === 10 && !formatted.startsWith('91')) {
      formatted = '91' + formatted;
    }

    // If number is 11 digits and starts with 1 (e.g. 091...), remove leading 0
    if (formatted.length === 11 && formatted.startsWith('091')) {
      formatted = formatted.substring(1);
    }

    // If user enters +91..., digits-only form begins with 91 already
    if (formatted.startsWith('91') && formatted.length === 12) {
      // valid Indian number as-is
    }

    // Validate overall length (91 + 10 digits) or common international ranges
    if (formatted.length < 10 || formatted.length > 15) {
      return null;
    }

    return formatted;
  }

  /**
   * Get QR Code and status for admin panel
   * @returns {Object} - {qr: string|null, status: string, message: string, isReady: boolean}
   */
  getQRStatus() {
    const status = {
      qr: this.currentQR,
      status: this.scanStatus,
      message: this.statusMessage,
      isReady: this.isReady,
    };
    console.log('📊 WhatsApp Status:', {
      hasQR: !!status.qr,
      status: status.status,
      isReady: status.isReady,
      message: status.message,
    });
    return status;
  }

  /**
   * Check if client is ready
   * @returns {boolean}
   */
  isClientReady() {
    return this.isReady;
  }

  /**
   * Disconnect the client
   */
  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isReady = false;
      console.log('WhatsApp client disconnected');
    }
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
