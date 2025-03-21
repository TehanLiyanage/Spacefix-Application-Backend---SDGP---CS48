// const { db } = require('../config/firebase');
// const nodemailer = require('nodemailer');

// // // Configure nodemailer transporter with more reliable settings
// // const transporter = nodemailer.createTransport({
// //   host: 'smtp.gmail.com',
// //   port: 587,
// //   secure: false, // use STARTTLS
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASSWORD
// //   },
// //   tls: {
// //     rejectUnauthorized: true // Set to false only for testing if having TLS issues
// //   }
// // });

// // Configure nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Or use SMTP configuration
//   auth: {
//     user: process.env.EMAIL_USER, // Use environment variables for security
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// // Get all lecturer reservation requests
// exports.getAllLecturerRequests = async (req, res) => {
//   try {
//     const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
    
//     if (snapshot.empty) {
//       return res.json({
//         today: [],
//         upcoming: [],
//         previous: []
//       });
//     }
    
//     const lecturerRequests = [];
//     snapshot.forEach(doc => {
//       lecturerRequests.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });
    
//     // Separate reservations based on date (today, upcoming, previous)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const todayReservations = [];
//     const upcomingReservations = [];
//     const previousReservations = [];
    
//     lecturerRequests.forEach(request => {
//       const reservationDate = new Date(request.date);
//       reservationDate.setHours(0, 0, 0, 0);
      
//       if (reservationDate.getTime() === today.getTime()) {
//         todayReservations.push(request);
//       } else if (reservationDate > today) {
//         upcomingReservations.push(request);
//       } else {
//         previousReservations.push(request);
//       }
//     });
    
//     res.json({
//       today: todayReservations,
//       upcoming: upcomingReservations,
//       previous: previousReservations
//     });
//   } catch (error) {
//     console.error('Error getting lecturer requests:', error);
//     res.status(500).json({ error: 'Failed to fetch lecturer requests' });
//   }
// };

// // Get lecturer requests by status
// exports.getLecturerRequestsByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
    
//     const snapshot = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .where('status', '==', status)
//       .get();
    
//     if (snapshot.empty) {
//       return res.json({
//         today: [],
//         upcoming: [],
//         previous: []
//       });
//     }
    
//     const lecturerRequests = [];
//     snapshot.forEach(doc => {
//       lecturerRequests.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });
    
//     // Separate reservations based on date (today, upcoming, previous)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const todayReservations = [];
//     const upcomingReservations = [];
//     const previousReservations = [];
    
//     lecturerRequests.forEach(request => {
//       const reservationDate = new Date(request.date);
//       reservationDate.setHours(0, 0, 0, 0);
      
//       if (reservationDate.getTime() === today.getTime()) {
//         todayReservations.push(request);
//       } else if (reservationDate > today) {
//         upcomingReservations.push(request);
//       } else {
//         previousReservations.push(request);
//       }
//     });
    
//     res.json({
//       today: todayReservations,
//       upcoming: upcomingReservations,
//       previous: previousReservations
//     });
//   } catch (error) {
//     console.error(`Error getting ${req.params.status} lecturer requests:`, error);
//     res.status(500).json({ error: `Failed to fetch ${req.params.status} lecturer requests` });
//   }
// };

// // Get a single lecturer request by ID
// exports.getLecturerRequestById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const docRef = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     if (!docRef.exists) {
//       return res.status(404).json({ error: 'Lecturer request not found' });
//     }
    
//     res.json({
//       id: docRef.id,
//       ...docRef.data()
//     });
//   } catch (error) {
//     console.error('Error getting lecturer request:', error);
//     res.status(500).json({ error: 'Failed to fetch lecturer request' });
//   }
// };

// // Create a new lecturer reservation request
// exports.createLecturerRequest = async (req, res) => {
//   try {
//     const { 
//       lecturerId, 
//       lecturerName, 
//       date, 
//       startTime, 
//       endTime, 
//       purpose, 
//       department,
//       email,
//       phone, 
//       additionalInfo 
//     } = req.body;
    
//     // Validate required fields
//     if (!lecturerId || !lecturerName || !date || !startTime || !endTime || !purpose || !department) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
    
//     // Create new document with generated timestamp
//     const newRequest = {
//       lecturerId,
//       lecturerName,
//       date,
//       startTime,
//       endTime,
//       purpose,
//       department,
//       email: email || '',
//       phone: phone || '',
//       additionalInfo: additionalInfo || '',
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     };
    
//     // Add to Firebase
//     const docRef = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .add(newRequest);
    
//     // Add ID to the document
//     const createdRequest = {
//       id: docRef.id,
//       ...newRequest
//     };
    
//     // Emit WebSocket event
//     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
//       type: 'created',
//       request: createdRequest
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Reservation request created successfully',
//       data: createdRequest
//     });
//   } catch (error) {
//     console.error('Error creating lecturer request:', error);
//     res.status(500).json({ error: 'Failed to create reservation request' });
//   }
// };

// // Update lecturer request status
// // exports.updateLecturerRequestStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status, approvalMessage, allocatedRoom } = req.body;
    
// //     // Create update object
// //     const updateData = { status };
    
// //     // If status is 'approved', add approval message and allocated room
// //     if (status === 'approved') {
// //       if (!allocatedRoom) {
// //         return res.status(400).json({ error: 'Room allocation is required for approval' });
// //       }
      
// //       updateData.approvalMessage = approvalMessage || '';
// //       updateData.allocatedRoom = allocatedRoom;
// //       updateData.approvedAt = new Date().toISOString();
// //     } else if (status === 'rejected') {
// //       updateData.rejectionReason = req.body.rejectionReason || '';
// //       updateData.rejectedAt = new Date().toISOString();
// //     }
    
// //     // Update the document in Firebase
// //     await db.collection('IIT')
// //       .doc('reservation')
// //       .collection('lecturers')
// //       .doc(id)
// //       .update(updateData);
    
// //     // Get the updated document
// //     const updatedDoc = await db.collection('IIT')
// //       .doc('reservation')
// //       .collection('lecturers')
// //       .doc(id)
// //       .get();
    
// //     const updatedRequest = {
// //       id: updatedDoc.id,
// //       ...updatedDoc.data()
// //     };
    
// //     // Emit a WebSocket event to notify all clients
// //     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
// //       type: 'statusChange',
// //       requestId: id,
// //       status,
// //       request: updatedRequest
// //     });
    
// //     res.json({ 
// //       success: true, 
// //       message: `Request ${status} successfully`,
// //       data: updatedRequest
// //     });
// //   } catch (error) {
// //     console.error('Error updating lecturer request status:', error);
// //     res.status(500).json({ error: 'Failed to update request status' });
// //   }
// // };


// // exports.updateLecturerRequestStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status, approvalMessage, allocatedRoom, rejectionReason } = req.body;
    
// //     // Get the current document to access lecturer email
// //     const lecturerDoc = await db.collection('IIT')
// //       .doc('reservation')
// //       .collection('lecturers')
// //       .doc(id)
// //       .get();
    
// //     if (!lecturerDoc.exists) {
// //       return res.status(404).json({ error: 'Lecturer request not found' });
// //     }
    
// //     const lecturerData = lecturerDoc.data();
// //     // Try to get email from either direct email field or from lecturer.email
// //     const lecturerEmail = lecturerData.email || (lecturerData.lecturer && lecturerData.lecturer.email);
    
// //     // Create update object
// //     const updateData = { status };
    
// //     // If status is 'approved', add approval message and allocated room
// //     if (status === 'approved') {
// //       if (!allocatedRoom) {
// //         return res.status(400).json({ error: 'Room allocation is required for approval' });
// //       }
      
// //       updateData.approvalMessage = approvalMessage || '';
// //       updateData.allocatedRoom = allocatedRoom;
// //       updateData.approvedAt = new Date().toISOString();
// //     } else if (status === 'rejected') {
// //       updateData.rejectionReason = rejectionReason || '';
// //       updateData.rejectedAt = new Date().toISOString();
// //     }
    
// //     // Update the document in Firebase
// //     await db.collection('IIT')
// //       .doc('reservation')
// //       .collection('lecturers')
// //       .doc(id)
// //       .update(updateData);
    
// //     // Get the updated document
// //     const updatedDoc = await db.collection('IIT')
// //       .doc('reservation')
// //       .collection('lecturers')
// //       .doc(id)
// //       .get();
    
// //     const updatedRequest = {
// //       id: updatedDoc.id,
// //       ...updatedDoc.data()
// //     };
    
// //     // Emit a WebSocket event to notify all clients
// //     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
// //       type: 'statusChange',
// //       requestId: id,
// //       status,
// //       request: updatedRequest
// //     });
    
// //     // Send email notification if email is available
// //     if (lecturerEmail) {
// //       try {
// //         console.log('Attempting to send email to:', lecturerEmail);
// //         console.log('Email credentials available:', !!process.env.EMAIL_USER, !!process.env.EMAIL_PASSWORD);
        
// //         // Prepare email content based on status
// //         let emailSubject, emailContent;
// //         const lecturerName = lecturerData.lecturerName || (lecturerData.lecturer && lecturerData.lecturer.name) || 'Lecturer';
// //         const formattedDate = new Date(lecturerData.date).toLocaleDateString();
// //         const timeRange = `${lecturerData.startTime} - ${lecturerData.endTime}`;
        
// //         if (status === 'approved') {
// //           emailSubject = 'Your Lecture Request Has Been Approved';
// //           emailContent = `
// //             <h2>Lecture Request Approved</h2>
// //             <p>Dear ${lecturerName},</p>
// //             <p>Your request for an extra lecture on <strong>${formattedDate}</strong> at <strong>${timeRange}</strong> has been approved.</p>
// //             <p><strong>Allocated Room:</strong> ${allocatedRoom}</p>
// //             ${approvalMessage ? `<p><strong>Additional Information:</strong> ${approvalMessage}</p>` : ''}
// //             <p>Thank you for using our reservation system.</p>
// //             <p>Regards,<br>University Admin Team</p>
// //           `;
// //         } else if (status === 'rejected') {
// //           emailSubject = 'Your Lecture Request Has Been Declined';
// //           emailContent = `
// //             <h2>Lecture Request Declined</h2>
// //             <p>Dear ${lecturerName},</p>
// //             <p>Unfortunately, your request for an extra lecture on <strong>${formattedDate}</strong> at <strong>${timeRange}</strong> has been declined.</p>
// //             ${updateData.rejectionReason ? `<p><strong>Reason:</strong> ${updateData.rejectionReason}</p>` : ''}
// //             <p>If you have any questions, please contact the administration office.</p>
// //             <p>Regards,<br>University Admin Team</p>
// //           `;
// //         }
        
// //         // Send email if subject and content are defined
// //         if (emailSubject && emailContent) {
// //           // Using callback for better error handling
// //           await new Promise((resolve, reject) => {
// //             transporter.sendMail({
// //               from: `"University Admin" <${process.env.EMAIL_USER}>`,
// //               to: lecturerEmail,
// //               subject: emailSubject,
// //               html: emailContent
// //             }, (error, info) => {
// //               if (error) {
// //                 console.error('Detailed email error:', error);
// //                 reject(error);
// //               } else {
// //                 console.log('Email sent successfully:', info.response);
// //                 resolve(info);
// //               }
// //             });
// //           });
// //         }
// //       } catch (emailError) {
// //         // Log email error but don't fail the request
// //         console.error('Error sending email notification:', emailError);
// //       }
// //     } else {
// //       console.log('No email address found for lecturer. Skipping notification.');
// //     }
    
// //     res.json({ 
// //       success: true, 
// //       message: `Request ${status} successfully`,
// //       data: updatedRequest
// //     });
// //   } catch (error) {
// //     console.error('Error updating lecturer request status:', error);
// //     res.status(500).json({ error: 'Failed to update request status' });
// //   }
// // };
// exports.updateLecturerRequestStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, approvalMessage, allocatedRoom } = req.body;
    
//     // Get the current document to access lecturer email
//     const lecturerDoc = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     if (!lecturerDoc.exists) {
//       return res.status(404).json({ error: 'Lecturer request not found' });
//     }
    
//     const lecturerData = lecturerDoc.data();
//     const lecturerEmail = lecturerData.email || (lecturerData.lecturer && lecturerData.lecturer.email);
    
//     // Create update object
//     const updateData = { status };
    
//     // If status is 'approved', add approval message and allocated room
//     if (status === 'approved') {
//       if (!allocatedRoom) {
//         return res.status(400).json({ error: 'Room allocation is required for approval' });
//       }
      
//       updateData.approvalMessage = approvalMessage || '';
//       updateData.allocatedRoom = allocatedRoom;
//       updateData.approvedAt = new Date().toISOString();
//     } else if (status === 'rejected') {
//       updateData.rejectionReason = req.body.rejectionReason || '';
//       updateData.rejectedAt = new Date().toISOString();
//     }
    
//     // Update the document in Firebase
//     await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .update(updateData);
    
//     // Get the updated document
//     const updatedDoc = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     const updatedRequest = {
//       id: updatedDoc.id,
//       ...updatedDoc.data()
//     };
    
//     // Emit a WebSocket event to notify all clients
//     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
//       type: 'statusChange',
//       requestId: id,
//       status,
//       request: updatedRequest
//     });
    
//     // Send email notification if email is available
//     if (lecturerEmail) {
//       try {

//         console.log('Attempting to send email to:', lecturerEmail);
//         console.log('Email credentials available:', !!process.env.EMAIL_USER, !!process.env.EMAIL_PASSWORD);
//         // Prepare email content based on status
//         let emailSubject, emailContent;
//         const formattedDate = new Date(lecturerData.date).toLocaleDateString();
//         const timeRange = `${lecturerData.startTime} - ${lecturerData.endTime}`;
        
//         if (status === 'approved') {
//           emailSubject = 'Your Lecture Request Has Been Approved';
//           emailContent = `
//             <h2>Lecture Request Approved</h2>
//             <p>Dear ${lecturerData.lecturerName || 'Lecturer'},</p>
//             <p>Your request for an extra lecture on <strong>${formattedDate}</strong> at <strong>${timeRange}</strong> has been approved.</p>
//             <p><strong>Allocated Room:</strong> ${allocatedRoom}</p>
//             ${approvalMessage ? `<p><strong>Additional Information:</strong> ${approvalMessage}</p>` : ''}
//             <p>Thank you for using our reservation system.</p>
//             <p>Regards,<br>University Admin Team</p>
//           `;
//         } else if (status === 'rejected') {
//           emailSubject = 'Your Lecture Request Has Been Declined';
//           emailContent = `
//             <h2>Lecture Request Declined</h2>
//             <p>Dear ${lecturerData.lecturerName || 'Lecturer'},</p>
//             <p>Unfortunately, your request for an extra lecture on <strong>${formattedDate}</strong> at <strong>${timeRange}</strong> has been declined.</p>
//             ${updateData.rejectionReason ? `<p><strong>Reason:</strong> ${updateData.rejectionReason}</p>` : ''}
//             <p>If you have any questions, please contact the administration office.</p>
//             <p>Regards,<br>University Admin Team</p>
//           `;
//         }
        
//         // Send email if subject and content are defined
//         if (emailSubject && emailContent) {
//           await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: lecturerEmail,
//             subject: emailSubject,
//             html: emailContent
//           });
          
//           console.log(`Email notification sent to ${lecturerEmail}`);
//         }
//       } catch (emailError) {
//         // Log email error but don't fail the request
//         console.error('Error sending email notification:', emailError);
//       }
//     }
    
//     res.json({ 
//       success: true, 
//       message: `Request ${status} successfully`,
//       data: updatedRequest
//     });
//   } catch (error) {
//     console.error('Error updating lecturer request status:', error);
//     res.status(500).json({ error: 'Failed to update request status' });
//   }
// };


// // Update lecturer request details
// exports.updateLecturerRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       date, 
//       startTime, 
//       endTime, 
//       purpose, 
//       additionalInfo 
//     } = req.body;
    
//     // Check if the document exists
//     const docRef = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     if (!docRef.exists) {
//       return res.status(404).json({ error: 'Lecturer reservation not found' });
//     }
    
//     // Create update object with only provided fields
//     const updateData = {};
//     if (date) updateData.date = date;
//     if (startTime) updateData.startTime = startTime;
//     if (endTime) updateData.endTime = endTime;
//     if (purpose) updateData.purpose = purpose;
//     if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo;
    
//     // Add last updated timestamp
//     updateData.updatedAt = new Date().toISOString();
    
//     // Update the document in Firebase
//     await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .update(updateData);
    
//     // Get the updated document
//     const updatedDoc = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     const updatedRequest = {
//       id: updatedDoc.id,
//       ...updatedDoc.data()
//     };
    
//     // Emit a WebSocket event to notify all clients
//     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
//       type: 'updated',
//       requestId: id,
//       request: updatedRequest
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Request updated successfully',
//       data: updatedRequest
//     });
//   } catch (error) {
//     console.error('Error updating lecturer request:', error);
//     res.status(500).json({ error: 'Failed to update request' });
//   }
// };

// // Delete a lecturer reservation
// exports.deleteLecturerReservation = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if the document exists
//     const docRef = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .get();
    
//     if (!docRef.exists) {
//       return res.status(404).json({ error: 'Lecturer reservation not found' });
//     }
    
//     // Get the document data before deletion (for WebSocket event)
//     const deletedRequest = {
//       id: docRef.id,
//       ...docRef.data()
//     };
    
//     // Delete the document in Firebase
//     await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .doc(id)
//       .delete();
    
//     // Emit a WebSocket event to notify all clients
//     req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
//       type: 'deleted',
//       requestId: id,
//       request: deletedRequest
//     });
    
//     res.json({ 
//       success: true, 
//       message: 'Reservation deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Error deleting lecturer reservation:', error);
//     res.status(500).json({ error: 'Failed to delete reservation' });
//   }
// };

// // Get lecturer reservations by date range
// exports.getLecturerRequestsByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     if (!startDate || !endDate) {
//       return res.status(400).json({ error: 'Start date and end date are required' });
//     }
    
//     // Parse dates
//     const startDateObj = new Date(startDate);
//     const endDateObj = new Date(endDate);
//     startDateObj.setHours(0, 0, 0, 0);
//     endDateObj.setHours(23, 59, 59, 999);
    
//     if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
//       return res.status(400).json({ error: 'Invalid date format' });
//     }
    
//     // Get all documents and filter by date (Firestore doesn't support range queries on multiple fields)
//     const snapshot = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .get();
    
//     if (snapshot.empty) {
//       return res.json([]);
//     }
    
//     const lecturerRequests = [];
//     snapshot.forEach(doc => {
//       const data = doc.data();
//       const reservationDate = new Date(data.date);
      
//       if (reservationDate >= startDateObj && reservationDate <= endDateObj) {
//         lecturerRequests.push({
//           id: doc.id,
//           ...data
//         });
//       }
//     });
    
//     res.json(lecturerRequests);
//   } catch (error) {
//     console.error('Error getting lecturer requests by date range:', error);
//     res.status(500).json({ error: 'Failed to fetch lecturer requests by date range' });
//   }
// };

// // Get lecturer reservations by room
// exports.getLecturerRequestsByRoom = async (req, res) => {
//   try {
//     const { room } = req.params;
    
//     const snapshot = await db.collection('IIT')
//       .doc('reservation')
//       .collection('lecturers')
//       .where('allocatedRoom', '==', room)
//       .where('status', '==', 'approved')
//       .get();
    
//     if (snapshot.empty) {
//       return res.json([]);
//     }
    
//     const lecturerRequests = [];
//     snapshot.forEach(doc => {
//       lecturerRequests.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });
    
//     res.json(lecturerRequests);
//   } catch (error) {
//     console.error(`Error getting lecturer requests for room ${req.params.room}:`, error);
//     res.status(500).json({ error: `Failed to fetch lecturer requests for room ${req.params.room}` });
//   }
// };


const { db } = require('../config/firebase');
const nodemailer = require('nodemailer');

// Updated Nodemailer transporter with more reliable settings for Gmail
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // use TLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_APP_PASSWORD // Use an App Password instead of regular password
//   },
//   tls: {
//     rejectUnauthorized: true
//   }
// });

// // Test the connection when the server starts
// transporter.verify(function(error, success) {
//   if (error) {
//     console.log('SMTP server connection error:', error);
//   } else {
//     console.log('SMTP server connection successful');
//   }
// });

// Updated Nodemailer configuration to avoid spam folders
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Use App Password
  },
  tls: {
    rejectUnauthorized: true
  },
  // Add DKIM configuration if you have set it up
  // dkim: {
  //   domainName: 'yourdomain.com',
  //   keySelector: 'email',
  //   privateKey: process.env.DKIM_PRIVATE_KEY
  // }
});

// Test the connection when the server starts
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection successful');
  }
});

// Helper function for sending emails with improved deliverability
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create proper mail options with spam-avoiding techniques
    const mailOptions = {
      from: {
        name: "University Admin",
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: subject,
      html: htmlContent,
      // Add important headers to avoid spam filters
      headers: {
        'X-Priority': '1', // Set priority
        'X-MSMail-Priority': 'High',
        'Importance': 'High',
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>` // Important for deliverability
      },
      // Text version always helps with deliverability
      text: htmlToText(htmlContent),
      // Calendar invites can help legitimate emails avoid spam
      icalEvent: subject.includes('Approved') ? {
        method: 'request',
        content: generateICS(subject, htmlContent)
      } : undefined
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Simple HTML to plain text converter
function htmlToText(html) {
  return html
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<[^>]*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

// Simple ICS generator for calendar invites
function generateICS(subject, content) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//University//Lecture Reservation//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
DTSTART:${formatICSDate(tomorrow)}
DTEND:${formatICSDate(new Date(tomorrow.getTime() + 3600000))}
DTSTAMP:${formatICSDate(now)}
ORGANIZER;CN=University Admin:mailto:${process.env.EMAIL_USER}
UID:${Math.random().toString(36).substring(2)}@university.edu
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=
 TRUE;CN=Lecturer:mailto:recipient@example.com
SUMMARY:${subject}
DESCRIPTION:${htmlToText(content).replace(/\n/g, '\\n')}
SEQUENCE:0
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

function formatICSDate(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

// Get all lecturer reservation requests
exports.getAllLecturerRequests = async (req, res) => {
  try {
    const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
    
    if (snapshot.empty) {
      return res.json({
        today: [],
        upcoming: [],
        previous: []
      });
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Separate reservations based on date (today, upcoming, previous)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReservations = [];
    const upcomingReservations = [];
    const previousReservations = [];
    
    lecturerRequests.forEach(request => {
      const reservationDate = new Date(request.date);
      reservationDate.setHours(0, 0, 0, 0);
      
      if (reservationDate.getTime() === today.getTime()) {
        todayReservations.push(request);
      } else if (reservationDate > today) {
        upcomingReservations.push(request);
      } else {
        previousReservations.push(request);
      }
    });
    
    res.json({
      today: todayReservations,
      upcoming: upcomingReservations,
      previous: previousReservations
    });
  } catch (error) {
    console.error('Error getting lecturer requests:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer requests' });
  }
};

// Get lecturer requests by status
exports.getLecturerRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .where('status', '==', status)
      .get();
    
    if (snapshot.empty) {
      return res.json({
        today: [],
        upcoming: [],
        previous: []
      });
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Separate reservations based on date (today, upcoming, previous)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayReservations = [];
    const upcomingReservations = [];
    const previousReservations = [];
    
    lecturerRequests.forEach(request => {
      const reservationDate = new Date(request.date);
      reservationDate.setHours(0, 0, 0, 0);
      
      if (reservationDate.getTime() === today.getTime()) {
        todayReservations.push(request);
      } else if (reservationDate > today) {
        upcomingReservations.push(request);
      } else {
        previousReservations.push(request);
      }
    });
    
    res.json({
      today: todayReservations,
      upcoming: upcomingReservations,
      previous: previousReservations
    });
  } catch (error) {
    console.error(`Error getting ${req.params.status} lecturer requests:`, error);
    res.status(500).json({ error: `Failed to fetch ${req.params.status} lecturer requests` });
  }
};

// Get a single lecturer request by ID
exports.getLecturerRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer request not found' });
    }
    
    res.json({
      id: docRef.id,
      ...docRef.data()
    });
  } catch (error) {
    console.error('Error getting lecturer request:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer request' });
  }
};

// Create a new lecturer reservation request
exports.createLecturerRequest = async (req, res) => {
  try {
    const { 
      lecturerId, 
      lecturerName, 
      date, 
      startTime, 
      endTime, 
      purpose, 
      department,
      email,
      phone, 
      additionalInfo 
    } = req.body;
    
    // Validate required fields
    if (!lecturerId || !lecturerName || !date || !startTime || !endTime || !purpose || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new document with generated timestamp
    const newRequest = {
      lecturerId,
      lecturerName,
      date,
      startTime,
      endTime,
      purpose,
      department,
      email: email || '',
      phone: phone || '',
      additionalInfo: additionalInfo || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to Firebase
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .add(newRequest);
    
    // Add ID to the document
    const createdRequest = {
      id: docRef.id,
      ...newRequest
    };
    
    // Emit WebSocket event
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'created',
      request: createdRequest
    });
    
    res.status(201).json({
      success: true,
      message: 'Reservation request created successfully',
      data: createdRequest
    });
  } catch (error) {
    console.error('Error creating lecturer request:', error);
    res.status(500).json({ error: 'Failed to create reservation request' });
  }
};

// Update lecturer request status with improved email functionality
exports.updateLecturerRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalMessage, allocatedRoom } = req.body;
    
    // Get the current document to access lecturer email
    const lecturerDoc = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!lecturerDoc.exists) {
      return res.status(404).json({ error: 'Lecturer request not found' });
    }
    
    const lecturerData = lecturerDoc.data();
    const lecturerEmail = lecturerData.email || (lecturerData.lecturer && lecturerData.lecturer.email);
    
    // Create update object
    const updateData = { status };
    
    // If status is 'approved', add approval message and allocated room
    if (status === 'approved') {
      if (!allocatedRoom) {
        return res.status(400).json({ error: 'Room allocation is required for approval' });
      }
      
      updateData.approvalMessage = approvalMessage || '';
      updateData.allocatedRoom = allocatedRoom;
      updateData.approvedAt = new Date().toISOString();
    } else if (status === 'rejected') {
      updateData.rejectionReason = req.body.rejectionReason || '';
      updateData.rejectedAt = new Date().toISOString();
    }
    
    // Update the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .update(updateData);
    
    // Get the updated document
    const updatedDoc = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    const updatedRequest = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'statusChange',
      requestId: id,
      status,
      request: updatedRequest
    });
    
    // Send email notification if email is available
    // Inside the updateLecturerRequestStatus function:

// Send email notification if email is available
if (lecturerEmail) {
  try {
    console.log('Preparing to send email notification to:', lecturerEmail);
    
    // Prepare email content based on status
    let emailSubject, emailContent;
    const formattedDate = new Date(lecturerData.date).toLocaleDateString();
    const timeRange = `${lecturerData.startTime} - ${lecturerData.endTime}`;
    
    if (status === 'approved') {
      emailSubject = 'Your Lecture Request Has Been Approved';
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lecture Request Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
            .highlight { background-color: #e6f7ff; padding: 15px; border-left: 4px solid #0066cc; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Lecture Request Approved</h2>
          </div>
          
          <div class="content">
            <p>Dear ${lecturerData.lecturerName || 'Lecturer'},</p>
            
            <p>We're pleased to inform you that your request for an extra lecture has been <strong>approved</strong>.</p>
            
            <div class="highlight">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${timeRange}</p>
              <p><strong>Allocated Room:</strong> ${allocatedRoom}</p>
              ${approvalMessage ? `<p><strong>Additional Information:</strong> ${approvalMessage}</p>` : ''}
            </div>
            
            <p>You can access your reservation details through our system at any time.</p>
            
            <p>Thank you for using our reservation system.</p>
            
            <p>Best regards,<br>University Admin Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} University Administration</p>
          </div>
        </body>
        </html>
      `;
    } else if (status === 'rejected') {
      emailSubject = 'Update Regarding Your Lecture Request';
      emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lecture Request Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background-color: #4a4a4a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
            .info-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a4a4a; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Lecture Request Status Update</h2>
          </div>
          
          <div class="content">
            <p>Dear ${lecturerData.lecturerName || 'Lecturer'},</p>
            
            <p>We're writing to inform you about your recent lecture request.</p>
            
            <div class="info-box">
              <p><strong>Date Requested:</strong> ${formattedDate}</p>
              <p><strong>Time Requested:</strong> ${timeRange}</p>
              <p><strong>Status:</strong> We are unable to accommodate this request at this time.</p>
              ${updateData.rejectionReason ? `<p><strong>Additional Information:</strong> ${updateData.rejectionReason}</p>` : ''}
            </div>
            
            <p>We encourage you to submit another request with alternative dates or times that might be more accommodating to the current schedule.</p>
            
            <p>If you have any questions or would like to discuss alternatives, please feel free to contact the administration office.</p>
            
            <p>Best regards,<br>University Admin Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} University Administration</p>
          </div>
        </body>
        </html>
      `;
    }
    
    // Send email if subject and content are defined
    if (emailSubject && emailContent) {
      const result = await sendEmail(lecturerEmail, emailSubject, emailContent);
      if (result.success) {
        console.log('Email notification sent successfully');
      } else {
        console.error('Failed to send email:', result.error);
      }
    }
  } catch (emailError) {
    // Log email error but don't fail the request
    console.error('Error in email sending process:', emailError);
  }
} else {
  console.log('No email address found for lecturer. Skipping notification.');
}
    
    res.json({ 
      success: true, 
      message: `Request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating lecturer request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

// Update lecturer request details
exports.updateLecturerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      startTime, 
      endTime, 
      purpose, 
      additionalInfo 
    } = req.body;
    
    // Check if the document exists
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer reservation not found' });
    }
    
    // Create update object with only provided fields
    const updateData = {};
    if (date) updateData.date = date;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (purpose) updateData.purpose = purpose;
    if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo;
    
    // Add last updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Update the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .update(updateData);
    
    // Get the updated document
    const updatedDoc = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    const updatedRequest = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'updated',
      requestId: id,
      request: updatedRequest
    });
    
    res.json({ 
      success: true, 
      message: 'Request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating lecturer request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Delete a lecturer reservation
exports.deleteLecturerReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the document exists
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer reservation not found' });
    }
    
    // Get the document data before deletion (for WebSocket event)
    const deletedRequest = {
      id: docRef.id,
      ...docRef.data()
    };
    
    // Delete the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .delete();
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'deleted',
      requestId: id,
      request: deletedRequest
    });
    
    res.json({ 
      success: true, 
      message: 'Reservation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting lecturer reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};

// Get lecturer reservations by date range
exports.getLecturerRequestsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    // Parse dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(23, 59, 59, 999);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Get all documents and filter by date (Firestore doesn't support range queries on multiple fields)
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const reservationDate = new Date(data.date);
      
      if (reservationDate >= startDateObj && reservationDate <= endDateObj) {
        lecturerRequests.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    res.json(lecturerRequests);
  } catch (error) {
    console.error('Error getting lecturer requests by date range:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer requests by date range' });
  }
};

// Get lecturer reservations by room
exports.getLecturerRequestsByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .where('allocatedRoom', '==', room)
      .where('status', '==', 'approved')
      .get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(lecturerRequests);
  } catch (error) {
    console.error(`Error getting lecturer requests for room ${req.params.room}:`, error);
    res.status(500).json({ error: `Failed to fetch lecturer requests for room ${req.params.room}` });
  }
};
