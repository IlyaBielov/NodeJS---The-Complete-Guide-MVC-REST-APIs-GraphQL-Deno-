const PDFDocument = require('pdfkit');
const path = require('node:path');
const fs = require('node:fs');

/**
 * Creates an invoice PDF for the given order
 * @param {Object} order - The order object containing products and user info
 * @param {string} orderId - The order ID for the invoice
 * @param {string} invoicesDir - Directory where to save the invoice
 * @returns {PDFDocument} - The PDF document instance
 */
exports.createInvoicePDF = (order, orderId, invoicesDir) => {
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join(invoicesDir, invoiceName);

    // Ensure invoices directory exists
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfDoc = new PDFDocument();
    
    // Handle file write errors
    const writeStream = fs.createWriteStream(invoicePath);
    writeStream.on('error', (err) => {
        console.error('Error writing PDF file:', err);
    });
    
    pdfDoc.pipe(writeStream);

    // Invoice Header
    pdfDoc.fontSize(20).font('Helvetica-Bold');
    pdfDoc.text('INVOICE', 50, 50);
    
    pdfDoc.fontSize(12).font('Helvetica');
    pdfDoc.text('NodeJS Shop', 50, 80);
    pdfDoc.text('123 Business Street', 50, 95);
    pdfDoc.text('City, State 12345', 50, 110);
    pdfDoc.text('contact@nodejsshop.com', 50, 125);

    // Invoice Details
    // Extract timestamp from ObjectId more safely
    const objectIdString = order._id.toString();
    const timestampHex = objectIdString.substring(0, 8);
    const orderDate = new Date(parseInt(timestampHex, 16) * 1000);
    
    // Format date safely with validation
    let formattedDate = '10/4/2025'; // fallback date
    if (orderDate && !isNaN(orderDate.getTime())) {
        formattedDate = `${orderDate.getMonth() + 1}/${orderDate.getDate()}/${orderDate.getFullYear()}`;
    }
    
    pdfDoc.text(`Invoice #:`, 300, 80);
    pdfDoc.text(`${orderId}`, 370, 80);
    pdfDoc.text(`Order Date:`, 300, 95);
    pdfDoc.text(formattedDate, 370, 95);
    pdfDoc.text(`Customer:`, 300, 110);
    pdfDoc.text(`${order.user.email}`, 370, 110);

    // Line separator
    pdfDoc.moveTo(50, 160).lineTo(550, 160).stroke();

    // Products Header
    let yPosition = 180;
    pdfDoc.fontSize(14).font('Helvetica-Bold');
    pdfDoc.text('Product', 50, yPosition);
    pdfDoc.text('Quantity', 300, yPosition);
    pdfDoc.text('Price', 380, yPosition);
    pdfDoc.text('Total', 480, yPosition);

    // Line under header
    pdfDoc.moveTo(50, yPosition + 20).lineTo(550, yPosition + 20).stroke();
    
    yPosition += 35;
    pdfDoc.fontSize(12).font('Helvetica');

    // Products List
    let totalAmount = 0;
    order.products.forEach(item => {
        const product = item.product;
        const quantity = item.quantity || 0;
        const price = product?.price || 0;
        const lineTotal = quantity * price;
        totalAmount += lineTotal;

        // Check if we need a new page
        if (yPosition > 700) {
            pdfDoc.addPage();
            yPosition = 50;
        }

        // Product details with safe fallbacks
        const productTitle = product?.title || 'Unknown Product';
        pdfDoc.text(productTitle, 50, yPosition, { width: 240, ellipsis: true });
        pdfDoc.text(quantity.toString(), 300, yPosition);
        pdfDoc.text(`$${price.toFixed(2)}`, 380, yPosition);
        pdfDoc.text(`$${lineTotal.toFixed(2)}`, 480, yPosition);
        
        yPosition += 25;
    });

    // Total section
    yPosition += 20;
    pdfDoc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 15;
    
    pdfDoc.fontSize(14).font('Helvetica-Bold');
    pdfDoc.text('Total Amount:', 380, yPosition);
    pdfDoc.text(`$${totalAmount.toFixed(2)}`, 480, yPosition);

    // Footer
    yPosition += 60;
    pdfDoc.fontSize(10).font('Helvetica');
    pdfDoc.text('Thank you for your business!', 50, yPosition);
    pdfDoc.text('For any questions, please contact us at contact@nodejsshop.com', 50, yPosition + 15);

    return pdfDoc;
};

/**
 * Gets the invoice filename for a given order ID
 * @param {string} orderId - The order ID
 * @returns {string} - The invoice filename
 */
exports.getInvoiceFilename = (orderId) => {
    return `invoice-${orderId}.pdf`;
};
