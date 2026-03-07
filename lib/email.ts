import nodemailer from "nodemailer";

// Configure your email service here
// For Gmail: use an App Password (not your regular password)
// For other services: adjust the SMTP configuration accordingly

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...options,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export function generateAppointmentEmail(
  vetEmail: string,
  userName: string,
  userEmail: string,
  appointmentDate: Date,
  reason: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Appointment Booking</h2>
      <p>You have received a new appointment booking:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Patient Name:</strong> ${userName}</p>
        <p><strong>Patient Email:</strong> ${userEmail}</p>
        <p><strong>Appointment Date:</strong> ${appointmentDate.toLocaleString()}</p>
        <p><strong>Reason for Visit:</strong> ${reason}</p>
      </div>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Please log in to your account to confirm or reschedule this appointment.
      </p>
    </div>
  `;
}

export function generateConfirmationEmail(
  userName: string,
  appointmentDate: Date,
  reason: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Appointment Confirmed</h2>
      <p>Your appointment has been successfully booked!</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Appointment Date:</strong> ${appointmentDate.toLocaleString()}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <p style="margin-top: 20px;">
        We look forward to seeing you soon! If you need to reschedule, please contact us.
      </p>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Please do not reply to this email. Contact us through our website.
      </p>
    </div>
  `;
}
